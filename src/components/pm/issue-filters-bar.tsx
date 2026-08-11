"use client"

import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUS_COLUMNS, users } from "@/lib/data"
import { hasActiveFilters } from "@/lib/filters"
import { useIssues } from "@/lib/issues-context"
import type { IssueStatus, IssueType, Priority } from "@/lib/types"

export function IssueFiltersBar({
  searchPlaceholder = "Search work",
}: {
  searchPlaceholder?: string
}) {
  const { filters, setFilters, resetFilters, filteredIssues, issues } =
    useIssues()
  const active = hasActiveFilters(filters)

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#DFE1E6] bg-white px-3 py-2.5 sm:px-6">
      <div className="relative min-w-[10rem] flex-1 sm:max-w-56 sm:flex-none">
        <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.query}
          onChange={(e) => setFilters({ query: e.target.value })}
          placeholder={searchPlaceholder}
          className="h-8 rounded-md border-[#DFE1E6] bg-white pl-7 text-sm"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(v) =>
          setFilters({ status: (v as IssueStatus | "all") ?? "all" })
        }
      >
        <SelectTrigger className="h-8 w-auto min-w-28 rounded-md">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_COLUMNS.map((col) => (
              <SelectItem key={col.id} value={col.id}>
                {col.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={filters.assigneeId}
        onValueChange={(v) =>
          setFilters({
            assigneeId: (v as string) ?? "all",
          })
        }
      >
        <SelectTrigger className="h-8 w-auto min-w-28 rounded-md">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All assignees</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {users.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={filters.type}
        onValueChange={(v) =>
          setFilters({ type: (v as IssueType | "all") ?? "all" })
        }
      >
        <SelectTrigger className="hidden h-8 w-auto min-w-24 rounded-md sm:flex">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="task">Task</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="story">Story</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority}
        onValueChange={(v) =>
          setFilters({ priority: (v as Priority | "all") ?? "all" })
        }
      >
        <SelectTrigger className="hidden h-8 w-auto min-w-28 rounded-md md:flex">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="highest">Highest</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="lowest">Lowest</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {active && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-md text-muted-foreground"
          onClick={resetFilters}
        >
          <X data-icon="inline-start" />
          Clear
        </Button>
      )}

      <span className="ml-auto hidden shrink-0 text-sm text-muted-foreground sm:inline">
        {filteredIssues.length} of {issues.length}
      </span>
    </div>
  )
}
