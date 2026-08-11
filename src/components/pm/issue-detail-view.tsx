"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Eye,
  Link2,
  MoreHorizontal,
  Paperclip,
  Share2,
} from "lucide-react"

import { IssueTypeIcon } from "@/components/pm/issue-type-icon"
import { UserAvatar } from "@/components/pm/user-avatar"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { CURRENT_USER_ID, STATUS_COLUMNS, getUser, users } from "@/lib/data"
import { useIssues } from "@/lib/issues-context"
import type { IssueStatus, Priority } from "@/lib/types"

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return "just now"
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

export function IssueDetailView({ issueKey }: { issueKey: string }) {
  const router = useRouter()
  const { getIssueByKey, updateIssue, addComment, projectKey, projectName } =
    useIssues()
  const issue = getIssueByKey(issueKey)
  const [comment, setComment] = useState("")

  const reporter = useMemo(
    () => getUser(issue?.reporterId),
    [issue?.reporterId]
  )

  if (!issue) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-white p-8">
        <p className="text-lg font-medium">Issue not found</p>
        <Button
          variant="outline"
          onClick={() =>
            router.push(`/projects/${projectKey.toLowerCase()}/board`)
          }
        >
          Back to board
        </Button>
      </div>
    )
  }

  function submitComment() {
    if (!comment.trim()) return
    addComment(issue!.id, comment.trim())
    setComment("")
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#DFE1E6] px-3 py-2 text-sm text-muted-foreground sm:gap-2 sm:px-6">
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          onClick={() => router.back()}
          aria-label="Back"
        >
          <ArrowLeft />
        </Button>
        <Link
          href={`/projects/${projectKey.toLowerCase()}/board`}
          className="hidden shrink-0 hover:underline sm:inline"
        >
          Spaces
        </Link>
        <span className="hidden sm:inline">/</span>
        <Link
          href={`/projects/${projectKey.toLowerCase()}/board`}
          className="hidden max-w-[8rem] truncate hover:underline sm:inline md:max-w-none"
        >
          {projectName}
        </Link>
        <span className="hidden sm:inline">/</span>
        <span className="inline-flex shrink-0 items-center gap-1 font-medium text-foreground">
          <IssueTypeIcon type={issue.type} />
          {issue.key}
        </span>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-h-0 overflow-y-auto px-3 py-4 sm:px-6 sm:py-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {issue.title}
            </h1>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                className="hidden sm:inline-flex"
                aria-label="Watch"
              >
                <Eye />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="hidden sm:inline-flex"
                aria-label="Share"
              >
                <Share2 />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="More">
                <MoreHorizontal />
              </Button>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-8 rounded-md">
              <Paperclip data-icon="inline-start" />
              Attach
            </Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md">
              <Link2 data-icon="inline-start" />
              Link issue
            </Button>
          </div>

          {/* Mobile metadata */}
          <section className="mb-6 rounded-lg border border-[#DFE1E6] p-3 lg:hidden">
            <FieldGroup className="gap-3">
              <Field>
                <FieldLabel className="text-xs text-muted-foreground">
                  Status
                </FieldLabel>
                <Select
                  value={issue.status}
                  onValueChange={(v) =>
                    updateIssue(issue.id, {
                      status: (v as IssueStatus) ?? issue.status,
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
              <Field>
                <FieldLabel className="text-xs text-muted-foreground">
                  Assignee
                </FieldLabel>
                <Select
                  value={issue.assigneeId ?? "unassigned"}
                  onValueChange={(v) =>
                    updateIssue(issue.id, {
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
                  value={issue.priority}
                  onValueChange={(v) =>
                    updateIssue(issue.id, {
                      priority: (v as Priority) ?? issue.priority,
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
            </FieldGroup>
          </section>

          <section className="mb-8">
            <h2 className="mb-2 text-sm font-semibold">Description</h2>
            <Textarea
              value={issue.description}
              onChange={(e) =>
                updateIssue(issue.id, { description: e.target.value })
              }
              placeholder="Add a description..."
              className="min-h-28 rounded-md border-[#DFE1E6]"
            />
          </section>

          <section>
            <Tabs defaultValue="comments">
              <TabsList variant="line" className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Activity across comments and history appears here.
                </p>
              </TabsContent>
              <TabsContent value="comments" className="pt-4">
                <div className="mb-4 flex gap-3">
                  <UserAvatar userId={CURRENT_USER_ID} size="sm" />
                  <div className="min-w-0 flex-1">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="mb-2 min-h-20"
                    />
                    <Button
                      size="sm"
                      className="bg-[#0052CC] text-white hover:bg-[#0747A6]"
                      onClick={submitComment}
                      disabled={!comment.trim()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {issue.comments.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No comments yet. Pro tip: press M to comment.
                    </p>
                  )}
                  {[...issue.comments].reverse().map((c) => {
                    const author = getUser(c.authorId)
                    return (
                      <div key={c.id} className="flex gap-3">
                        <UserAvatar userId={c.authorId} size="sm" />
                        <div className="min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-medium">{author?.name}</span>
                            <span className="text-muted-foreground">
                              {formatRelative(c.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm">{c.body}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
              <TabsContent value="history" className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Created {formatRelative(issue.createdAt)} · Updated{" "}
                  {formatRelative(issue.updatedAt)}
                </p>
              </TabsContent>
            </Tabs>
          </section>
        </div>

        <aside className="hidden border-l border-[#DFE1E6] lg:block">
          <div className="sticky top-0 flex flex-col gap-4 p-5">
            <Select
              value={issue.status}
              onValueChange={(v) =>
                updateIssue(issue.id, {
                  status: (v as IssueStatus) ?? issue.status,
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

            <Separator />

            <FieldGroup className="gap-3">
              <Field>
                <FieldLabel className="text-xs text-muted-foreground">
                  Assignee
                </FieldLabel>
                <Select
                  value={issue.assigneeId ?? "unassigned"}
                  onValueChange={(v) =>
                    updateIssue(issue.id, {
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
                  value={issue.priority}
                  onValueChange={(v) =>
                    updateIssue(issue.id, {
                      priority: (v as Priority) ?? issue.priority,
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
                  <UserAvatar userId={issue.reporterId} size="sm" />
                  {reporter?.name}
                </div>
              </Field>

              <Field>
                <FieldLabel className="text-xs text-muted-foreground">
                  Due date
                </FieldLabel>
                <Input
                  type="date"
                  value={issue.dueDate ?? ""}
                  onChange={(e) =>
                    updateIssue(issue.id, {
                      dueDate: e.target.value || null,
                    })
                  }
                />
              </Field>
            </FieldGroup>

            <p className="pt-2 text-xs text-muted-foreground">
              Created {formatRelative(issue.createdAt)}
              <br />
              Updated {formatRelative(issue.updatedAt)}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
