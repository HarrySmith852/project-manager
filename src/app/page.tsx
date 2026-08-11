"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const { user, hydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!hydrated) return
    router.replace(user ? "/projects/lp/summary" : "/login")
  }, [hydrated, user, router])

  return (
    <div className="flex h-svh items-center justify-center bg-[#F4F5F7] text-sm text-muted-foreground">
      Loading…
    </div>
  )
}
