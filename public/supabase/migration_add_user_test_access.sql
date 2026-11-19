-- ==============================================================================
-- MUSKAAN MIGRATION: ADD USER TEST ACCESS AND ATTEMPT NUMBER
-- ==============================================================================

-- 1. Create user_test_access table if it doesn't exist
create table if not exists public.user_test_access (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  test_id uuid references public.tests on delete cascade not null,
  is_active boolean default false not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  constraint uq_user_test_access unique (user_id, test_id)
);

alter table public.user_test_access enable row level security;

drop policy if exists "Users can view own test access" on public.user_test_access;
create policy "Users can view own test access"
  on public.user_test_access for select
  using (
    auth.uid() = user_id or 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admins can manage user test access" on public.user_test_access;
create policy "Admins can manage user test access"
  on public.user_test_access for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 2. Add attempt_number to submissions if missing
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

create index if not exists idx_submissions_user_test_attempt 
  on public.submissions(user_id, test_id, attempt_number desc);

-- 3. Add admin manage policy for profiles
drop policy if exists "Admins can manage all profiles" on public.profiles;
create policy "Admins can manage all profiles"
  on public.profiles for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
