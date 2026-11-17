import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  Profile,
  TestPaper,
  Question,
  Submission,
  DetailedSubmission,
  UserRole,
  UserTestAccess
} from '../types/database';
import {
  INITIAL_PROFILES,
  INITIAL_TESTS,
  INITIAL_QUESTIONS,
  INITIAL_SUBMISSIONS
} from '../lib/mockData';

// Local storage keys for mock persistence
const STORAGE_KEYS = {
  CURRENT_USER: 'muskaan_current_user',
  TESTS: 'muskaan_tests_v2',
  QUESTIONS: 'muskaan_questions_v2',
  SUBMISSIONS: 'muskaan_submissions_v2',
  SUBMISSION_ANSWERS: 'muskaan_submission_answers_v2',
  PROFILES: 'muskaan_profiles_v2',
  USER_TEST_ACCESS: 'muskaan_user_test_access_v1',
};

// UUID validation helper
function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

// Initialize Mock Store
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error', e);
  }
}

// Ensure mock storage is seeded
const SEED_VERSION_KEY = 'muskaan_lnat_seeded_v4';

export function seedInitialDataIfNeeded() {
  const isAlreadySeeded = localStorage.getItem(SEED_VERSION_KEY) === 'true';
  const existingTests = getStored<any[]>(STORAGE_KEYS.TESTS, []);

  if (!isAlreadySeeded || !existingTests.length) {
    setStored(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    setStored(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    localStorage.setItem(SEED_VERSION_KEY, 'true');
  }

  const existingSubs = getStored<any[]>(STORAGE_KEYS.SUBMISSIONS, []);
  if (!existingSubs.length) {
    setStored(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  }

  const existingProfiles = getStored<any[]>(STORAGE_KEYS.PROFILES, []);
  if (!existingProfiles.length) {
    setStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  }
}

// ----------------------------------------------------------------------
// AUTH SERVICE
// ----------------------------------------------------------------------
export const authService = {
  async getCurrentProfile(): Promise<Profile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) return profile as Profile;

          const fallbackProfile: Profile = {
            id: user.id,
            email: user.email || '',
            role: (user.user_metadata?.role as UserRole) || 'student',
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          };

          // Try to self-heal the profile row in Supabase
          try {
            await supabase.from('profiles').upsert({
              id: fallbackProfile.id,
              email: fallbackProfile.email,
              role: fallbackProfile.role,
              full_name: fallbackProfile.full_name,
            });
          } catch {
            // Ignore if RLS blocks
          }

          return fallbackProfile;
        }
      } catch (e) {
        console.warn('Supabase auth check failed:', e);
      }

      // If no remote Supabase session, check if a local user was logged in
      const localUser = getStored<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
      if (localUser) return localUser;
      return null;
    } else {
      seedInitialDataIfNeeded();
      return getStored<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
    }
  },

  async login(email: string, password: string, mockRoleOverride?: UserRole): Promise<{ profile: Profile; error?: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        // Friendly messaging for unconfirmed emails
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          return {
            profile: null as any,
            error: 'Email has not been confirmed yet. Please verify your email inbox, or disable "Confirm email" in Supabase Auth Settings to allow instant sign in.'
          };
        }

        return { profile: null as any, error: error.message };
      }

      const profile = await this.getCurrentProfile();
      if (!profile) return { profile: null as any, error: 'User profile not found' };
      setStored(STORAGE_KEYS.CURRENT_USER, profile);
      return { profile };
    } else {
      seedInitialDataIfNeeded();
      const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
      let match = profiles.find((p) => p.email.toLowerCase() === normalizedEmail);

      if (!match) {
        // In local sandbox mode, create the account seamlessly for testing
        const newProfile: Profile = {
          id: 'user-' + Math.random().toString(36).substring(2, 9),
          email: normalizedEmail,
          role: mockRoleOverride || 'student',
          full_name: normalizedEmail.split('@')[0],
          created_at: new Date().toISOString(),
        };
        profiles.push(newProfile);
        setStored(STORAGE_KEYS.PROFILES, profiles);
        setStored(STORAGE_KEYS.CURRENT_USER, newProfile);
        return { profile: newProfile };
      }

      setStored(STORAGE_KEYS.CURRENT_USER, match);
      return { profile: match };
    }
  },

  async signup(
    email: string,
    password: string,
    fullName: string,
    role: UserRole = 'student'
  ): Promise<{ profile: Profile; error?: string; requiresEmailConfirmation?: boolean }> {
    const normalizedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error) {
        if (error.message?.toLowerCase().includes('rate limit') || (error as any).code === 'over_email_send_rate_limit') {
          return {
            profile: null as any,
            error: 'Supabase email rate limit exceeded (3/hr on free tier). Disable "Confirm email" in Supabase Dashboard (Authentication -> Providers -> Email) for instant signups without emails.',
          };
        }
        return { profile: null as any, error: error.message };
      }

      // Check if Supabase requires email confirmation (session is null)
      if (!data.session) {
        return {
          profile: null as any,
          requiresEmailConfirmation: true,
          error: `Verification email sent to ${normalizedEmail}! Please check your email to confirm your account, or disable "Confirm email" in your Supabase Auth settings to log in immediately.`,
        };
      }

      const profile: Profile = {
        id: data.user!.id,
        email: normalizedEmail,
        full_name: fullName,
        role,
        created_at: new Date().toISOString(),
      };
      setStored(STORAGE_KEYS.CURRENT_USER, profile);
      return { profile };
    } else {
      seedInitialDataIfNeeded();
      const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
      const newProfile: Profile = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email: normalizedEmail,
        role,
        full_name: fullName,
        created_at: new Date().toISOString(),
      };
      profiles.push(newProfile);
      setStored(STORAGE_KEYS.PROFILES, profiles);
      setStored(STORAGE_KEYS.CURRENT_USER, newProfile);
      return { profile: newProfile };
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error', e);
      }
    }
  },

  switchMockUser(role: UserRole): Profile | null {
    seedInitialDataIfNeeded();
    const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const target = profiles.find((p) => p.role === role) || null;
    if (target) {
      setStored(STORAGE_KEYS.CURRENT_USER, target);
    }
    return target;
  }
};

