-- Update profiles table to allow updating LinkedIn URL
-- This script allows users to add their LinkedIn profile after signup

-- Add a policy for users to update their LinkedIn URL
create policy "profiles_update_linkedin"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Optional: Add an index for faster LinkedIn URL lookups
create index if not exists profiles_linkedin_url_idx on public.profiles(linkedin_url) where linkedin_url is not null;
