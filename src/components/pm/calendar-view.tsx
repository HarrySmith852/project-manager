"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { IssueFiltersBar } from "@/components/pm/issue-filters-bar"
import { IssueTypeIcon } from "@/components/pm/issue-type-icon"
import { StatusBadge } from "@/components/pm/status-badge"
import { UserAvatar } from "@/components/pm/user-avatar"
import { Button } from "@/components/ui/button"
import { STATUS_COLUMNS } from "@/lib/data"
import { useIssues } from "@/lib/issues-context"
import type { Issue } from "@/lib/types"
import { cn } from "@/lib/utils"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

function mondayIndex(date: Date) {
  const day = date.getDay()
  return day === 0 ? 6 : day - 1
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function parseDue(issue: Issue) {
  if (!issue.dueDate) return null
  return new Date(`${issue.dueDate}T12:00:00`)
}

export function CalendarView() {
  const { filteredIssues, projectKey } = useIssues()
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()))
  const today = useMemo(() => new Date(), [])

  const cells = useMemo(() => {
    const first = startOfMonth(cursor)
    const offset = mondayIndex(first)
    const total = daysInMonth(cursor)
    const result: (Date | null)[] = []
    for (let i = 0; i < offset; i++) result.push(null)
    for (let d = 1; d <= total; d++) {
      result.push(new Date(cursor.getFullYear(), cursor.getMonth(), d))
    }
    while (result.length % 7 !== 0) result.push(null)
    return result
  }, [cursor])

  const scheduled = filteredIssues.filter((i) => i.dueDate)
  const unscheduled = filteredIssues.filter((i) => !i.dueDate)

  const monthLabel = cursor.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <IssueFiltersBar searchPlaceholder="Search calendar" />

        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#DFE1E6] bg-white px-3 py-2 sm:px-6">
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-md"
              onClick={() => setCursor(startOfMonth(new Date()))}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
                )
              }
              aria-label="Previous month"
            >
              <ChevronLeft />
            </Button>
            <span className="min-w-24 text-center text-sm font-medium">
              {monthLabel}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
                )
              }
              aria-label="Next month"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-white p-2 sm:p-4">
          <div className="grid grid-cols-7 border border-[#DFE1E6]">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="border-b border-[#DFE1E6] bg-[#FAFBFC] px-2 py-2 text-center text-[11px] font-semibold text-muted-foreground"
              >
                {d}
              </div>
            ))}
            {cells.map((date, idx) => {
              const dayIssues = date
                ? scheduled.filter((issue) => {
                    const due = parseDue(issue)
                    return due && sameDay(due, date)
                  })
                : []
              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-20 border-r border-b border-[#DFE1E6] p-1.5 sm:min-h-28",
                    !date && "bg-[#FAFBFC]",
                    date && sameDay(date, today) && "bg-[#E9F2FF]/50"
                  )}
                >
                  {date && (
                    <>
                      <div
                        className={cn(
                          "mb-1 text-xs",
                          sameDay(date, today)
                            ? "font-bold text-[#0052CC]"
                            : "text-muted-foreground"
                        )}
                      >
                        {date.getDate()}
                      </div>
                      <div className="flex flex-col gap-1">
                        {dayIssues.slice(0, 3).map((issue) => {
                          const accent =
                            STATUS_COLUMNS.find((c) => c.id === issue.status)
                              ?.accent ?? "#4C9AFF"
                          return (
                            <Link
                              key={issue.id}
                              href={`/projects/${projectKey.toLowerCase()}/issues/${issue.key}`}
                              className="truncate rounded px-1.5 py-0.5 text-[10px] font-medium text-[#172B4D] sm:text-xs"
                              style={{ backgroundColor: `${accent}33` }}
                              title={issue.title}
                            >
                              <span className="hidden sm:inline">
                                {issue.key}{" "}
                              </span>
                              {issue.title}
                            </Link>
                          )
                        })}
                        {dayIssues.length > 3 && (
                          <span className="px-1 text-[10px] text-muted-foreground">
                            +{dayIssues.length - 3} more
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col border-t border-[#DFE1E6] bg-white lg:w-72 lg:border-t-0 lg:border-l">
        <div className="border-b border-[#DFE1E6] px-4 py-3">
          <h2 className="text-sm font-semibold">Unscheduled work</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Work items without a due date.
          </p>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-3">
          {unscheduled.length === 0 && (
            <p className="text-sm text-muted-foreground">All work is scheduled.</p>
          )}
          {unscheduled.map((issue) => (
            <Link
              key={issue.id}
              href={`/projects/${projectKey.toLowerCase()}/issues/${issue.key}`}
              className="rounded-md border border-[#DFE1E6] p-2.5 hover:bg-[#FAFBFC]"
            >
              <p className="mb-2 line-clamp-2 text-sm">{issue.title}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <IssueTypeIcon type={issue.type} />
                  {issue.key}
                </span>
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={issue.status} />
                  <UserAvatar userId={issue.assigneeId} size="sm" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  )
}
