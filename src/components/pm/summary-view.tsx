"use client"

import Link from "next/link"
import {
  Calendar,
  CheckCircle2,
  FilePlus2,
  Pencil,
  Plus,
} from "lucide-react"

import { IssueTypeIcon } from "@/components/pm/issue-type-icon"
import { StatusBadge } from "@/components/pm/status-badge"
import { UserAvatar } from "@/components/pm/user-avatar"
import { Button } from "@/components/ui/button"
import { PRIORITY_META, STATUS_COLUMNS, getUser } from "@/lib/data"
import { useIssues } from "@/lib/issues-context"
import type { IssueStatus, Priority } from "@/lib/types"

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#DFE1E6] bg-white p-4">
      <span
        className="flex size-9 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {icon}
      </span>
      <div>
        <p className="text-lg font-semibold leading-none">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export function SummaryView() {
  const { issues, projectKey, setCreateOpen } = useIssues()

  const byStatus = STATUS_COLUMNS.map((col) => ({
    ...col,
    count: issues.filter((i) => i.status === col.id).length,
  }))
  const total = issues.length || 1
  const completed = issues.filter((i) => i.status === "launch").length
  const dueSoon = issues.filter((i) => i.dueDate).length

  const byPriority = (Object.keys(PRIORITY_META) as Priority[]).map((p) => ({
    priority: p,
    ...PRIORITY_META[p],
    count: issues.filter((i) => i.priority === p).length,
  }))

  const byType = ["task", "bug", "story"] as const
  const typeCounts = byType.map((type) => ({
    type,
    count: issues.filter((i) => i.type === type).length,
  }))
  const typeTotal = typeCounts.reduce((s, t) => s + t.count, 0) || 1

  const recent = [...issues]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 6)

  return (
    <div className="space-y-4 p-3 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">Last 7 days</p>
        <Button
          size="sm"
          className="h-8 bg-[#0052CC] text-white hover:bg-[#0747A6]"
          onClick={() => setCreateOpen(true)}
        >
          <Plus data-icon="inline-start" />
          Create
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="completed"
          value={completed}
          color="#36B37E"
          icon={<CheckCircle2 className="size-4" />}
        />
        <StatCard
          label="updated"
          value={issues.length}
          color="#0052CC"
          icon={<Pencil className="size-4" />}
        />
        <StatCard
          label="created"
          value={issues.length}
          color="#6554C0"
          icon={<FilePlus2 className="size-4" />}
        />
        <StatCard
          label="due soon"
          value={dueSoon}
          color="#FF8B00"
          icon={<Calendar className="size-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-[#DFE1E6] bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">Status overview</h2>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div
              className="relative size-36 shrink-0 rounded-full"
              style={{
                background: `conic-gradient(${byStatus
                  .filter((s) => s.count > 0)
                  .reduce<{ css: string; start: number }>(
                    (acc, s) => {
                      const pct = (s.count / total) * 100
                      const end = acc.start + pct
                      acc.css += `${s.accent} ${acc.start}% ${end}%, `
                      acc.start = end
                      return acc
                    },
                    { css: "", start: 0 }
                  )
                  .css.slice(0, -2) || "#EBECF0 0 100%"})`,
              }}
            >
              <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-white text-center">
                <span className="text-xl font-semibold">{issues.length}</span>
                <span className="text-[10px] text-muted-foreground">
                  Total work items
                </span>
              </div>
            </div>
            <ul className="flex w-full flex-col gap-2">
              {byStatus.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: s.accent }}
                    />
                    {s.label}
                  </span>
                  <span className="font-medium">{s.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-lg border border-[#DFE1E6] bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">Recent activity</h2>
          <ul className="flex flex-col gap-3">
            {recent.map((issue) => {
              const user = getUser(issue.reporterId)
              return (
                <li key={issue.id} className="flex items-start gap-2.5">
                  <UserAvatar userId={issue.reporterId} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{user?.name}</span>{" "}
                      <span className="text-muted-foreground">updated</span>{" "}
                      <Link
                        href={`/projects/${projectKey.toLowerCase()}/issues/${issue.key}`}
                        className="font-medium text-[#0052CC] hover:underline"
                      >
                        {issue.key}
                      </Link>
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="truncate text-xs text-muted-foreground">
                        {issue.title}
                      </span>
                      <StatusBadge status={issue.status as IssueStatus} />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="rounded-lg border border-[#DFE1E6] bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">Priority breakdown</h2>
          <div className="flex h-40 items-end gap-3">
            {byPriority.map((p) => {
              const max = Math.max(...byPriority.map((x) => x.count), 1)
              const h = Math.max(8, (p.count / max) * 100)
              return (
                <div
                  key={p.priority}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs font-medium">{p.count}</span>
                  <div
                    className="w-full max-w-10 rounded-t-md"
                    style={{ height: `${h}%`, backgroundColor: p.color }}
                  />
                  <span className="truncate text-[10px] text-muted-foreground capitalize">
                    {p.label}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-lg border border-[#DFE1E6] bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">Types of work</h2>
          <ul className="flex flex-col gap-3">
            {typeCounts.map((t) => {
              const pct = Math.round((t.count / typeTotal) * 100)
              return (
                <li key={t.type} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 capitalize">
                      <IssueTypeIcon type={t.type} />
                      {t.type}
                    </span>
                    <span className="text-muted-foreground">
                      {pct}% · {t.count}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#EBECF0]">
                    <div
                      className="h-full rounded-full bg-[#0052CC]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </div>
  )
}
