"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"

import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
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

  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
