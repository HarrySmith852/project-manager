"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { IssueFiltersBar } from "@/components/pm/issue-filters-bar"
import { IssueTypeIcon } from "@/components/pm/issue-type-icon"
import { PriorityIcon, PriorityLabel } from "@/components/pm/priority-icon"
import { StatusBadge } from "@/components/pm/status-badge"
import { UserAvatar } from "@/components/pm/user-avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getUser } from "@/lib/data"
import { useIssues } from "@/lib/issues-context"

export function ListView() {
  const { filteredIssues, projectKey, setCreateOpen } = useIssues()

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <IssueFiltersBar searchPlaceholder="Search work" />

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-3 md:hidden">
        {filteredIssues.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No matching work items
          </p>
        )}
        {filteredIssues.map((issue) => {
          const assignee = getUser(issue.assigneeId)
          return (
            <Link
              key={issue.id}
              href={`/projects/${projectKey.toLowerCase()}/issues/${issue.key}`}
              className="rounded-lg border border-[#DFE1E6] bg-white p-3 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  <IssueTypeIcon type={issue.type} />
                  <span className="text-xs font-medium text-[#0052CC]">
                    {issue.key}
                  </span>
                </div>
                <StatusBadge status={issue.status} />
              </div>
              <p className="mb-3 line-clamp-2 text-sm font-medium">
                {issue.title}
              </p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <UserAvatar userId={issue.assigneeId} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {assignee?.name ?? "Unassigned"}
                  </span>
                </div>
                <PriorityIcon priority={issue.priority} />
              </div>
            </Link>
          )
        })}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 justify-start rounded-md text-muted-foreground"
          onClick={() => setCreateOpen(true)}
        >
          <Plus data-icon="inline-start" />
          Create
        </Button>
      </div>

      <div className="hidden min-h-0 flex-1 overflow-auto md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10" />
              <TableHead>Work</TableHead>
              <TableHead className="w-40">Assignee</TableHead>
              <TableHead className="hidden w-40 lg:table-cell">
                Reporter
              </TableHead>
              <TableHead className="w-32">Priority</TableHead>
              <TableHead className="w-36">Status</TableHead>
              <TableHead className="hidden w-32 xl:table-cell">
                Resolution
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIssues.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  No matching work items
                </TableCell>
              </TableRow>
            )}
            {filteredIssues.map((issue) => {
              const assignee = getUser(issue.assigneeId)
              const reporter = getUser(issue.reporterId)
              return (
                <TableRow key={issue.id} className="group">
                  <TableCell>
                    <Checkbox aria-label={`Select ${issue.key}`} />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/projects/${projectKey.toLowerCase()}/issues/${issue.key}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <IssueTypeIcon type={issue.type} />
                      <span className="text-sm font-medium text-[#0052CC]">
                        {issue.key}
                      </span>
                      <span className="truncate text-sm">{issue.title}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar userId={issue.assigneeId} size="sm" />
                      <span className="truncate text-sm">
                        {assignee?.name ?? "Unassigned"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <UserAvatar userId={issue.reporterId} size="sm" />
                      <span className="truncate text-sm">
                        {reporter?.name ?? "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PriorityLabel priority={issue.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={issue.status} />
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground xl:table-cell">
                    Unresolved
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <div className="border-t border-[#DFE1E6] px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 justify-start rounded-md text-muted-foreground"
            onClick={() => setCreateOpen(true)}
          >
            <Plus data-icon="inline-start" />
            Create
          </Button>
        </div>
      </div>
    </div>
  )
}
