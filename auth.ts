"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function signInWithGoogle() {
  const supabase = await createClient()
  const requestHeaders = await headers()
  const origin = requestHeaders.get("origin")

  if (!origin) {
    console.error("Missing origin header")
    return redirect("/auth/login?error=OriginMissing")
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  })

  if (error) {
    console.error("Error signing in with Google:", error)
    return redirect(`/auth/login?error=OAuthFailed`)
  }

  if (data.url) {
    return redirect(data.url)
  }

  return redirect("/auth/login?error=NoURL")
}

export async function signInWithLinkedIn() {
  const supabase = await createClient()
  const requestHeaders = await headers()
  const origin = requestHeaders.get("origin")

  if (!origin) {
    console.error("Missing origin header")
    return redirect("/auth/login?error=OriginMissing")
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "linkedin_oidc",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error("Error signing in with LinkedIn:", error)
    return redirect(`/auth/login?error=OAuthFailed`)
  }

  if (data.url) {
    return redirect(data.url)
  }

  return redirect("/auth/login?error=NoURL")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
