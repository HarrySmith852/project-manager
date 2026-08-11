"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Eye,
  Link2,
  MoreHorizontal,
  Paperclip,
  Share2,
} from "lucide-react"

import { IssueFiltersBar } from "@/components/pm/issue-filters-bar"
import { IssueTypeIcon } from "@/components/pm/issue-type-icon"
import { PriorityIcon } from "@/components/pm/priority-icon"
import { StatusBadge } from "@/components/pm/status-badge"
import { UserAvatar } from "@/components/pm/user-avatar"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { CURRENT_USER_ID, STATUS_COLUMNS, getUser, users } from "@/lib/data"
import { useIssues } from "@/lib/issues-context"
import type { IssueStatus, Priority } from "@/lib/types"
import { cn } from "@/lib/utils"

export function IssuesBrowseView() {
  const {
    filteredIssues,
    projectKey,
    updateIssue,
    addComment,
  } = useIssues()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [comment, setComment] = useState("")

  useEffect(() => {
    if (filteredIssues.length === 0) {
      setSelectedId(null)
      return
    }
    if (!selectedId || !filteredIssues.some((i) => i.id === selectedId)) {
      setSelectedId(filteredIssues[0].id)
    }
  }, [filteredIssues, selectedId])

  const selected = useMemo(
    () => filteredIssues.find((i) => i.id === selectedId) ?? null,
    [filteredIssues, selectedId]
  )

  const reporter = getUser(selected?.reporterId)

  function submitComment() {
    if (!selected || !comment.trim()) return
    addComment(selected.id, comment.trim())
    setComment("")
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <IssueFiltersBar searchPlaceholder="Search issues" />

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(240px,340px)_minmax(0,1fr)]">
        <div className="min-h-0 overflow-y-auto border-b border-[#DFE1E6] lg:border-r lg:border-b-0">
          {filteredIssues.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No matching issues
            </p>
          )}
          {filteredIssues.map((issue) => {
            const isActive = issue.id === selectedId
            return (
              <button
                key={issue.id}
                type="button"
                onClick={() => setSelectedId(issue.id)}
                className={cn(
                  "flex w-full flex-col gap-1.5 border-b border-[#DFE1E6] px-3 py-3 text-left hover:bg-[#FAFBFC]",
                  isActive && "bg-[#E9F2FF]"
                )}
              >
                <div className="flex items-center gap-2">
                  <IssueTypeIcon type={issue.type} />
                  <span className="text-xs font-medium text-[#0052CC]">
                    {issue.key}
                  </span>
                  <PriorityIcon
                    priority={issue.priority}
                    className="ml-auto"
                  />
                </div>
                <p className="line-clamp-2 text-sm font-medium">{issue.title}</p>
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={issue.status} />
                  <UserAvatar userId={issue.assigneeId} size="sm" />
                </div>
              </button>
            )
          })}
        </div>

        <div className="hidden min-h-0 overflow-y-auto lg:block">
          {!selected ? (
            <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
              Select an issue to view details
            </div>
          ) : (
            <div className="grid min-h-full xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <IssueTypeIcon type={selected.type} />
                  <Link
                    href={`/projects/${projectKey.toLowerCase()}/issues/${selected.key}`}
                    className="font-medium text-[#0052CC] hover:underline"
                  >
                    {selected.key}
                  </Link>
                  <div className="ml-auto flex gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label="Watch">
                      <Eye />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label="Share">
                      <Share2 />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label="More">
                      <MoreHorizontal />
                    </Button>
                  </div>
                </div>

                <h1 className="mb-4 text-2xl font-semibold tracking-tight">
                  {selected.title}
                </h1>

                <div className="mb-5 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="h-8 rounded-md">
                    <Paperclip data-icon="inline-start" />
                    Attach
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 rounded-md">
                    <Link2 data-icon="inline-start" />
                    Link issue
                  </Button>
                  <Link
                    href={`/projects/${projectKey.toLowerCase()}/issues/${selected.key}`}
                    className="inline-flex h-8 items-center rounded-md border border-border px-2.5 text-sm font-medium hover:bg-muted"
                  >
                    Open full page
                  </Link>
                </div>

                <section className="mb-6">
                  <h2 className="mb-2 text-sm font-semibold">Description</h2>
                  <Textarea
                    value={selected.description}
                    onChange={(e) =>
                      updateIssue(selected.id, { description: e.target.value })
                    }
                    placeholder="Add a description..."
                    className="min-h-28"
                  />
                </section>

                <section>
                  <h2 className="mb-2 text-sm font-semibold">Comments</h2>
                  <div className="mb-3 flex gap-3">
                    <UserAvatar userId={CURRENT_USER_ID} size="sm" />
                    <div className="min-w-0 flex-1">
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="mb-2 min-h-16"
                      />
                      <Button
                        size="sm"
                        className="bg-[#0052CC] text-white hover:bg-[#0747A6]"
                        disabled={!comment.trim()}
                        onClick={submitComment}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {selected.comments.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No comments yet.
                      </p>
                    )}
                    {[...selected.comments].reverse().map((c) => {
                      const author = getUser(c.authorId)
                      return (
                        <div key={c.id} className="flex gap-3">
                          <UserAvatar userId={c.authorId} size="sm" />
                          <div>
                            <p className="text-sm font-medium">{author?.name}</p>
                            <p className="text-sm">{c.body}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              </div>

              <aside className="border-t border-[#DFE1E6] p-4 xl:border-t-0 xl:border-l">
                <FieldGroup className="gap-3">
                  <Field>
                    <FieldLabel className="text-xs text-muted-foreground">
                      Status
                    </FieldLabel>
                    <Select
                      value={selected.status}
                      onValueChange={(v) =>
                        updateIssue(selected.id, {
                          status: (v as IssueStatus) ?? selected.status,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
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
                  </Field>

                  <Separator />

                  <Field>
                    <FieldLabel className="text-xs text-muted-foreground">
                      Assignee
                    </FieldLabel>
                    <Select
                      value={selected.assigneeId ?? "unassigned"}
                      onValueChange={(v) =>
                        updateIssue(selected.id, {
                          assigneeId: !v || v === "unassigned" ? null : v,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {users.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel className="text-xs text-muted-foreground">
                      Priority
                    </FieldLabel>
                    <Select
                      value={selected.priority}
                      onValueChange={(v) =>
                        updateIssue(selected.id, {
                          priority: (v as Priority) ?? selected.priority,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="highest">Highest</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="lowest">Lowest</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel className="text-xs text-muted-foreground">
                      Reporter
                    </FieldLabel>
                    <div className="flex h-8 items-center gap-2 text-sm">
                      <UserAvatar userId={selected.reporterId} size="sm" />
                      {reporter?.name}
                    </div>
                  </Field>
                </FieldGroup>
              </aside>
            </div>
          )}
        </div>

        {/* Mobile: link to full detail when selected */}
        {selected && (
          <div className="border-t border-[#DFE1E6] p-3 lg:hidden">
            <Link
              href={`/projects/${projectKey.toLowerCase()}/issues/${selected.key}`}
              className="flex items-center justify-between rounded-md border border-[#DFE1E6] bg-[#FAFBFC] px-3 py-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#0052CC]">
                  {selected.key}
                </p>
                <p className="truncate text-sm font-medium">{selected.title}</p>
              </div>
              <StatusBadge status={selected.status} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
