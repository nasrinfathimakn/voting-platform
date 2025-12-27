"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import type { Candidate } from "@/lib/types"

interface CandidateCardProps {
  candidate: Candidate
  onVote: (candidateId: string) => void
  isVoting: boolean
  hasVoted: boolean
  votedFor?: string
}

export function CandidateCard({ candidate, onVote, isVoting, hasVoted, votedFor }: CandidateCardProps) {
  const isVotedFor = votedFor === candidate.id

  return (
    <Card className={`overflow-hidden transition-all ${isVotedFor ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={candidate.image_url || "/placeholder.svg?height=400&width=400"}
            alt={candidate.name}
            fill
            className="object-cover"
          />
          {isVotedFor && (
            <div className="absolute right-4 top-4">
              <Badge className="bg-primary text-primary-foreground gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Your Vote
              </Badge>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-balance">{candidate.name}</h3>
            <p className="text-muted-foreground mt-1">{candidate.title}</p>
          </div>

          {candidate.bio && <p className="text-sm leading-relaxed text-pretty">{candidate.bio}</p>}

          <div className="flex items-center gap-2">
            <a
              href={candidate.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View LinkedIn Profile
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <Button
            onClick={() => onVote(candidate.id)}
            disabled={isVoting || hasVoted}
            className="w-full"
            size="lg"
            variant={isVotedFor ? "default" : "outline"}
          >
            {hasVoted
              ? isVotedFor
                ? "Voted"
                : "Already Voted"
              : isVoting
                ? "Submitting..."
                : "Vote for this candidate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
