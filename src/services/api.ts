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
  DELETED_TEST_IDS: 'muskaan_deleted_test_ids_v1',
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
            .maybeSingle();

          if (profile) return profile as Profile;

          const fallbackProfile: Profile = {
            id: user.id,
            email: user.email || '',
            role: (user.user_metadata?.role as UserRole) || 'student',
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          };

          // Try to self-heal the profile row in Supabase
          try {
            const { data: createdProfile } = await supabase
              .from('profiles')
              .upsert({
                id: fallbackProfile.id,
                email: fallbackProfile.email,
                role: fallbackProfile.role,
                full_name: fallbackProfile.full_name,
              })
              .select()
              .maybeSingle();

            if (createdProfile) return createdProfile as Profile;
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
      const { data, error } = await supabase.auth.signInWithPassword({
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

        if (error.message?.toLowerCase().includes('invalid login credentials')) {
          return {
            profile: null as any,
            error: 'Invalid email or password. Please verify your credentials or click "Create Account" if you have not registered yet.'
          };
        }

        if (error.message?.toLowerCase().includes('invalid api key') || error.message?.toLowerCase().includes('api key')) {
          return {
            profile: null as any,
            error: 'Invalid Supabase API Key. Please verify VITE_SUPABASE_ANON_KEY in your .env file.'
          };
        }

        return { profile: null as any, error: error.message };
      }

      if (!data.user) {
        return { profile: null as any, error: 'User account not found' };
      }

      const profile = await this.getCurrentProfile();
      if (!profile) return { profile: null as any, error: 'User profile could not be loaded' };
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
          role: mockRoleOverride || (normalizedEmail.includes('admin') || normalizedEmail.includes('teacher') ? 'admin' : 'student'),
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
            full_name: fullName.trim(),
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
        if (error.message?.toLowerCase().includes('invalid api key') || error.message?.toLowerCase().includes('api key')) {
          return {
            profile: null as any,
            error: 'Invalid Supabase API Key. Please verify VITE_SUPABASE_ANON_KEY in your .env file.'
          };
        }
        return { profile: null as any, error: error.message };
      }

      // Check if Supabase detected an existing user (empty identities array)
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return {
          profile: null as any,
          error: 'An account with this email already exists. Please switch to "Sign In" to log in.'
        };
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
        full_name: fullName.trim(),
        role,
        created_at: new Date().toISOString(),
      };

      // Ensure profile row exists in Supabase
      try {
        await supabase.from('profiles').upsert({
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
        });
      } catch (e) {
        console.warn('Could not auto-insert profile on signup:', e);
      }

      setStored(STORAGE_KEYS.CURRENT_USER, profile);
      return { profile };
    } else {
      seedInitialDataIfNeeded();
      const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
      const newProfile: Profile = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email: normalizedEmail,
        role,
        full_name: fullName.trim(),
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
// REAL-TIME TESTS SYNC ENGINE
// ----------------------------------------------------------------------
export interface TestChangeEvent {
  action: 'create' | 'update' | 'delete' | 'toggle_publish' | 'access_update';
  testId?: string;
  test?: TestPaper;
  questions?: Question[];
  is_published?: boolean;
  userId?: string;
  userEmail?: string;
  is_active?: boolean;
  accessList?: UserTestAccess[];
  timestamp: number;
}

export type TestChangeCallback = (event: TestChangeEvent) => void;

const testSubscribers = new Set<TestChangeCallback>();

// Cross-tab broadcast channel for instantaneous zero-latency updates
let testBroadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
  try {
    testBroadcastChannel = new BroadcastChannel('testify_test_realtime');
    testBroadcastChannel.onmessage = (event) => {
      if (event.data && typeof event.data === 'object') {
        notifyLocalSubscribers(event.data as TestChangeEvent);
      }
    };
  } catch (err) {
    console.warn('BroadcastChannel not initialized:', err);
  }
}

// Fallback cross-tab listener using storage events
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'testify_test_sync_event' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        notifyLocalSubscribers(parsed);
      } catch { }
    }
  });
}

