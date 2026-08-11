export type Priority = "highest" | "high" | "medium" | "low" | "lowest"

export type IssueStatus =
  | "todo"
  | "concepting"
  | "design"
  | "testing"
  | "launch"

export type IssueType = "task" | "bug" | "story"

export type User = {
  id: string
  name: string
  initials: string
  color: string
}

export type Comment = {
  id: string
  authorId: string
  body: string
  createdAt: string
}

export type Issue = {
  id: string
  key: string
  title: string
  description: string
  type: IssueType
  status: IssueStatus
  priority: Priority
  assigneeId: string | null
  reporterId: string
  dueDate: string | null
  labels: string[]
  createdAt: string
  updatedAt: string
  comments: Comment[]
}

export type Project = {
  key: string
  name: string
  iconColor: string
}

export type CreateIssueInput = {
  title: string
  description?: string
  type: IssueType
  status: IssueStatus
  priority: Priority
  assigneeId?: string | null
}
