import type { Issue, IssueStatus, IssueType, Priority } from "@/lib/types"

export type IssueFilters = {
  query: string
  status: IssueStatus | "all"
  assigneeId: string | "all" | "unassigned"
  type: IssueType | "all"
  priority: Priority | "all"
}

export const DEFAULT_FILTERS: IssueFilters = {
  query: "",
  status: "all",
  assigneeId: "all",
  type: "all",
  priority: "all",
}

export function filterIssues(issues: Issue[], filters: IssueFilters): Issue[] {
  const q = filters.query.trim().toLowerCase()

  return issues.filter((issue) => {
    if (q) {
      const hay = `${issue.key} ${issue.title} ${issue.description}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (filters.status !== "all" && issue.status !== filters.status) return false
    if (filters.type !== "all" && issue.type !== filters.type) return false
    if (filters.priority !== "all" && issue.priority !== filters.priority) {
      return false
    }
    if (filters.assigneeId === "unassigned") {
      if (issue.assigneeId !== null) return false
    } else if (
      filters.assigneeId !== "all" &&
      issue.assigneeId !== filters.assigneeId
    ) {
      return false
    }
    return true
  })
}

export function hasActiveFilters(filters: IssueFilters) {
  return (
    filters.query.trim() !== "" ||
    filters.status !== "all" ||
    filters.assigneeId !== "all" ||
    filters.type !== "all" ||
    filters.priority !== "all"
  )
}
