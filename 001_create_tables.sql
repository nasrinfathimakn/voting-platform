-- Create profiles table to store user information
-- This references auth.users and stores additional info like LinkedIn URL
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  linkedin_url text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies: users can read all profiles but only update their own
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Create candidates table
create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  bio text,
  linkedin_url text not null,
  image_url text,
  team_id text not null default 'team-1',
  vote_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on candidates - everyone can read, only authenticated users can see
alter table public.candidates enable row level security;

create policy "candidates_select_authenticated"
  on public.candidates for select
  using (auth.uid() is not null);

-- Create votes table to track who voted for whom
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  voted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, candidate_id)
);

-- Enable RLS on votes
alter table public.votes enable row level security;

-- Votes policies: users can only insert their own vote, everyone can read all votes
create policy "votes_select_all"
  on public.votes for select
  using (auth.uid() is not null);

create policy "votes_insert_own"
  on public.votes for insert
  with check (auth.uid() = user_id);

-- Create a unique constraint to ensure one vote per user
create unique index if not exists one_vote_per_user on public.votes(user_id);

-- Create indexes for better query performance
create index if not exists votes_user_id_idx on public.votes(user_id);
create index if not exists votes_candidate_id_idx on public.votes(candidate_id);
create index if not exists candidates_team_id_idx on public.candidates(team_id);
