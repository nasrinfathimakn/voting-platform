import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Vote, Shield, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Vote className="h-4 w-4" />
          Secure Team Voting
        </div>
        <h1 className="text-5xl font-bold mb-6 text-balance max-w-3xl mx-auto leading-tight">
          Make Your Voice Heard in Team Decisions
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
          A transparent and secure voting platform that lets you choose the best candidate for your team. Sign in with
          Google or LinkedIn to participate.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="font-semibold">
            <Link href="/auth/login">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signup">Create Account</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Authentication</h3>
            <p className="text-muted-foreground leading-relaxed">
              Sign in securely with Google or LinkedIn OAuth. Your data is protected with industry-standard encryption.
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Vote className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">One Vote Per User</h3>
            <p className="text-muted-foreground leading-relaxed">
              Each authenticated user can cast exactly one vote, ensuring fair and transparent elections.
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Transparent Results</h3>
            <p className="text-muted-foreground leading-relaxed">
              View all voters and their LinkedIn profiles after casting your vote. Complete transparency in the voting
              process.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-16 text-center">
        <Card className="p-12 bg-primary/5">
          <h2 className="text-3xl font-bold mb-4 text-balance">Ready to Cast Your Vote?</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Join your team in making important decisions. Sign in now to view candidates and vote.
          </p>
          <Button asChild size="lg" className="font-semibold">
            <Link href="/auth/login">Sign In to Vote</Link>
          </Button>
        </Card>
      </section>
    </div>
  )
}
