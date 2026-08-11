"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Gantt, ViewMode, type Task } from "gantt-task-react"
import "gantt-task-react/dist/index.css"
import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { STATUS_COLUMNS } from "@/lib/data"
import { useIssues } from "@/lib/issues-context"
import type { Issue } from "@/lib/types"
import { cn } from "@/lib/utils"

type Scale = "day" | "week" | "month"

const SCALE_TO_VIEW: Record<Scale, ViewMode> = {
  day: ViewMode.Day,
  week: ViewMode.Week,
  month: ViewMode.Month,
}

function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function progressForStatus(status: Issue["status"]) {
  const order = STATUS_COLUMNS.findIndex((c) => c.id === status)
  if (order < 0) return 0
  return Math.round((order / (STATUS_COLUMNS.length - 1)) * 100)
}

function issueToTask(issue: Issue, index: number): Task {
  const accent =
    STATUS_COLUMNS.find((c) => c.id === issue.status)?.accent ?? "#6554C0"

  let start: Date
  let end: Date

  if (issue.dueDate) {
    end = new Date(`${issue.dueDate}T17:00:00`)
    start = addDays(end, -Math.max(3, 4 + (index % 5)))
  } else {
    const base = new Date()
    base.setHours(9, 0, 0, 0)
    start = addDays(base, index * 2 - 4)
    end = addDays(start, 4 + (index % 6))
  }

  if (end.getTime() <= start.getTime()) {
    end = addDays(start, 1)
  }

  return {
    id: issue.id,
    name: `${issue.key} ${issue.title}`,
    type: "task",
    start,
    end,
    progress: progressForStatus(issue.status),
    isDisabled: false,
    styles: {
      backgroundColor: accent,
      backgroundSelectedColor: accent,
      progressColor: "#172B4D",
      progressSelectedColor: "#172B4D",
    },
  }
}

export function TimelineView() {
  const router = useRouter()
  const { issues, projectKey, setCreateOpen, updateIssue, filteredIssues } =
    useIssues()
  const [scale, setScale] = useState<Scale>("week")
  const [query, setQuery] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])

  const sourceTasks = useMemo(() => {
    const base = query.trim()
      ? filteredIssues.filter((issue) => {
          const q = query.toLowerCase()
          return (
            issue.title.toLowerCase().includes(q) ||
            issue.key.toLowerCase().includes(q)
          )
        })
      : filteredIssues
    return base.map((issue, index) => issueToTask(issue, index))
  }, [filteredIssues, query])

  useEffect(() => {
    setTasks(sourceTasks)
  }, [sourceTasks])

  function handleDateChange(task: Task) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
    const due = task.end.toISOString().slice(0, 10)
    updateIssue(task.id, { dueDate: due })
    return true
  }

  function handleProgressChange(task: Task) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
    return true
  }

  function handleClick(task: Task) {
    const issue = issues.find((i) => i.id === task.id)
    if (!issue) return
    router.push(`/projects/${projectKey.toLowerCase()}/issues/${issue.key}`)
  }

  const columnWidth = scale === "day" ? 60 : scale === "week" ? 180 : 260

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#DFE1E6] px-3 py-2.5 sm:px-6">
        <div className="relative min-w-0 flex-1 sm:max-w-52">
          <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search timeline"
            className="h-8 rounded-md border-[#DFE1E6] pl-7 text-sm"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-md"
          onClick={() => setCreateOpen(true)}
        >
          <Plus data-icon="inline-start" />
          Create
        </Button>
        <div className="ml-auto flex items-center gap-1 rounded-md border border-[#DFE1E6] p-0.5">
          {(["day", "week", "month"] as Scale[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScale(s)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium capitalize",
                scale === s
                  ? "bg-[#E9F2FF] text-[#0052CC]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s === "day" ? "Days" : s === "week" ? "Weeks" : "Months"}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-2 sm:p-3">
        {tasks.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <p>No work items to show on the timeline.</p>
            <Button
              size="sm"
              className="bg-[#0052CC] text-white hover:bg-[#0747A6]"
              onClick={() => setCreateOpen(true)}
            >
              <Plus data-icon="inline-start" />
              Create
            </Button>
          </div>
        ) : (
          <div className="min-h-[420px] w-full overflow-x-auto rounded-lg border border-[#DFE1E6]">
            <Gantt
              tasks={tasks}
              viewMode={SCALE_TO_VIEW[scale]}
              onDateChange={handleDateChange}
              onProgressChange={handleProgressChange}
              onClick={handleClick}
              onDoubleClick={handleClick}
              listCellWidth="220px"
              columnWidth={columnWidth}
              rowHeight={44}
              barCornerRadius={4}
              barFill={70}
              fontSize="12"
              fontFamily="inherit"
              todayColor="rgba(0, 82, 204, 0.12)"
              projectBackgroundColor="#6554C0"
              arrowColor="#A5ADBA"
            />
          </div>
        )}
      </div>
    </div>
  )
}
