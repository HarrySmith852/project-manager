"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { SignupForm } from "@/components/auth/signup-form"
import { useAuth } from "@/lib/auth-context"

export default function SignupPage() {
  const { user, hydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (hydrated && user) {
      router.replace("/projects/lp/summary")
    }
  }, [hydrated, user, router])

  if (!hydrated || user) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

  return <SignupForm />
}