function applyIncomingEventToStorage(event: TestChangeEvent) {
  try {
    if (event.action === 'delete' && event.testId) {
      const deletedIds = getStored<string[]>(STORAGE_KEYS.DELETED_TEST_IDS, []);
      if (!deletedIds.includes(event.testId)) {
        deletedIds.push(event.testId);
        setStored(STORAGE_KEYS.DELETED_TEST_IDS, deletedIds);
      }
      const tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS).filter((t) => t.id !== event.testId);
      setStored(STORAGE_KEYS.TESTS, tests);
      const questions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS).filter((q) => q.test_id !== event.testId);
      setStored(STORAGE_KEYS.QUESTIONS, questions);
    } else if ((event.action === 'update' || event.action === 'create') && event.test) {
      const deletedIds = getStored<string[]>(STORAGE_KEYS.DELETED_TEST_IDS, []);
      if (deletedIds.includes(event.test.id)) {
        setStored(STORAGE_KEYS.DELETED_TEST_IDS, deletedIds.filter((id) => id !== event.test!.id));
      }

      const tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
      const idx = tests.findIndex((t) => t.id === event.test!.id);
      if (idx >= 0) {
        tests[idx] = event.test;
      } else {
        tests.unshift(event.test);
      }
      setStored(STORAGE_KEYS.TESTS, tests);

      if (event.questions && event.questions.length > 0) {
        const questions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
        const remaining = questions.filter((q) => q.test_id !== event.test!.id);
        setStored(STORAGE_KEYS.QUESTIONS, [...remaining, ...event.questions]);
      }
    } else if (event.action === 'toggle_publish' && event.testId && typeof event.is_published === 'boolean') {
      const tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
      const test = tests.find((t) => t.id === event.testId);
      if (test) {
        test.is_published = event.is_published;
        setStored(STORAGE_KEYS.TESTS, tests);
      }
    } else if (event.action === 'access_update') {
      const records = getStored<UserTestAccess[]>(STORAGE_KEYS.USER_TEST_ACCESS, []);
      if (event.accessList && event.accessList.length > 0) {
        const map = new Map<string, UserTestAccess>();
        for (const r of records) {
          map.set(`${r.user_id}_${r.test_id}`, r);
          if (r.user_email) {
            map.set(`${r.user_email.toLowerCase()}_${r.test_id}`, r);
          }
        }
        for (const item of event.accessList) {
          map.set(`${item.user_id}_${item.test_id}`, item);
          if (item.user_email) {
            map.set(`${item.user_email.toLowerCase()}_${item.test_id}`, item);
          }
        }
        setStored(STORAGE_KEYS.USER_TEST_ACCESS, Array.from(new Set(map.values())));
      } else if (event.userId && event.testId && typeof event.is_active === 'boolean') {
        const isoDate = new Date(event.timestamp || Date.now()).toISOString();
        const existingIdx = records.findIndex((r) =>
          (r.user_id === event.userId && r.test_id === event.testId) ||
          (event.userEmail && r.user_email && r.user_email.toLowerCase() === event.userEmail.toLowerCase() && r.test_id === event.testId)
        );
        const updatedItem: UserTestAccess = {
          id: existingIdx >= 0 ? records[existingIdx].id : 'access-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          user_id: event.userId,
          user_email: event.userEmail,
          test_id: event.testId,
          is_active: event.is_active,
          updated_at: isoDate,
        };
        if (existingIdx >= 0) {
          records[existingIdx] = updatedItem;
        } else {
          records.push(updatedItem);
        }
        setStored(STORAGE_KEYS.USER_TEST_ACCESS, records);
      }
    }
  } catch (err) {
    console.error('Error applying incoming test event to local storage:', err);
  }
}

function notifyLocalSubscribers(event: TestChangeEvent) {
  applyIncomingEventToStorage(event);
  for (const cb of testSubscribers) {
    try {
      cb(event);
    } catch (err) {
      console.error('Error in test change subscriber callback:', err);
    }
  }
}

let supabaseTestChannel: any = null;
let isChannelConnecting = false;

