-- ==============================================================================
-- MUSKAAN MIGRATION: ADD ATTEMPT TRACKING TO SUBMISSIONS
-- ==============================================================================
-- This migration ensures that all test attempts are stored in the database for each user.
-- If a user retakes a test, earlier attempt reports are preserved and accessible
-- to both the user and the admin.

-- 1. Add attempt_number column to public.submissions if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'submissions' 
      AND column_name = 'attempt_number'
  ) THEN
    ALTER TABLE public.submissions ADD COLUMN attempt_number integer DEFAULT 1 NOT NULL;
  END IF;
END $$;

-- 2. Backfill sequential attempt numbers for any existing submissions based on submitted_at
WITH ranked AS (
  SELECT 
    id, 
    ROW_NUMBER() OVER (
      PARTITION BY user_id, test_id 
      ORDER BY submitted_at ASC
    ) as calc_attempt
  FROM public.submissions
)
UPDATE public.submissions s
SET attempt_number = ranked.calc_attempt
FROM ranked
WHERE s.id = ranked.id AND (s.attempt_number IS NULL OR s.attempt_number = 1);

-- 3. Add index for fast retrieval of attempts per user and test
CREATE INDEX IF NOT EXISTS idx_submissions_user_test_attempt 
  ON public.submissions(user_id, test_id, attempt_number DESC);

-- 4. Update the submit_test grading function to automatically calculate attempt_number
CREATE OR REPLACE FUNCTION public.submit_test(
  p_test_id uuid,
  p_answers jsonb, -- Map of { question_id: answer_value }
  p_time_spent_seconds integer default 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_submission_id uuid;
  v_attempt_number integer := 1;
  v_q record;
  v_total_score numeric(5,2) := 0;
  v_total_points numeric(5,2) := 0;
  v_user_ans text;
  v_is_correct boolean;
  v_points numeric(5,2);
  v_pct numeric(5,2);
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Determine sequential attempt number for this user and test
  SELECT COALESCE(MAX(attempt_number), 0) + 1
  INTO v_attempt_number
  FROM public.submissions
  WHERE user_id = v_user_id AND test_id = p_test_id;

  -- Calculate total points and score
  FOR v_q IN 
    SELECT id, correct_answer, points, question_type
    FROM public.questions
    WHERE test_id = p_test_id
  LOOP
    v_total_points := v_total_points + v_q.points;
  END LOOP;

  -- Create submission row with attempt_number
  INSERT INTO public.submissions (test_id, user_id, score, total_points, percentage, time_spent_seconds, attempt_number)
  VALUES (p_test_id, v_user_id, 0, v_total_points, 0, p_time_spent_seconds, v_attempt_number)
  RETURNING id INTO v_submission_id;

  -- Evaluate each question
  FOR v_q IN 
    SELECT id, correct_answer, points, question_type
    FROM public.questions
    WHERE test_id = p_test_id
  LOOP
    v_user_ans := p_answers->>v_q.id::text;
    v_is_correct := false;
    v_points := 0;

    IF v_user_ans IS NOT NULL THEN
      IF LOWER(TRIM(v_user_ans)) = LOWER(TRIM(v_q.correct_answer)) THEN
        v_is_correct := true;
        v_points := v_q.points;
        v_total_score := v_total_score + v_points;
      END IF;
    END IF;

    INSERT INTO public.submission_answers (submission_id, question_id, user_answer, is_correct, points_awarded)
    VALUES (v_submission_id, v_q.id, v_user_ans, v_is_correct, v_points);
  END LOOP;

  IF v_total_points > 0 THEN
    v_pct := ROUND((v_total_score / v_total_points) * 100, 2);
  ELSE
    v_pct := 0;
  END IF;

  -- Update submission with final score
  UPDATE public.submissions
  SET score = v_total_score,
      percentage = v_pct
  WHERE id = v_submission_id;

  RETURN jsonb_build_object(
    'submission_id', v_submission_id,
    'score', v_total_score,
    'total_points', v_total_points,
    'percentage', v_pct,
    'attempt_number', v_attempt_number
  );
END;
$$;
