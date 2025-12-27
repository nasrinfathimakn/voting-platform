"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink } from "lucide-react"
import type { Profile } from "@/lib/types"

interface VoterCardProps {
  voter: Profile
}

export function VoterCard({ voter }: VoterCardProps) {
  const initials = voter.full_name
    ? voter.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : voter.email.slice(0, 2).toUpperCase()

  const handleClick = () => {
    if (voter.linkedin_url) {
      window.open(voter.linkedin_url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Card
      className={`transition-all ${voter.linkedin_url ? "cursor-pointer hover:shadow-md hover:border-primary/50" : ""}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={voter.avatar_url || undefined} alt={voter.full_name || voter.email} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{voter.full_name || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground truncate">{voter.email}</p>
          </div>
          {voter.linkedin_url && <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
        </div>
      </CardContent>
    </Card>
  )
}
