export interface Profile {
  id: string
  email: string
  full_name: string | null
  linkedin_url: string | null
  avatar_url: string | null
  created_at: string
}

export interface Candidate {
  id: string
  name: string
  title: string
  bio: string | null
  linkedin_url: string
  image_url: string | null
  team_id: string
  vote_count: number
  created_at: string
}

export interface Vote {
  id: string
  user_id: string
  candidate_id: string
  voted_at: string
  profiles?: Profile
}
