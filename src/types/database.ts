export type UserRole = 'admin' | 'student';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface Question {
  id: string;
  test_id: string;
  question_text: string;
  question_type: QuestionType;
  options?: string[]; // for multiple_choice
  correct_answer: string;
  explanation?: string | null;
  points: number;
  order_index: number;
  created_at?: string;
}

export interface TestPaper {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_points: number;
  is_published: boolean;
  category: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  question_count?: number;
}

export interface Submission {
  id: string;
  test_id: string;
  user_id: string;
  score: number;
  total_points: number;
  percentage: number;
  status: string;
  time_spent_seconds?: number;
  attempt_number: number;
  submitted_at: string;
  // joined fields
  user_email?: string;
  user_name?: string;
  test_title?: string;
}

export interface SubmissionAttemptSummary {
  id: string;
  attempt_number: number;
  score: number;
  total_points: number;
  percentage: number;
  time_spent_seconds?: number;
  submitted_at: string;
}

export interface SubmissionAnswer {
  id: string;
  submission_id: string;
  question_id: string;
  user_answer: string | null;
  is_correct: boolean;
  points_awarded: number;
  // joined fields
  question?: Question;
}

export interface UserTestAccess {
  id: string;
  user_id: string;
  user_email?: string;
  test_id: string;
  is_active: boolean;
  updated_at?: string;
}

export interface DetailedSubmission extends Submission {
  answers: (SubmissionAnswer & { question: Question })[];
  test: TestPaper;
  other_attempts?: SubmissionAttemptSummary[];
}