// ----------------------------------------------------------------------
// TESTS SERVICE
// ----------------------------------------------------------------------
export const testsService = {
  async getTests(isAdmin = false): Promise<TestPaper[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('tests')
          .select('*, questions(count)')
          .order('created_at', { ascending: false });

        if (!isAdmin) {
          query = query.eq('is_published', true);
        }

        const { data, error } = await query;
        if (error) throw error;

        return (data || []).map((row: any) => ({
          ...row,
          question_count: row.questions?.[0]?.count ?? 0,
        })) as TestPaper[];
      } catch (err) {
        console.warn('Supabase getTests error, falling back to local storage:', err);
      }
    }

    seedInitialDataIfNeeded();
    const tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    const questions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);

    const testsWithCount = tests.map(t => ({
      ...t,
      question_count: questions.filter(q => q.test_id === t.id).length
    }));

    if (!isAdmin) {
      return testsWithCount.filter((t) => t.is_published);
    }
    return testsWithCount;
  },

  async getTestById(id: string): Promise<{ test: TestPaper; questions: Question[] } | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: test, error: testErr } = await supabase
          .from('tests')
          .select('*')
          .eq('id', id)
          .single();

        if (test && !testErr) {
          const { data: questions, error: qErr } = await supabase
            .from('questions')
            .select('*')
            .eq('test_id', id)
            .order('order_index', { ascending: true });

          if (!qErr) {
            return {
              test: { ...(test as TestPaper), question_count: (questions || []).length },
              questions: (questions || []) as Question[],
            };
          }
        }
      } catch (err) {
        console.warn('Supabase getTestById error, trying local storage:', err);
      }
    }

    seedInitialDataIfNeeded();
    const tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    const test = tests.find((t) => t.id === id);
    if (!test) return null;

    const questions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    const testQuestions = questions
      .filter((q) => q.test_id === id)
      .sort((a, b) => a.order_index - b.order_index);

    return {
      test: { ...test, question_count: testQuestions.length },
      questions: testQuestions,
    };
  },

  async createTest(
    testData: {
      title: string;
      description?: string;
      duration_minutes: number;
      category?: string;
      is_published?: boolean;
    },
    questionsData: {
      question_text: string;
      question_type: Question['question_type'];
      options?: string[];
      correct_answer: string;
      explanation?: string;
      points: number;
    }[]
  ): Promise<TestPaper> {
    const totalPoints = questionsData.reduce((sum, q) => sum + (Number(q.points) || 1), 0);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data: newTest, error: testError } = await supabase
          .from('tests')
          .insert({
            title: testData.title,
            description: testData.description || null,
            duration_minutes: Number(testData.duration_minutes) || 30,
            category: testData.category || 'General',
            is_published: testData.is_published ?? true,
            total_points: totalPoints,
            created_by: user?.id || null,
          })
          .select()
          .single();

        if (testError) throw testError;

        if (questionsData.length > 0 && newTest) {
          const rows = questionsData.map((q, idx) => ({
            test_id: newTest.id,
            question_text: q.question_text,
            question_type: q.question_type,
            options: q.options || [],
            correct_answer: q.correct_answer,
            explanation: q.explanation || null,
            points: Number(q.points) || 1,
            order_index: idx,
          }));

          const { error: qError } = await supabase.from('questions').insert(rows);
          if (qError) throw qError;
        }

        return {
          ...(newTest as TestPaper),
          question_count: questionsData.length,
        };
      } catch (err) {
        console.warn('Supabase test creation error (RLS or unauthenticated), storing locally:', err);
      }
    }

    // Local Storage Persistence Fallback
    seedInitialDataIfNeeded();
    const currentProfile = getStored<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
    const tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    const questions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);

    const testId = 'test-' + Date.now();
    const newTest: TestPaper = {
      id: testId,
      title: testData.title,
      description: testData.description || null,
      duration_minutes: Number(testData.duration_minutes) || 30,
      total_points: totalPoints,
      is_published: testData.is_published ?? true,
      category: testData.category || 'General',
      created_by: currentProfile?.id || 'admin',
      created_at: new Date().toISOString(),
      question_count: questionsData.length,
    };

    const newQuestions: Question[] = questionsData.map((q, idx) => ({
      id: 'q-' + Date.now() + '-' + idx,
      test_id: testId,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options || [],
      correct_answer: q.correct_answer,
      explanation: q.explanation || null,
      points: Number(q.points) || 1,
      order_index: idx,
    }));

    tests.unshift(newTest);
    questions.push(...newQuestions);

    setStored(STORAGE_KEYS.TESTS, tests);
    setStored(STORAGE_KEYS.QUESTIONS, questions);

    return newTest;
  },

  async updateTest(
    testId: string,
    testData: {
      title: string;
      description?: string;
      duration_minutes: number;
      category?: string;
      is_published?: boolean;
    },
    questionsData: {
      id?: string;
      question_text: string;
      question_type: Question['question_type'];
      options?: string[];
      correct_answer: string;
      explanation?: string;
      points: number;
    }[]
  ): Promise<TestPaper> {
    const totalPoints = questionsData.reduce((sum, q) => sum + (Number(q.points) || 1), 0);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: updatedTest, error: testError } = await supabase
          .from('tests')
          .update({
            title: testData.title,
            description: testData.description ?? null,
            duration_minutes: Number(testData.duration_minutes) || 30,
            category: testData.category || 'General',
            is_published: testData.is_published ?? true,
            total_points: totalPoints,
            updated_at: new Date().toISOString(),
          })
          .eq('id', testId)
          .select()
          .single();

        if (testError) throw testError;

        const { data: existingQuestions, error: fetchErr } = await supabase
          .from('questions')
          .select('id')
          .eq('test_id', testId);

        if (!fetchErr) {
          const existingIds = new Set((existingQuestions || []).map((q: any) => q.id));
          const incomingIds = new Set(questionsData.map((q) => q.id).filter(Boolean));

          const idsToDelete = [...existingIds].filter((id) => !incomingIds.has(id));
          if (idsToDelete.length > 0) {
            await supabase.from('questions').delete().in('id', idsToDelete);
          }

          for (let idx = 0; idx < questionsData.length; idx++) {
            const q = questionsData[idx];
            if (q.id && existingIds.has(q.id)) {
              await supabase
                .from('questions')
                .update({
                  question_text: q.question_text,
                  question_type: q.question_type,
                  options: q.options || [],
                  correct_answer: q.correct_answer,
                  explanation: q.explanation ?? null,
                  points: Number(q.points) || 1,
                  order_index: idx,
                })
                .eq('id', q.id);
            } else {
              await supabase
                .from('questions')
                .insert({
                  test_id: testId,
                  question_text: q.question_text,
                  question_type: q.question_type,
                  options: q.options || [],
                  correct_answer: q.correct_answer,
                  explanation: q.explanation ?? null,
                  points: Number(q.points) || 1,
                  order_index: idx,
                });
            }
          }
        }

        return {
          ...(updatedTest as TestPaper),
          question_count: questionsData.length,
        };
      } catch (err) {
        console.warn('Supabase test update error, updating local storage:', err);
      }
    }

    // Local Storage Persistence Fallback
    seedInitialDataIfNeeded();
    const tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    const testIndex = tests.findIndex((t) => t.id === testId);
    if (testIndex === -1) throw new Error('Test not found');

    const updatedTest: TestPaper = {
      ...tests[testIndex],
      title: testData.title,
      description: testData.description ?? null,
      duration_minutes: Number(testData.duration_minutes) || 30,
      total_points: totalPoints,
      is_published: testData.is_published ?? tests[testIndex].is_published,
      category: testData.category || 'General',
      updated_at: new Date().toISOString(),
      question_count: questionsData.length,
    };
    tests[testIndex] = updatedTest;

    const questions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    const remainingQuestions = questions.filter((q) => q.test_id !== testId);
    const existingTestQuestions = questions.filter((q) => q.test_id === testId);
    const existingMap = new Map(existingTestQuestions.map((q) => [q.id, q]));

    const newQuestionsList: Question[] = questionsData.map((q, idx) => {
      const existing = q.id ? existingMap.get(q.id) : undefined;
      return {
        id: existing ? existing.id : 'q-' + Date.now() + '-' + idx,
        test_id: testId,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options || [],
        correct_answer: q.correct_answer,
        explanation: q.explanation ?? null,
        points: Number(q.points) || 1,
        order_index: idx,
        created_at: existing?.created_at || new Date().toISOString(),
      };
    });

    setStored(STORAGE_KEYS.TESTS, tests);
    setStored(STORAGE_KEYS.QUESTIONS, [...remainingQuestions, ...newQuestionsList]);

    return updatedTest;
  },

  async togglePublish(testId: string, isPublished: boolean): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('tests')
          .update({ is_published: isPublished })
          .eq('id', testId);
      } catch (err) {
        console.warn('Supabase togglePublish error:', err);
      }
    }
    const tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    const test = tests.find(t => t.id === testId);
    if (test) {
      test.is_published = isPublished;
      setStored(STORAGE_KEYS.TESTS, tests);
    }
  },

  async deleteTest(testId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('tests').delete().eq('id', testId);
      } catch (err) {
        console.warn('Supabase deleteTest error:', err);
      }
    }
    let tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    tests = tests.filter(t => t.id !== testId);
    setStored(STORAGE_KEYS.TESTS, tests);

    let questions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    questions = questions.filter(q => q.test_id !== testId);
    setStored(STORAGE_KEYS.QUESTIONS, questions);
  }
};

