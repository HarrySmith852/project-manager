"use client"

import { AppShell } from "@/components/pm/app-shell"
import { AuthGuard } from "@/components/auth/auth-guard"
import { IssuesProvider } from "@/lib/issues-context"

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <IssuesProvider>
        <AppShell>{children}</AppShell>
      </IssuesProvider>
    </AuthGuard>
  )
}