function initSupabaseRealtime() {
  if (!isSupabaseConfigured || !supabase || supabaseTestChannel || isChannelConnecting) return;
  isChannelConnecting = true;

  try {
    supabaseTestChannel = supabase
      .channel('public:test_papers_realtime', {
        config: { broadcast: { self: false } },
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tests' },
        (payload: any) => {
          const action = payload.eventType === 'INSERT'
            ? 'create'
            : payload.eventType === 'DELETE'
              ? 'delete'
              : 'update';
          const test = payload.new as TestPaper | undefined;
          const testId = payload.new?.id || payload.old?.id;
          notifyLocalSubscribers({ action, testId, test, timestamp: Date.now() });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'questions' },
        (payload: any) => {
          const testId = payload.new?.test_id || payload.old?.test_id;
          notifyLocalSubscribers({ action: 'update', testId, timestamp: Date.now() });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_test_access' },
        (payload: any) => {
          const record = payload.new || payload.old;
          const testId = record?.test_id;
          const userId = record?.user_id;
          const isActive = payload.new?.is_active ?? false;
          notifyLocalSubscribers({
            action: 'access_update',
            testId,
            userId,
            is_active: isActive,
            accessList: payload.new ? [payload.new as UserTestAccess] : undefined,
            timestamp: Date.now(),
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload: any) => {
          if (payload.new?.avatar_url && (payload.new.avatar_url.startsWith('access:') || payload.new.avatar_url.startsWith('{'))) {
            try {
              const raw = payload.new.avatar_url.startsWith('access:') ? payload.new.avatar_url.slice(7) : payload.new.avatar_url;
              const parsed = JSON.parse(raw);
              const accessMap: Record<string, boolean> = parsed.test_access || parsed || {};
              const items: UserTestAccess[] = Object.entries(accessMap).map(([testId, isActive]) => ({
                id: `prof-${payload.new.id}-${testId}`,
                user_id: payload.new.id,
                user_email: payload.new.email,
                test_id: testId,
                is_active: Boolean(isActive),
                updated_at: parsed.updated_at || new Date().toISOString(),
              }));
              notifyLocalSubscribers({
                action: 'access_update',
                userId: payload.new.id,
                userEmail: payload.new.email,
                accessList: items,
                timestamp: Date.now(),
              });
            } catch { }
          }
        }
      )
      .on('broadcast', { event: 'test_papers_changed' }, (payload: any) => {
        if (payload?.payload) {
          notifyLocalSubscribers(payload.payload as TestChangeEvent);
        }
      })
      .subscribe((status: string, err: any) => {
        isChannelConnecting = false;
        if (err) {
          console.warn('Supabase realtime channel warning:', status, err);
        }
      });
  } catch (err) {
    isChannelConnecting = false;
    console.warn('Failed to subscribe to Supabase realtime channel:', err);
  }
}

export function broadcastTestChange(event: TestChangeEvent) {
  // 1. Notify local subscribers and persist immediately
  notifyLocalSubscribers(event);

  // 2. Broadcast across tabs in the same browser (sub-millisecond)
  if (testBroadcastChannel) {
    try {
      testBroadcastChannel.postMessage(event);
    } catch { }
  }

  // 3. Fallback to storage event for other tabs
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('testify_test_sync_event', JSON.stringify(event));
    } catch { }
  }

  // 4. Broadcast over Supabase WebSocket to other devices/browsers
  if (isSupabaseConfigured && supabase) {
    initSupabaseRealtime();
    if (supabaseTestChannel) {
      supabaseTestChannel.send({
        type: 'broadcast',
        event: 'test_papers_changed',
        payload: event,
      }).catch((e: any) => {
        console.warn('Supabase broadcast send warning:', e);
      });
    }
  }
}

// ----------------------------------------------------------------------
// TESTS SERVICE
// ----------------------------------------------------------------------
export const testsService = {
  subscribeToTests(callback: TestChangeCallback): () => void {
    initSupabaseRealtime();
    testSubscribers.add(callback);
    return () => {
      testSubscribers.delete(callback);
    };
  },

  async getTests(isAdmin = false): Promise<TestPaper[]> {
    seedInitialDataIfNeeded();
    const localTests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    const localQuestions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    const deletedIds = new Set(getStored<string[]>(STORAGE_KEYS.DELETED_TEST_IDS, []));

    let baseTests: TestPaper[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('tests')
          .select('*, questions(count)')
          .order('created_at', { ascending: false });

        const { data, error } = await query;
        if (!error && data) {
          baseTests = (data || []).map((row: any) => ({
            ...row,
            question_count: row.questions?.[0]?.count ?? 0,
          })) as TestPaper[];
        }
      } catch (err) {
        console.warn('Supabase getTests error, using local tests:', err);
      }
    }

    // Build map of local test papers (holds any local edits, new papers, updated question counts)
    const localMap = new Map<string, TestPaper>();
    for (const t of localTests) {
      const qCount = localQuestions.filter((q) => q.test_id === t.id).length;
      localMap.set(t.id, {
        ...t,
        question_count: qCount > 0 ? qCount : (t.question_count || 0),
      });
    }

    // Merge base tests with local modifications
    const mergedMap = new Map<string, TestPaper>();
    if (baseTests.length > 0) {
      for (const t of baseTests) {
        if (deletedIds.has(t.id)) continue;
        const override = localMap.get(t.id);
        if (override) {
          mergedMap.set(t.id, override);
        } else {
          mergedMap.set(t.id, t);
        }
      }
      for (const [id, t] of localMap.entries()) {
        if (!deletedIds.has(id) && !mergedMap.has(id)) {
          mergedMap.set(id, t);
        }
      }
    } else {
      for (const [id, t] of localMap.entries()) {
        if (!deletedIds.has(id)) {
          mergedMap.set(id, t);
        }
      }
    }

    let results = Array.from(mergedMap.values());
    if (!isAdmin) {
      results = results.filter((t) => t.is_published);
    }
    return results;
  },

  async getTestById(id: string): Promise<{ test: TestPaper; questions: Question[] } | null> {
    seedInitialDataIfNeeded();
    const deletedIds = new Set(getStored<string[]>(STORAGE_KEYS.DELETED_TEST_IDS, []));
    if (deletedIds.has(id)) return null;

    const localTests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    const localQuestions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);

    const testLocal = localTests.find((t) => t.id === id);
    const testQuestionsLocal = localQuestions
      .filter((q) => q.test_id === id)
      .sort((a, b) => a.order_index - b.order_index);

    // If local test has modified questions, return them!
    if (testLocal && testQuestionsLocal.length > 0) {
      return {
        test: { ...testLocal, question_count: testQuestionsLocal.length },
        questions: testQuestionsLocal,
      };
    }

    // Otherwise fetch from Supabase
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
              test: testLocal ? { ...testLocal, question_count: (questions || []).length } : { ...(test as TestPaper), question_count: (questions || []).length },
              questions: (questions || []) as Question[],
            };
          }
        }
      } catch (err) {
        console.warn('Supabase getTestById error, trying local storage:', err);
      }
    }

    if (testLocal) {
      return {
        test: { ...testLocal, question_count: testQuestionsLocal.length },
        questions: testQuestionsLocal,
      };
    }

    return null;
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

    // 1. Initialize local persistent record
    seedInitialDataIfNeeded();
    const currentProfile = getStored<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
    const tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    const questions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);

    const testId = 'test-' + Date.now();
    let newTest: TestPaper = {
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

    let newQuestions: Question[] = questionsData.map((q, idx) => ({
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

    // 2. Try remote Supabase creation if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data: remoteTest, error: testError } = await supabase
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

        if (!testError && remoteTest) {
          newTest = {
            ...(remoteTest as TestPaper),
            question_count: questionsData.length,
          };

          if (questionsData.length > 0) {
            const rows = questionsData.map((q, idx) => ({
              test_id: remoteTest.id,
              question_text: q.question_text,
              question_type: q.question_type,
              options: q.options || [],
              correct_answer: q.correct_answer,
              explanation: q.explanation || null,
              points: Number(q.points) || 1,
              order_index: idx,
            }));

            const { data: remoteQuestions, error: qError } = await supabase.from('questions').insert(rows).select();
            if (!qError && remoteQuestions) {
              newQuestions = remoteQuestions as Question[];
            }
          }
        }
      } catch (err) {
        console.warn('Supabase test creation error (RLS or unauthenticated), storing locally:', err);
      }
    }

    // 3. Save into local persistent store
    tests.unshift(newTest);
    questions.push(...newQuestions);

    setStored(STORAGE_KEYS.TESTS, tests);
    setStored(STORAGE_KEYS.QUESTIONS, questions);

    // 4. Broadcast real-time change to all tabs and devices
    broadcastTestChange({
      action: 'create',
      testId: newTest.id,
      test: newTest,
      questions: newQuestions,
      timestamp: Date.now(),
    });

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

    // 1. Build and persist locally first so update is NEVER lost
    seedInitialDataIfNeeded();
    const tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    const testIndex = tests.findIndex((t) => t.id === testId);

    const updatedTest: TestPaper = {
      ...(testIndex >= 0 ? tests[testIndex] : {}),
      id: testId,
      title: testData.title,
      description: testData.description ?? null,
      duration_minutes: Number(testData.duration_minutes) || 30,
      total_points: totalPoints,
      is_published: testData.is_published ?? (testIndex >= 0 ? tests[testIndex].is_published : true),
      category: testData.category || 'General',
      created_by: (testIndex >= 0 ? tests[testIndex].created_by : null) || 'admin',
      created_at: (testIndex >= 0 ? tests[testIndex].created_at : null) || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      question_count: questionsData.length,
    };

    if (testIndex >= 0) {
      tests[testIndex] = updatedTest;
    } else {
      tests.unshift(updatedTest);
    }

    const questions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    const remainingQuestions = questions.filter((q) => q.test_id !== testId);
    const existingTestQuestions = questions.filter((q) => q.test_id === testId);
    const existingMap = new Map(existingTestQuestions.map((q) => [q.id, q]));

    const newQuestionsList: Question[] = questionsData.map((q, idx) => {
      const existing = q.id ? existingMap.get(q.id) : undefined;
      return {
        id: existing ? existing.id : (q.id || 'q-' + Date.now() + '-' + idx),
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

    // 2. Also try remote Supabase update
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: remoteTest, error: testError } = await supabase
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

        if (!testError && remoteTest) {
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
        }
      } catch (err) {
        console.warn('Supabase test update error, local storage updated:', err);
      }
    }

    // 3. Broadcast real-time change to all subscribers
    broadcastTestChange({
      action: 'update',
      testId,
      test: updatedTest,
      questions: newQuestionsList,
      timestamp: Date.now(),
    });

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
    broadcastTestChange({
      action: 'toggle_publish',
      testId,
      is_published: isPublished,
      timestamp: Date.now(),
    });
  },

  async deleteTest(testId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('tests').delete().eq('id', testId);
      } catch (err) {
        console.warn('Supabase deleteTest error:', err);
      }
    }
    const deletedIds = getStored<string[]>(STORAGE_KEYS.DELETED_TEST_IDS, []);
    if (!deletedIds.includes(testId)) {
      deletedIds.push(testId);
      setStored(STORAGE_KEYS.DELETED_TEST_IDS, deletedIds);
    }

    let tests = getStored<TestPaper[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    tests = tests.filter(t => t.id !== testId);
    setStored(STORAGE_KEYS.TESTS, tests);

    let questions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    questions = questions.filter(q => q.test_id !== testId);
    setStored(STORAGE_KEYS.QUESTIONS, questions);

    broadcastTestChange({ action: 'delete', testId, timestamp: Date.now() });
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
      // 1. Try public.user_test_access table in Supabase
      try {
        const { data, error } = await supabase.from('user_test_access').select('*');
        if (!error && data && data.length > 0) {
          remoteList = data as UserTestAccess[];
        }
      } catch {
        // Table may not exist yet or schema cache not loaded
      }

      // 2. Resilient fallback: Also check public.profiles (avatar_url fallback) in Supabase.
      // Since profiles table is always present and readable by all users, this ensures
      // that admin activations persist and sync across devices even without running DDL migrations.
      try {
        const { data: profiles, error: profErr } = await supabase
          .from('profiles')
          .select('id, email, avatar_url');
        if (!profErr && profiles) {
          for (const p of profiles) {
            if (p.avatar_url && (p.avatar_url.startsWith('access:') || p.avatar_url.startsWith('{'))) {
              try {
                const raw = p.avatar_url.startsWith('access:')
                  ? p.avatar_url.slice(7)
                  : p.avatar_url;
                const parsed = JSON.parse(raw);
                const accessMap: Record<string, boolean> = parsed.test_access || parsed || {};
                const updatedAt = parsed.updated_at || new Date().toISOString();
                for (const [testId, isActive] of Object.entries(accessMap)) {
                  const existingIdx = remoteList.findIndex((r) => r.user_id === p.id && r.test_id === testId);
                  if (existingIdx < 0) {
                    remoteList.push({
                      id: `prof-${p.id}-${testId}`,
                      user_id: p.id,
                      user_email: p.email,
                      test_id: testId,
                      is_active: Boolean(isActive),
                      updated_at: updatedAt,
                    });
                  }
                }
              } catch { }
            }
          }
        }
      } catch { }
    }

    const localList = getStored<UserTestAccess[]>(STORAGE_KEYS.USER_TEST_ACCESS, []);
    const map = new Map<string, UserTestAccess>();

    // Start with local items
    for (const item of localList) {
      map.set(`${item.user_id}_${item.test_id}`, item);
    }

    // Merge remote items: remote takes precedence if newer timestamp or if local is missing
    for (const item of remoteList) {
      const key = `${item.user_id}_${item.test_id}`;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, item);
      } else {
        const remoteTime = item.updated_at ? new Date(item.updated_at).getTime() : 0;
        const localTime = existing.updated_at ? new Date(existing.updated_at).getTime() : 0;
        if (remoteTime >= localTime) {
          map.set(key, item);
        }
      }
    }

    const merged = Array.from(map.values());
    setStored(STORAGE_KEYS.USER_TEST_ACCESS, merged);
    return merged;
  },

  async getUserAccessMap(userId: string, userEmail?: string): Promise<Record<string, boolean>> {
    const all = await this.getAllAccess();
    const normalizedEmail = userEmail?.trim().toLowerCase();
    const userRecords = all.filter((r) =>
      r.user_id === userId ||
      (normalizedEmail && r.user_email && r.user_email.toLowerCase() === normalizedEmail)
    );
    const accessMap: Record<string, boolean> = {};
    for (const r of userRecords) {
      accessMap[r.test_id] = r.is_active;
    }
    return accessMap;
  },

  async isTestActiveForUser(userId: string, testId: string, userEmail?: string): Promise<boolean> {
    const accessMap = await this.getUserAccessMap(userId, userEmail);
    // By default all tests are deactivated for students; active only if explicitly set to true
    return accessMap[testId] === true;
  },

  async setUserTestAccess(userId: string, testId: string, isActive: boolean, userEmail?: string): Promise<void> {
    const timestamp = Date.now();
    const isoDate = new Date(timestamp).toISOString();

    // 1. Remote Supabase: Try user_test_access table
    if (isSupabaseConfigured && supabase && isValidUuid(userId) && isValidUuid(testId)) {
      try {
        const { error } = await supabase
          .from('user_test_access')
          .upsert(
            {
              user_id: userId,
              test_id: testId,
              is_active: isActive,
              updated_at: isoDate,
            },
            { onConflict: 'user_id,test_id' }
          );
        if (error && error.code !== 'PGRST205') {
          console.warn('Supabase user_test_access upsert error:', error);
        }
      } catch (err) {
        console.warn('Supabase user_test_access upsert exception:', err);
      }
    }

    // 2. Remote Supabase: Resilient sync via profiles fallback
    if (isSupabaseConfigured && supabase && isValidUuid(userId)) {
      try {
        const { data: prof } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', userId)
          .maybeSingle();

        let accessMap: Record<string, boolean> = {};
        if (prof?.avatar_url) {
          try {
            const raw = prof.avatar_url.startsWith('access:')
              ? prof.avatar_url.slice(7)
              : prof.avatar_url;
            const parsed = JSON.parse(raw);
            accessMap = parsed.test_access || parsed || {};
          } catch { }
        }
        accessMap[testId] = isActive;
        const newAvatarUrl = 'access:' + JSON.stringify({
          test_access: accessMap,
          updated_at: isoDate,
        });

        await supabase
          .from('profiles')
          .update({ avatar_url: newAvatarUrl })
          .eq('id', userId);
      } catch (err) {
        console.warn('Supabase profile test access sync error:', err);
      }
    }

    // 3. Local Storage update
    const records = getStored<UserTestAccess[]>(STORAGE_KEYS.USER_TEST_ACCESS, []);
    const normalizedEmail = userEmail?.trim().toLowerCase();
    const existingIdx = records.findIndex((r) =>
      (r.user_id === userId && r.test_id === testId) ||
      (normalizedEmail && r.user_email && r.user_email.toLowerCase() === normalizedEmail && r.test_id === testId)
    );
    const updatedRecord: UserTestAccess = {
      id: existingIdx >= 0 ? records[existingIdx].id : 'access-' + timestamp + '-' + Math.random().toString(36).substring(2, 6),
      user_id: userId,
      user_email: userEmail,
      test_id: testId,
      is_active: isActive,
      updated_at: isoDate,
    };
    if (existingIdx >= 0) {
      records[existingIdx] = updatedRecord;
    } else {
      records.push(updatedRecord);
    }
    setStored(STORAGE_KEYS.USER_TEST_ACCESS, records);

    // 4. Real-time broadcast
    broadcastTestChange({
      action: 'access_update',
      testId,
      userId,
      userEmail,
      is_active: isActive,
      accessList: [updatedRecord],
      timestamp,
    });
  },

  async setBulkUserTestAccess(userId: string, testIds: string[], isActive: boolean, userEmail?: string): Promise<void> {
    const timestamp = Date.now();
    const isoDate = new Date(timestamp).toISOString();

    // 1. Remote Supabase: Try user_test_access batch upsert
    if (isSupabaseConfigured && supabase && isValidUuid(userId)) {
      const validTestIds = testIds.filter(isValidUuid);
      if (validTestIds.length > 0) {
        try {
          const payload = validTestIds.map((tid) => ({
            user_id: userId,
            test_id: tid,
            is_active: isActive,
            updated_at: isoDate,
          }));
          await supabase.from('user_test_access').upsert(payload, { onConflict: 'user_id,test_id' });
        } catch { }
      }
    }

    // 2. Remote Supabase: Resilient sync via profiles fallback
    if (isSupabaseConfigured && supabase && isValidUuid(userId)) {
      try {
        const { data: prof } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', userId)
          .maybeSingle();

        let accessMap: Record<string, boolean> = {};
        if (prof?.avatar_url) {
          try {
            const raw = prof.avatar_url.startsWith('access:')
              ? prof.avatar_url.slice(7)
              : prof.avatar_url;
            const parsed = JSON.parse(raw);
            accessMap = parsed.test_access || parsed || {};
          } catch { }
        }
        for (const tid of testIds) {
          accessMap[tid] = isActive;
        }
        const newAvatarUrl = 'access:' + JSON.stringify({
          test_access: accessMap,
          updated_at: isoDate,
        });
        await supabase
          .from('profiles')
          .update({ avatar_url: newAvatarUrl })
          .eq('id', userId);
      } catch (err) {
        console.warn('Bulk profile access sync error:', err);
      }
    }

    // 3. Local Storage update
    const records = getStored<UserTestAccess[]>(STORAGE_KEYS.USER_TEST_ACCESS, []);
    const normalizedEmail = userEmail?.trim().toLowerCase();
    const newItems: UserTestAccess[] = [];

    for (const tid of testIds) {
      const existingIdx = records.findIndex((r) =>
        (r.user_id === userId && r.test_id === tid) ||
        (normalizedEmail && r.user_email && r.user_email.toLowerCase() === normalizedEmail && r.test_id === tid)
      );
      const item: UserTestAccess = {
        id: existingIdx >= 0 ? records[existingIdx].id : 'access-' + timestamp + '-' + Math.random().toString(36).substring(2, 6),
        user_id: userId,
        user_email: userEmail,
        test_id: tid,
        is_active: isActive,
        updated_at: isoDate,
      };
      if (existingIdx >= 0) {
        records[existingIdx] = item;
      } else {
        records.push(item);
      }
      newItems.push(item);
    }
    setStored(STORAGE_KEYS.USER_TEST_ACCESS, records);

    // 4. Real-time broadcast
    broadcastTestChange({
      action: 'access_update',
      userId,
      userEmail,
      is_active: isActive,
      accessList: newItems,
      timestamp,
    });
  },

  async setBulkTestUsersAccess(testId: string, users: Array<string | { id: string; email?: string }>, isActive: boolean): Promise<void> {
    const timestamp = Date.now();
    const isoDate = new Date(timestamp).toISOString();

    const normalizedUsers: Array<{ id: string; email?: string }> = users.map((u) =>
      typeof u === 'string' ? { id: u } : u
    );

    // 1. Remote Supabase: Try user_test_access batch upsert
    if (isSupabaseConfigured && supabase && isValidUuid(testId)) {
      const validUserIds = normalizedUsers.map((u) => u.id).filter(isValidUuid);
      if (validUserIds.length > 0) {
        try {
          const payload = validUserIds.map((uid) => ({
            user_id: uid,
            test_id: testId,
            is_active: isActive,
            updated_at: isoDate,
          }));
          await supabase.from('user_test_access').upsert(payload, { onConflict: 'user_id,test_id' });
        } catch { }
      }
    }

    // 2. Remote Supabase: Update each user's profile fallback
    if (isSupabaseConfigured && supabase) {
      const sb = supabase;
      await Promise.all(
        normalizedUsers
          .filter((u) => isValidUuid(u.id))
          .map(async (u) => {
            try {
              const { data: prof } = await sb
                .from('profiles')
                .select('avatar_url')
                .eq('id', u.id)
                .maybeSingle();
              let accessMap: Record<string, boolean> = {};
              if (prof?.avatar_url) {
                try {
                  const raw = prof.avatar_url.startsWith('access:') ? prof.avatar_url.slice(7) : prof.avatar_url;
                  const parsed = JSON.parse(raw);
                  accessMap = parsed.test_access || parsed || {};
                } catch { }
              }
              accessMap[testId] = isActive;
              await sb
                .from('profiles')
                .update({
                  avatar_url: 'access:' + JSON.stringify({
                    test_access: accessMap,
                    updated_at: isoDate,
                  }),
                })
                .eq('id', u.id);
            } catch { }
          })
      );
    }

    // 3. Local Storage update
    const records = getStored<UserTestAccess[]>(STORAGE_KEYS.USER_TEST_ACCESS, []);
    const newItems: UserTestAccess[] = [];

    for (const u of normalizedUsers) {
      const normalizedEmail = u.email?.trim().toLowerCase();
      const existingIdx = records.findIndex((r) =>
        (r.user_id === u.id && r.test_id === testId) ||
        (normalizedEmail && r.user_email && r.user_email.toLowerCase() === normalizedEmail && r.test_id === testId)
      );
      const item: UserTestAccess = {
        id: existingIdx >= 0 ? records[existingIdx].id : 'access-' + timestamp + '-' + Math.random().toString(36).substring(2, 6),
        user_id: u.id,
        user_email: u.email,
        test_id: testId,
        is_active: isActive,
        updated_at: isoDate,
      };
      if (existingIdx >= 0) {
        records[existingIdx] = item;
      } else {
        records.push(item);
      }
      newItems.push(item);
    }
    setStored(STORAGE_KEYS.USER_TEST_ACCESS, records);

    // 4. Real-time broadcast
    broadcastTestChange({
      action: 'access_update',
      testId,
      is_active: isActive,
      accessList: newItems,
      timestamp,
    });
  }
};
