"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useAuth } from "@/lib/auth-context"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!hydrated) return
    if (!user) {
      const next = encodeURIComponent(pathname || "/projects/lp/summary")
      router.replace(`/login?next=${next}`)
    }
  }, [hydrated, user, router, pathname])

  if (!hydrated) {
    return (
      <div className="flex h-svh items-center justify-center bg-[#F4F5F7] text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-svh items-center justify-center bg-[#F4F5F7] text-sm text-muted-foreground">
        Redirecting to login…
      </div>
    )
  }

  return <>{children}</>
}
