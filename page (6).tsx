"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { VoterCard } from "@/components/voter-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, VoteIcon, Trophy, UsersIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/actions/auth"
import type { Candidate, Vote, Profile } from "@/lib/types"

interface VoteWithProfile extends Vote {
  profiles: Profile
}

export default function ResultsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [votes, setVotes] = useState<VoteWithProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadResults() {
      try {
        // Get current user
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()
        if (!currentUser) {
          router.push("/auth/login")
          return
        }
        setUser(currentUser)

        // Check if user has voted
        const { data: userVote } = await supabase.from("votes").select("id").eq("user_id", currentUser.id).single()

        if (!userVote) {
          // User hasn't voted yet, redirect to voting page
          router.push("/vote")
          return
        }
        setHasVoted(true)

        // Fetch candidates with vote counts
        const { data: candidatesData, error: candidatesError } = await supabase
          .from("candidates")
          .select("*")
          .eq("team_id", "team-1")
          .order("name")

        if (candidatesError) throw candidatesError

        const { data: votesData, error: votesError } = await supabase
          .from("votes")
          .select("*")
          .order("voted_at", { ascending: false })

        if (votesError) throw votesError

        // Fetch all profiles for voters
        const userIds = votesData?.map((vote) => vote.user_id) || []
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", userIds)

        if (profilesError) throw profilesError

        // Create a map of user_id to profile for quick lookup
        const profilesMap = new Map<string, Profile>()
        profilesData?.forEach((profile) => {
          profilesMap.set(profile.id, profile)
        })

        // Join votes with profiles manually
        const votesWithProfiles: VoteWithProfile[] =
          votesData?.map((vote) => ({
            ...vote,
            profiles: profilesMap.get(vote.user_id) || {
              id: vote.user_id,
              email: "Unknown",
              full_name: "Anonymous",
              linkedin_url: null,
              avatar_url: null,
              created_at: new Date().toISOString(),
            },
          })) || []

        // Calculate vote counts from actual votes
        const voteCounts = new Map<string, number>()
        votesWithProfiles.forEach((vote) => {
          const count = voteCounts.get(vote.candidate_id) || 0
          voteCounts.set(vote.candidate_id, count + 1)
        })

        // Update candidates with actual vote counts
        const candidatesWithCounts =
          candidatesData?.map((candidate) => ({
            ...candidate,
            vote_count: voteCounts.get(candidate.id) || 0,
          })) || []

        setCandidates(candidatesWithCounts)
        setVotes(votesWithProfiles)
      } catch (err) {
        console.error("Error loading results:", err)
        setError(err instanceof Error ? err.message : "Failed to load voting results")
      } finally {
        setIsLoading(false)
      }
    }

    loadResults()
  }, [supabase, router])

  const totalVotes = votes.length
  const getVotesForCandidate = (candidateId: string) => votes.filter((v) => v.candidate_id === candidateId)
  const winningCandidate =
    candidates.length > 0 ? candidates.reduce((a, b) => (a.vote_count > b.vote_count ? a : b)) : null

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!hasVoted) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VoteIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Voting Results</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push("/vote")} variant="ghost" size="sm">
              Back to Voting
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Stats */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 text-balance">Election Results</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalVotes}</p>
                    <p className="text-sm text-muted-foreground">Total Votes Cast</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {winningCandidate && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{winningCandidate.name}</p>
                      <p className="text-sm text-muted-foreground">Currently Leading</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Candidates Results */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Candidate Breakdown</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {candidates.map((candidate) => {
              const candidateVotes = getVotesForCandidate(candidate.id)
              const percentage = totalVotes > 0 ? Math.round((candidateVotes.length / totalVotes) * 100) : 0

              return (
                <Card key={candidate.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{candidate.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{candidate.title}</p>
                      </div>
                      {candidate.vote_count === winningCandidate?.vote_count && totalVotes > 0 && (
                        <Badge variant="default" className="gap-1">
                          <Trophy className="h-3 w-3" />
                          Leading
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Vote Share</span>
                        <span className="text-2xl font-bold text-primary">{percentage}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {candidateVotes.length} {candidateVotes.length === 1 ? "vote" : "votes"}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-semibold mb-3">Voters ({candidateVotes.length})</h4>
                      {candidateVotes.length > 0 ? (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {candidateVotes.map((vote) => (
                            <VoterCard key={vote.id} voter={vote.profiles} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No votes yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* All Voters List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              All Voters ({totalVotes})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {votes.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {votes.map((vote) => (
                  <VoterCard key={vote.id} voter={vote.profiles} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No votes have been cast yet</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
