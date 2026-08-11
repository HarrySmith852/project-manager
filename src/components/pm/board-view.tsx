"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Calendar, GripVertical, Plus } from "lucide-react"

import { IssueFiltersBar } from "@/components/pm/issue-filters-bar"
import { IssueTypeIcon } from "@/components/pm/issue-type-icon"
import { PriorityIcon } from "@/components/pm/priority-icon"
import { UserAvatar } from "@/components/pm/user-avatar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUS_COLUMNS } from "@/lib/data"
import { useIssues } from "@/lib/issues-context"
import type { Issue, IssueStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

function formatDue(dueDate: string | null) {
  if (!dueDate) return null
  return new Date(dueDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  })
}

function IssueCardContent({
  issue,
  projectKey,
  dragHandleProps,
  isDragging,
}: {
  issue: Issue
  projectKey: string
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
  isDragging?: boolean
}) {
  const due = formatDue(issue.dueDate)
  const { moveIssue } = useIssues()

  return (
    <div
      className={cn(
        "rounded-md border border-[#DFE1E6] bg-white p-3 shadow-sm",
        isDragging && "opacity-40 shadow-md ring-2 ring-[#0052CC]/30"
      )}
    >
      <div className="mb-2 flex items-start gap-1">
        <button
          type="button"
          className="mt-0.5 touch-none rounded p-1 text-muted-foreground hover:bg-[#F4F5F7] hover:text-foreground active:bg-[#EBECF0]"
          aria-label="Drag issue"
          {...dragHandleProps}
        >
          <GripVertical className="size-4" />
        </button>
        <Link
          href={`/projects/${projectKey.toLowerCase()}/issues/${issue.key}`}
          className="min-w-0 flex-1"
        >
          <p className="line-clamp-2 text-sm leading-5 text-foreground hover:underline">
            {issue.title}
          </p>
        </Link>
      </div>

      {due && (
        <div className="mb-2 ml-7 flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="size-3" />
          {due}
        </div>
      )}

      <div className="ml-7 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <IssueTypeIcon type={issue.type} />
          <span className="text-xs text-muted-foreground">{issue.key}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <PriorityIcon priority={issue.priority} />
          <UserAvatar userId={issue.assigneeId} size="sm" />
        </div>
      </div>

      {/* Mobile fallback: change status without dragging */}
      <div className="mt-2 ml-7 sm:hidden">
        <Select
          value={issue.status}
          onValueChange={(v) => {
            if (v) moveIssue(issue.id, v as IssueStatus)
          }}
        >
          <SelectTrigger className="h-7 w-full rounded-md text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {STATUS_COLUMNS.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function DraggableIssueCard({
  issue,
  projectKey,
}: {
  issue: Issue
  projectKey: string
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: issue.id,
      data: { type: "issue", status: issue.status, issue },
    })

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop-${issue.id}`,
    data: { type: "issue-drop", status: issue.status, issueId: issue.id },
  })

  function setRefs(node: HTMLElement | null) {
    setNodeRef(node)
    setDropRef(node)
  }

  const style: React.CSSProperties | undefined = isDragging
    ? { opacity: 0.35 }
    : transform
      ? { transform: CSS.Translate.toString(transform) }
      : undefined

  return (
    <div
      ref={setRefs}
      style={style}
      className={cn(isOver && !isDragging && "rounded-md ring-2 ring-[#0052CC]/40")}
    >
      <IssueCardContent
        issue={issue}
        projectKey={projectKey}
        isDragging={isDragging}
        dragHandleProps={{ ...listeners, ...attributes }}
      />
    </div>
  )
}

function BoardColumn({
  status,
  label,
  accent,
  issues,
  projectKey,
  onCreate,
}: {
  status: IssueStatus
  label: string
  accent: string
  issues: Issue[]
  projectKey: string
  onCreate: () => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status },
  })

  return (
    <section
      className={cn(
        "flex w-[min(85vw,280px)] shrink-0 snap-start flex-col rounded-md bg-[#EBECF0]/60 sm:w-[260px]",
        isOver && "bg-[#DEEBFF] ring-2 ring-[#0052CC]/40"
      )}
    >
      <header className="flex items-center gap-2 px-3 py-2.5">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <h2 className="text-xs font-bold tracking-wide text-[#5E6C84] uppercase">
          {label}
        </h2>
        <span className="text-xs text-muted-foreground">{issues.length}</span>
      </header>

      <div
        ref={setNodeRef}
        className="flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2"
      >
        {issues.map((issue) => (
          <DraggableIssueCard
            key={issue.id}
            issue={issue}
            projectKey={projectKey}
          />
        ))}
        {issues.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            Drop here
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 justify-start rounded-md text-muted-foreground"
          onClick={onCreate}
        >
          <Plus data-icon="inline-start" />
          Create
        </Button>
      </div>
    </section>
  )
}

export function BoardView() {
  const { filteredIssues, projectKey, setCreateOpen, moveIssue } = useIssues()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    })
  )

  const activeIssue = useMemo(
    () => filteredIssues.find((i) => i.id === activeId) ?? null,
    [filteredIssues, activeId]
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const issueId = String(active.id)
    const overData = over.data.current as
      | { type?: string; status?: IssueStatus }
      | undefined

    if (overData?.status) {
      moveIssue(issueId, overData.status)
      return
    }

    const overId = String(over.id)
    const column = STATUS_COLUMNS.find((c) => c.id === overId)
    if (column) {
      moveIssue(issueId, column.id)
      return
    }

    const overIssueId = overId.startsWith("drop-")
      ? overId.replace("drop-", "")
      : overId
    const overIssue = filteredIssues.find((i) => i.id === overIssueId)
    if (overIssue) {
      moveIssue(issueId, overIssue.status)
    }
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <IssueFiltersBar searchPlaceholder="Search board" />
      <p className="border-b border-[#DFE1E6] bg-white px-3 py-1.5 text-xs text-muted-foreground sm:px-6 sm:hidden">
        Tip: long-press the ⋮⋮ handle to drag, or use the status menu on each
        card.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex min-h-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain p-3 sm:p-4">
          {STATUS_COLUMNS.map((column) => {
            const columnIssues = filteredIssues.filter(
              (i) => i.status === column.id
            )
            return (
              <BoardColumn
                key={column.id}
                status={column.id}
                label={column.label}
                accent={column.accent}
                issues={columnIssues}
                projectKey={projectKey}
                onCreate={() => setCreateOpen(true)}
              />
            )
          })}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeIssue ? (
            <div className="w-[min(85vw,260px)] rotate-2 scale-105 cursor-grabbing shadow-lg">
              <IssueCardContent
                issue={activeIssue}
                projectKey={projectKey}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