// ----------------------------------------------------------------------
// SUBMISSIONS & MARKS SERVICE
// ----------------------------------------------------------------------

// Helper to ensure all submissions have consistent, sequential attempt_numbers per (user, test)
function normalizeSubmissionsAttempts(submissions: Submission[]): Submission[] {
  const groups: Record<string, Submission[]> = {};
  for (const s of submissions) {
    const key = `${s.user_id || 'guest'}_${s.test_id}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  }

  for (const key in groups) {
    const list = groups[key];
    // Sort chronologically ascending: oldest submission is Attempt 1, newest is Attempt N
    list.sort(
      (a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
    );

    // Strictly re-assign sequential attempt numbers so no two attempts ever share the same attempt_number
    list.forEach((sub, idx) => {
      sub.attempt_number = idx + 1;
    });
  }

  return submissions;
}

export const submissionsService = {
  async submitTest(
    testId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number
  ): Promise<{ submissionId: string; score: number; totalPoints: number; percentage: number; attemptNumber?: number }> {
    if (isSupabaseConfigured && supabase) {
      // Secure Postgres RPC function
      try {
        const { data, error } = await supabase.rpc('submit_test', {
          p_test_id: testId,
          p_answers: answers,
          p_time_spent_seconds: timeSpentSeconds,
        });

        if (!error && data && data.submission_id) {
          return {
            submissionId: data.submission_id,
            score: Number(data.score),
            totalPoints: Number(data.total_points),
            percentage: Number(data.percentage),
            attemptNumber: Number(data.attempt_number) || 1,
          };
        }
      } catch (err) {
        console.warn('RPC submit_test failed, using direct table insertion fallback:', err);
      }

      return this.clientSideSubmit(testId, answers, timeSpentSeconds, true);
    } else {
      return this.clientSideSubmit(testId, answers, timeSpentSeconds, false);
    }
  },

  async clientSideSubmit(
    testId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number,
    usingSupabase = false
  ) {
    let testData: { test: TestPaper; questions: Question[] } | null = null;
    let currentProfile: Profile | null = null;

    if (usingSupabase && supabase) {
      testData = await testsService.getTestById(testId);
      currentProfile = await authService.getCurrentProfile();
    } else {
      seedInitialDataIfNeeded();
      testData = await testsService.getTestById(testId);
      currentProfile = getStored<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
    }

    if (!testData) throw new Error('Test not found');

    const currentUserId = currentProfile?.id || 'guest';
    const isRealSupabaseUser = isValidUuid(currentProfile?.id);

    // Calculate sequential attempt number
    let attemptNumber = 1;
    if (usingSupabase && supabase && isRealSupabaseUser) {
      try {
        const { data: prior, error } = await supabase
          .from('submissions')
          .select('id, submitted_at')
          .eq('test_id', testId)
          .eq('user_id', currentProfile!.id);
        if (!error && prior && prior.length > 0) {
          attemptNumber = prior.length + 1;
        }
      } catch {
        attemptNumber = 1;
      }
    } else {
      const existing = getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
      const userTestSubs = existing.filter(s => s.test_id === testId && s.user_id === currentUserId);
      const maxPrior = userTestSubs.reduce((max, p) => Math.max(max, p.attempt_number || 0), 0);
      attemptNumber = Math.max(userTestSubs.length, maxPrior) + 1;
    }

    const { test, questions } = testData;
    let totalScore = 0;
    const totalPoints = questions.reduce((acc, q) => acc + (q.points || 1), 0);

    const submissionAnswers: any[] = [];

    questions.forEach((q) => {
      const userAns = answers[q.id]?.trim() || '';
      const isCorrect = userAns.toLowerCase() === q.correct_answer.trim().toLowerCase();
      const pointsAwarded = isCorrect ? q.points : 0;
      totalScore += pointsAwarded;

      submissionAnswers.push({
        id: 'ans-' + Math.random().toString(36).substring(2, 9),
        question_id: q.id,
        user_answer: userAns || null,
        is_correct: isCorrect,
        points_awarded: pointsAwarded,
        question: q,
      });
    });

    const percentage = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0;
    const submissionId = 'sub-' + Date.now();

    const submissionRecord: Submission = {
      id: submissionId,
      test_id: testId,
      user_id: currentUserId,
      score: totalScore,
      total_points: totalPoints,
      percentage,
      status: 'completed',
      time_spent_seconds: timeSpentSeconds,
      attempt_number: attemptNumber,
      submitted_at: new Date().toISOString(),
      user_email: currentProfile?.email || 'student@muskaan.edu',
      user_name: currentProfile?.full_name || 'Student',
      test_title: test.title,
    };

    if (usingSupabase && supabase && isRealSupabaseUser) {
      try {
        // Try inserting with attempt_number
        let subResult = await supabase
          .from('submissions')
          .insert({
            test_id: testId,
            user_id: currentProfile!.id,
            score: totalScore,
            total_points: totalPoints,
            percentage,
            time_spent_seconds: timeSpentSeconds,
            attempt_number: attemptNumber,
          })
          .select()
          .single();

        // If attempt_number column does not exist yet (code 42703), retry without it
        if (subResult.error && (subResult.error.code === '42703' || subResult.error.message?.includes('attempt_number'))) {
          subResult = await supabase
            .from('submissions')
            .insert({
              test_id: testId,
              user_id: currentProfile!.id,
              score: totalScore,
              total_points: totalPoints,
              percentage,
              time_spent_seconds: timeSpentSeconds,
            })
            .select()
            .single();
        }

        if (subResult.data && !subResult.error) {
          const sub = subResult.data;
          const answerRows = submissionAnswers.map(sa => ({
            submission_id: sub.id,
            question_id: sa.question_id,
            user_answer: sa.user_answer,
            is_correct: sa.is_correct,
            points_awarded: sa.points_awarded,
          }));

          await supabase.from('submission_answers').insert(answerRows);

          return {
            submissionId: sub.id,
            score: totalScore,
            totalPoints,
            percentage,
            attemptNumber,
          };
        }
      } catch (err) {
        console.warn('Supabase submission insert failed, storing locally:', err);
      }
    }

    // Local storage persistence
    const submissions = getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    submissions.unshift(submissionRecord);
    setStored(STORAGE_KEYS.SUBMISSIONS, submissions);

    // Store answers
    const allAnswers = getStored<Record<string, any[]>>(STORAGE_KEYS.SUBMISSION_ANSWERS, {});
    allAnswers[submissionId] = submissionAnswers;
    setStored(STORAGE_KEYS.SUBMISSION_ANSWERS, allAnswers);

    return {
      submissionId,
      score: totalScore,
      totalPoints,
      percentage,
      attemptNumber,
    };
  },

  async getSubmissions(userId?: string): Promise<Submission[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('submissions')
          .select('*, tests(title)')
          .order('submitted_at', { ascending: false });

        if (userId && isValidUuid(userId)) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Fetch user profiles separately to avoid PostgREST foreign key joins errors (PGRST200)
        const userIds = [...new Set((data || []).map((r: any) => r.user_id).filter(isValidUuid))];
        const profileMap = new Map<string, { email: string; full_name: string }>();

        if (userIds.length > 0) {
          try {
            const { data: profs } = await supabase
              .from('profiles')
              .select('id, email, full_name')
              .in('id', userIds);
            (profs || []).forEach((p: any) => profileMap.set(p.id, p));
          } catch (pErr) {
            console.warn('Error fetching profiles for submissions:', pErr);
          }
        }

        const remoteList: Submission[] = (data || []).map((row: any) => {
          const prof = profileMap.get(row.user_id);
          return {
            id: row.id,
            test_id: row.test_id,
            user_id: row.user_id,
            score: Number(row.score),
            total_points: Number(row.total_points),
            percentage: Number(row.percentage),
            status: row.status || 'completed',
            time_spent_seconds: row.time_spent_seconds || 0,
            attempt_number: row.attempt_number ? Number(row.attempt_number) : 1,
            submitted_at: row.submitted_at,
            test_title: row.tests?.title || 'Assessment Test',
            user_email: prof?.email || 'student@muskaan.edu',
            user_name: prof?.full_name || 'Student',
          };
        });

        // Include any local demo submissions if present
        const localList = getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, []);
        const filteredLocal = userId ? localList.filter(s => s.user_id === userId) : localList;

        // Merge without duplicates
        const ids = new Set(remoteList.map(r => r.id));
        const combined = [...remoteList];
        for (const loc of filteredLocal) {
          if (!ids.has(loc.id)) {
            combined.push(loc);
          }
        }
        return normalizeSubmissionsAttempts(combined);
      } catch (e) {
        console.warn('Error loading remote submissions, falling back to local storage:', e);
      }
    }

    seedInitialDataIfNeeded();
    const submissions = getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    const tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);

    const enriched: Submission[] = submissions.map((s) => {
      const test = tests.find(t => t.id === s.test_id);
      return {
        ...s,
        attempt_number: s.attempt_number || 1,
        test_title: s.test_title || test?.title || 'Assessment Test',
      };
    });

    const result = userId ? enriched.filter((s) => s.user_id === userId) : enriched;
    return normalizeSubmissionsAttempts(result);
  },

  async getUserTestAttempts(userId: string, testId: string): Promise<Submission[]> {
    const all = await this.getSubmissions(userId);
    return all.filter(s => s.test_id === testId && s.user_id === userId);
  },

  async getSubmissionDetail(submissionId: string): Promise<DetailedSubmission | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sub, error: subErr } = await supabase
          .from('submissions')
          .select('*, tests(*)')
          .eq('id', submissionId)
          .single();

        if (!subErr && sub) {
          // Fetch user profile separately
          let userEmail = 'student@muskaan.edu';
          let userName = 'Student';
          if (sub.user_id && isValidUuid(sub.user_id)) {
            try {
              const { data: prof } = await supabase
                .from('profiles')
                .select('email, full_name')
                .eq('id', sub.user_id)
                .single();
              if (prof) {
                userEmail = prof.email || userEmail;
                userName = prof.full_name || userName;
              }
            } catch {
              // Ignore
            }
          }

          const { data: answers, error: ansErr } = await supabase
            .from('submission_answers')
            .select('*, questions(*)')
            .eq('submission_id', submissionId);

          // Also fetch all other attempts for this user and test so the report has full history navigation
          let otherAttempts: any[] = [];
          try {
            const { data: siblings } = await supabase
              .from('submissions')
              .select('*')
              .eq('test_id', sub.test_id)
              .eq('user_id', sub.user_id)
              .order('submitted_at', { ascending: true });

            if (siblings && siblings.length > 0) {
              otherAttempts = siblings.map((sib: any, idx: number) => ({
                id: sib.id,
                attempt_number: Number(sib.attempt_number) || idx + 1,
                score: Number(sib.score),
                total_points: Number(sib.total_points),
                percentage: Number(sib.percentage),
                time_spent_seconds: sib.time_spent_seconds,
                submitted_at: sib.submitted_at,
              }));
            }
          } catch {
            otherAttempts = [];
          }

          if (!ansErr) {
            const rawSub = sub as any;
            return {
              id: rawSub.id,
              test_id: rawSub.test_id,
              user_id: rawSub.user_id,
              score: Number(rawSub.score),
              total_points: Number(rawSub.total_points),
              percentage: Number(rawSub.percentage),
              status: rawSub.status,
              time_spent_seconds: rawSub.time_spent_seconds,
              attempt_number: Number(rawSub.attempt_number) || 1,
              submitted_at: rawSub.submitted_at,
              test_title: rawSub.tests?.title,
              user_email: userEmail,
              user_name: userName,
              test: rawSub.tests as unknown as TestPaper,
              answers: (answers || []).map((a: any) => ({
                ...a,
                question: a.questions,
              })),
              other_attempts: otherAttempts.length > 0 ? otherAttempts : undefined,
            };
          }
        }
      } catch (e) {
        console.warn('Remote submission detail fetch error, checking local store:', e);
      }
    }

    seedInitialDataIfNeeded();
    const submissions = getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return null;

    const testData = await testsService.getTestById(sub.test_id);
    const allAnswers = getStored<Record<string, any[]>>(STORAGE_KEYS.SUBMISSION_ANSWERS, {});
    let storedAnswers = allAnswers[submissionId] || [];

    // If mock stored answers aren't set yet (for pre-seeded submissions), generate realistic ones from questions
    if (storedAnswers.length === 0 && testData) {
      storedAnswers = testData.questions.map((q, idx) => {
        const isCorrect = idx !== 1;
        return {
          id: 'ans-' + idx,
          submission_id: sub.id,
          question_id: q.id,
          user_answer: isCorrect ? q.correct_answer : (q.options?.[0] || 'Incorrect Answer'),
          is_correct: isCorrect,
          points_awarded: isCorrect ? q.points : 0,
          question: q,
        };
      });
    }

    // Compute siblings for local store
    const siblings = submissions
      .filter(s => s.test_id === sub.test_id && s.user_id === sub.user_id)
      .sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime())
      .map((s, idx) => ({
        id: s.id,
        attempt_number: s.attempt_number || idx + 1,
        score: s.score,
        total_points: s.total_points,
        percentage: s.percentage,
        time_spent_seconds: s.time_spent_seconds,
        submitted_at: s.submitted_at,
      }));

    return {
      ...sub,
      attempt_number: sub.attempt_number || 1,
      test: testData?.test || {
        id: sub.test_id,
        title: sub.test_title || 'Assessment Test',
        description: '',
        duration_minutes: 20,
        total_points: sub.total_points,
        is_published: true,
        category: 'General',
        created_at: new Date().toISOString()
      },
      answers: storedAnswers,
      other_attempts: siblings.length > 0 ? siblings : undefined,
    };
  }
};

// ----------------------------------------------------------------------
// USERS SERVICE
// ----------------------------------------------------------------------
export const usersService = {
  async getUsers(): Promise<Profile[]> {
    seedInitialDataIfNeeded();
    let remoteProfiles: Profile[] = [];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          remoteProfiles = data as Profile[];
        }
      } catch (e) {
        console.warn('Supabase profiles fetch error, using local fallback:', e);
      }
    }

    const localProfiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const map = new Map<string, Profile>();
    for (const p of remoteProfiles) {
      map.set(p.id, p);
    }
    for (const p of localProfiles) {
      if (!map.has(p.id)) {
        map.set(p.id, p);
      }
    }
    return Array.from(map.values());
  },

  async createUser(userData: { email: string; full_name: string; role: UserRole }): Promise<Profile> {
    seedInitialDataIfNeeded();
    const normalizedEmail = userData.email.trim().toLowerCase();
    const newProfile: Profile = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      email: normalizedEmail,
      role: userData.role,
      full_name: userData.full_name.trim(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            email: normalizedEmail,
            full_name: newProfile.full_name,
            role: newProfile.role,
          })
          .select()
          .single();
        if (!error && data) {
          newProfile.id = data.id;
        }
      } catch (err) {
        console.warn('Supabase profile insert error, storing locally:', err);
      }
    }

    const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    profiles.unshift(newProfile);
    setStored(STORAGE_KEYS.PROFILES, profiles);
    return newProfile;
  },

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    if (isSupabaseConfigured && supabase && isValidUuid(userId)) {
      try {
        await supabase
          .from('profiles')
          .update({ role })
          .eq('id', userId);
      } catch (e) {
        console.warn('Supabase update role error:', e);
      }
    }
    const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const p = profiles.find((item) => item.id === userId);
    if (p) {
      p.role = role;
      setStored(STORAGE_KEYS.PROFILES, profiles);
    }
  },

  async deleteUser(userId: string): Promise<void> {
    if (isSupabaseConfigured && supabase && isValidUuid(userId)) {
      try {
        await supabase.from('profiles').delete().eq('id', userId);
      } catch (e) {
        console.warn('Supabase delete user error:', e);
      }
    }
    let profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    profiles = profiles.filter((p) => p.id !== userId);
    setStored(STORAGE_KEYS.PROFILES, profiles);
  }
};

// ----------------------------------------------------------------------
// USER TEST ACCESS SERVICE
// ----------------------------------------------------------------------
export const userTestAccessService = {
  async getAllAccess(): Promise<UserTestAccess[]> {
    seedInitialDataIfNeeded();
    let remoteList: UserTestAccess[] = [];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('user_test_access').select('*');
        if (!error && data) {
          remoteList = data as UserTestAccess[];
        }
      } catch {
        // user_test_access may not be created in Supabase yet; fallback cleanly
      }
    }

    const localList = getStored<UserTestAccess[]>(STORAGE_KEYS.USER_TEST_ACCESS, []);
    const map = new Map<string, UserTestAccess>();
    for (const item of remoteList) {
      map.set(`${item.user_id}_${item.test_id}`, item);
    }
    for (const item of localList) {
      map.set(`${item.user_id}_${item.test_id}`, item);
    }
    return Array.from(map.values());
  },

  async getUserAccessMap(userId: string): Promise<Record<string, boolean>> {
    const all = await this.getAllAccess();
    const userRecords = all.filter((r) => r.user_id === userId);
    const accessMap: Record<string, boolean> = {};
    for (const r of userRecords) {
      accessMap[r.test_id] = r.is_active;
    }
    return accessMap;
  },

  async isTestActiveForUser(userId: string, testId: string): Promise<boolean> {
    const accessMap = await this.getUserAccessMap(userId);
    // By default all tests are deactivated for students; active only if explicitly set to true
    return accessMap[testId] === true;
  },

  async setUserTestAccess(userId: string, testId: string, isActive: boolean): Promise<void> {
    if (isSupabaseConfigured && supabase && isValidUuid(userId) && isValidUuid(testId)) {
      try {
        const { error } = await supabase
          .from('user_test_access')
          .upsert(
            {
              user_id: userId,
              test_id: testId,
              is_active: isActive,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,test_id' }
          );
        if (error) {
          console.warn('Supabase user_test_access upsert error:', error);
        }
      } catch (err) {
        console.warn('Supabase user_test_access upsert exception:', err);
      }
    }

    const records = getStored<UserTestAccess[]>(STORAGE_KEYS.USER_TEST_ACCESS, []);
    const existingIdx = records.findIndex((r) => r.user_id === userId && r.test_id === testId);
    if (existingIdx >= 0) {
      records[existingIdx].is_active = isActive;
      records[existingIdx].updated_at = new Date().toISOString();
    } else {
      records.push({
        id: 'access-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        user_id: userId,
        test_id: testId,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      });
    }
    setStored(STORAGE_KEYS.USER_TEST_ACCESS, records);
  },

  async setBulkUserTestAccess(userId: string, testIds: string[], isActive: boolean): Promise<void> {
    for (const testId of testIds) {
      await this.setUserTestAccess(userId, testId, isActive);
    }
  },

  async setBulkTestUsersAccess(testId: string, userIds: string[], isActive: boolean): Promise<void> {
    for (const userId of userIds) {
      await this.setUserTestAccess(userId, testId, isActive);
    }
  }
};
