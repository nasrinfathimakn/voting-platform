"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { CandidateCard } from "@/components/candidate-card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, VoteIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/actions/auth"
import type { Candidate } from "@/lib/types"

export default function VotePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [currentVote, setCurrentVote] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
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

        // Fetch candidates
        const { data: candidatesData, error: candidatesError } = await supabase
          .from("candidates")
          .select("*")
          .eq("team_id", "team-1")
          .order("name")

        if (candidatesError) throw candidatesError
        setCandidates(candidatesData || [])

        // Check if user has already voted
        const { data: voteData, error: voteError } = await supabase
          .from("votes")
          .select("candidate_id")
          .eq("user_id", currentUser.id)
          .single()

        if (voteData) {
          setHasVoted(true)
          setCurrentVote(voteData.candidate_id)
        }
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load voting data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [supabase, router])

  const handleVote = async (candidateId: string) => {
    if (!user || hasVoted) return

    setIsVoting(true)
    setError(null)

    try {
      // Insert vote
      const { error: voteError } = await supabase.from("votes").insert({
        user_id: user.id,
        candidate_id: candidateId,
      })

      if (voteError) throw voteError

      // Update candidate vote count
      const { error: updateError } = await supabase.rpc("increment", {
        row_id: candidateId,
      })

      if (updateError) {
        console.error("Error updating vote count:", updateError)
        // Non-fatal error - the vote was recorded
      }

      setHasVoted(true)
      setCurrentVote(candidateId)

      // Navigate to results after a brief delay
      setTimeout(() => {
        router.push("/results")
      }, 1500)
    } catch (err: unknown) {
      console.error("Error voting:", err)
      if (err instanceof Error && err.message.includes("duplicate")) {
        setError("You have already voted")
        setHasVoted(true)
      } else {
        setError("Failed to submit vote. Please try again.")
      }
    } finally {
      setIsVoting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading candidates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VoteIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Team Voting Platform</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
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
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2 text-balance">Vote for Your Preferred Candidate</h2>
          <p className="text-muted-foreground text-lg">
            Review both candidates and cast your vote. You can only vote once.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {hasVoted && !error && (
          <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <AlertDescription className="text-green-800 dark:text-green-200">
              Your vote has been recorded successfully! You can view the results below.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onVote={handleVote}
              isVoting={isVoting}
              hasVoted={hasVoted}
              votedFor={currentVote || undefined}
            />
          ))}
        </div>

        {hasVoted && (
          <div className="mt-8 text-center">
            <Button onClick={() => router.push("/results")} size="lg">
              View Voting Results
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
