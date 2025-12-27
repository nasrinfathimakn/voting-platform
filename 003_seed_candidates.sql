-- Insert sample candidates for the voting platform
insert into public.candidates (name, title, bio, linkedin_url, image_url, team_id)
values
  (
    'Sarah Chen',
    'Senior Product Manager',
    'Experienced product leader with 8+ years building innovative SaaS solutions. Passionate about user-centric design and data-driven decision making.',
    'https://www.linkedin.com/in/sarahchen',
    '/placeholder.svg?height=400&width=400',
    'team-1'
  ),
  (
    'Marcus Rodriguez',
    'VP of Engineering',
    'Engineering executive with a track record of scaling teams and infrastructure. Former CTO of a successful fintech startup.',
    'https://www.linkedin.com/in/marcusrodriguez',
    '/placeholder.svg?height=400&width=400',
    'team-1'
  )
on conflict do nothing;
