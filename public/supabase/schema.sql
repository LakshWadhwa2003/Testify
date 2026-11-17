-- ==============================================================================
-- MUSKAAN QUIZ & ASSESSMENT PLATFORM - SUPABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. Create Profiles Table (Linked with Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text not null check (role in ('admin', 'student')) default 'student',
  full_name text,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

create policy "Users can view all profiles or own" 
  on public.profiles for select 
  using (true);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

create policy "Admins can manage all profiles"
  on public.profiles for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    role = coalesce(excluded.role, profiles.role);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Tests Table
create table if not exists public.tests (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  duration_minutes integer default 30 not null,
  total_points integer default 0 not null,
  is_published boolean default false not null,
  category text default 'General',
  created_by uuid references auth.users,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.tests enable row level security;

-- Policies for Tests
create policy "Anyone authenticated can view published tests"
  on public.tests for select
  using (
    auth.role() = 'authenticated' and (
      is_published = true or 
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    )
  );

create policy "Admins can manage tests"
  on public.tests for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 3. Questions Table
create table if not exists public.questions (
  id uuid default gen_random_uuid() primary key,
  test_id uuid references public.tests on delete cascade not null,
  question_text text not null,
  question_type text check (question_type in ('multiple_choice', 'true_false', 'short_answer')) default 'multiple_choice' not null,
  options jsonb default '[]'::jsonb, -- array of string options
  correct_answer text not null,
  explanation text,
  points integer default 1 not null,
  order_index integer default 0 not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.questions enable row level security;

-- Policies for Questions
create policy "Users can view questions for available tests"
  on public.questions for select
  using (
    exists (
      select 1 from public.tests 
      where tests.id = questions.test_id 
      and (tests.is_published = true or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
    )
  );

create policy "Admins can manage questions"
  on public.questions for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 4. Submissions Table (Stores every test attempt for a user; retakes create new attempts)
create table if not exists public.submissions (
  id uuid default gen_random_uuid() primary key,
  test_id uuid references public.tests on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  score numeric(5,2) default 0 not null,
  total_points numeric(5,2) default 0 not null,
  percentage numeric(5,2) default 0 not null,
  status text default 'completed' not null,
  time_spent_seconds integer default 0,
  attempt_number integer default 1 not null,
  submitted_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_submissions_user_test_attempt 
  on public.submissions(user_id, test_id, attempt_number desc);

alter table public.submissions enable row level security;

create policy "Users can view own submissions"
  on public.submissions for select
  using (
    auth.uid() = user_id or 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can insert own submissions"
  on public.submissions for insert
  with check (auth.uid() = user_id);

-- 5. Submission Answers Table
create table if not exists public.submission_answers (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid references public.submissions on delete cascade not null,
  question_id uuid references public.questions on delete cascade not null,
  user_answer text,
  is_correct boolean default false not null,
  points_awarded numeric(5,2) default 0 not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.submission_answers enable row level security;

create policy "Users and Admins can view submission answers"
  on public.submission_answers for select
  using (
    exists (
      select 1 from public.submissions
      where submissions.id = submission_answers.submission_id
      and (submissions.user_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
    )
  );

create policy "Users can insert submission answers"
  on public.submission_answers for insert
  with check (
    exists (
      select 1 from public.submissions
      where submissions.id = submission_answers.submission_id
      and submissions.user_id = auth.uid()
    )
  );

-- 6. User Test Access Table (controls student access allocations)
create table if not exists public.user_test_access (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  test_id uuid references public.tests on delete cascade not null,
  is_active boolean default false not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  constraint uq_user_test_access unique (user_id, test_id)
);

alter table public.user_test_access enable row level security;

create policy "Users can view own test access"
  on public.user_test_access for select
  using (
    auth.uid() = user_id or 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can manage user test access"
  on public.user_test_access for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 7. RPC Function for Secure Test Grading and Marking
create or replace function public.submit_test(
  p_test_id uuid,
  p_answers jsonb, -- Map of { question_id: answer_value }
  p_time_spent_seconds integer default 0
)
returns jsonb
language plpgsql
security definer
as $$
declare
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
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  -- Determine sequential attempt number for this user and test
  select coalesce(max(attempt_number), 0) + 1
  into v_attempt_number
  from public.submissions
  where user_id = v_user_id and test_id = p_test_id;

  -- Calculate total points and score
  for v_q in 
    select id, correct_answer, points, question_type
    from public.questions
    where test_id = p_test_id
  loop
    v_total_points := v_total_points + v_q.points;
  end loop;

  -- Create submission row with attempt_number
  insert into public.submissions (test_id, user_id, score, total_points, percentage, time_spent_seconds, attempt_number)
  values (p_test_id, v_user_id, 0, v_total_points, 0, p_time_spent_seconds, v_attempt_number)
  returning id into v_submission_id;

  -- Evaluate each question
  for v_q in 
    select id, correct_answer, points, question_type
    from public.questions
    where test_id = p_test_id
  loop
    v_user_ans := p_answers->>v_q.id::text;
    v_is_correct := false;
    v_points := 0;

    if v_user_ans is not null then
      if lower(trim(v_user_ans)) = lower(trim(v_q.correct_answer)) then
        v_is_correct := true;
        v_points := v_q.points;
        v_total_score := v_total_score + v_points;
      end if;
    end if;

    insert into public.submission_answers (submission_id, question_id, user_answer, is_correct, points_awarded)
    values (v_submission_id, v_q.id, v_user_ans, v_is_correct, v_points);
  end loop;

  if v_total_points > 0 then
    v_pct := round((v_total_score / v_total_points) * 100, 2);
  else
    v_pct := 0;
  end if;

  -- Update submission with final score
  update public.submissions
  set score = v_total_score,
      percentage = v_pct
  where id = v_submission_id;

  return jsonb_build_object(
    'submission_id', v_submission_id,
    'score', v_total_score,
    'total_points', v_total_points,
    'percentage', v_pct,
    'attempt_number', v_attempt_number
  );
end;
$$;
