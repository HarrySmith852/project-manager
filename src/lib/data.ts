import type { Issue, IssueStatus, Priority, Project, User } from "@/lib/types"

export const CURRENT_USER_ID = "u-sam"

export const users: User[] = [
  { id: "u-sam", name: "Sam Lee", initials: "SL", color: "#6554C0" },
  { id: "u-alex", name: "Alex Smith", initials: "AS", color: "#FF8B00" },
  { id: "u-jordan", name: "Jordan Kim", initials: "JK", color: "#00875A" },
  { id: "u-riley", name: "Riley Chen", initials: "RC", color: "#0052CC" },
]

export const project: Project = {
  key: "LP",
  name: "Landing page",
  iconColor: "#6554C0",
}

export const STATUS_COLUMNS: {
  id: IssueStatus
  label: string
  accent: string
}[] = [
  { id: "todo", label: "To Do", accent: "#6B778C" },
  { id: "concepting", label: "Concepting", accent: "#4C9AFF" },
  { id: "design", label: "Design", accent: "#6554C0" },
  { id: "testing", label: "Testing", accent: "#FFAB00" },
  { id: "launch", label: "Launch", accent: "#36B37E" },
]

export const PRIORITY_META: Record<
  Priority,
  { label: string; color: string; rank: number }
> = {
  highest: { label: "Highest", color: "#FF5630", rank: 5 },
  high: { label: "High", color: "#FF5630", rank: 4 },
  medium: { label: "Medium", color: "#FFAB00", rank: 3 },
  low: { label: "Low", color: "#0065FF", rank: 2 },
  lowest: { label: "Lowest", color: "#0065FF", rank: 1 },
}

export const initialIssues: Issue[] = [
  {
    id: "i-1",
    key: "LP-1",
    title: "Creating wireframe",
    description:
      "At this point we could start by creating wireframes for the landing page hero and feature sections.",
    type: "task",
    status: "concepting",
    priority: "high",
    assigneeId: "u-sam",
    reporterId: "u-sam",
    dueDate: "2026-10-25",
    labels: ["design"],
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-10T14:00:00Z",
    comments: [
      {
        id: "c-1",
        authorId: "u-alex",
        body: "Can we align on mobile breakpoints before wireframes?",
        createdAt: "2026-08-09T09:00:00Z",
      },
    ],
  },
  {
    id: "i-2",
    key: "LP-2",
    title: "Target audience research",
    description: "Interview 5 target users and summarize jobs-to-be-done.",
    type: "task",
    status: "testing",
    priority: "medium",
    assigneeId: "u-alex",
    reporterId: "u-sam",
    dueDate: null,
    labels: ["research"],
    createdAt: "2026-08-02T10:00:00Z",
    updatedAt: "2026-08-08T11:00:00Z",
    comments: [],
  },
  {
    id: "i-3",
    key: "LP-3",
    title: "Competitor analysis",
    description: "Compare 4 competitor landing pages for CTA placement and messaging.",
    type: "task",
    status: "testing",
    priority: "medium",
    assigneeId: "u-jordan",
    reporterId: "u-sam",
    dueDate: null,
    labels: ["research"],
    createdAt: "2026-08-02T11:00:00Z",
    updatedAt: "2026-08-07T16:00:00Z",
    comments: [],
  },
  {
    id: "i-4",
    key: "LP-4",
    title: "Content strategy",
    description: "Draft headline options and supporting copy for each section.",
    type: "story",
    status: "design",
    priority: "medium",
    assigneeId: "u-riley",
    reporterId: "u-sam",
    dueDate: null,
    labels: ["content"],
    createdAt: "2026-08-03T10:00:00Z",
    updatedAt: "2026-08-09T12:00:00Z",
    comments: [],
  },
  {
    id: "i-5",
    key: "LP-5",
    title: "UI design",
    description: "Produce high-fidelity UI for desktop and mobile.",
    type: "task",
    status: "todo",
    priority: "high",
    assigneeId: null,
    reporterId: "u-sam",
    dueDate: null,
    labels: ["design"],
    createdAt: "2026-08-04T10:00:00Z",
    updatedAt: "2026-08-04T10:00:00Z",
    comments: [],
  },
  {
    id: "i-6",
    key: "LP-6",
    title: "Prototyping",
    description: "Interactive prototype for usability testing.",
    type: "task",
    status: "todo",
    priority: "medium",
    assigneeId: "u-alex",
    reporterId: "u-sam",
    dueDate: null,
    labels: ["design"],
    createdAt: "2026-08-04T11:00:00Z",
    updatedAt: "2026-08-04T11:00:00Z",
    comments: [],
  },
  {
    id: "i-7",
    key: "LP-7",
    title: "Responsive design",
    description: "Ensure layouts adapt cleanly from 320px to 1440px.",
    type: "task",
    status: "todo",
    priority: "high",
    assigneeId: null,
    reporterId: "u-sam",
    dueDate: null,
    labels: ["design"],
    createdAt: "2026-08-05T10:00:00Z",
    updatedAt: "2026-08-05T10:00:00Z",
    comments: [],
  },
  {
    id: "i-8",
    key: "LP-8",
    title: "Usability testing",
    description: "Run moderated tests with 6 participants.",
    type: "task",
    status: "todo",
    priority: "low",
    assigneeId: "u-jordan",
    reporterId: "u-sam",
    dueDate: null,
    labels: ["research"],
    createdAt: "2026-08-05T12:00:00Z",
    updatedAt: "2026-08-05T12:00:00Z",
    comments: [],
  },
  {
    id: "i-9",
    key: "LP-9",
    title: "Copywriting and SEO optimization",
    description: "Finalize meta titles, descriptions, and on-page headings.",
    type: "task",
    status: "todo",
    priority: "lowest",
    assigneeId: "u-riley",
    reporterId: "u-sam",
    dueDate: null,
    labels: ["content", "seo"],
    createdAt: "2026-08-06T10:00:00Z",
    updatedAt: "2026-08-06T10:00:00Z",
    comments: [],
  },
]

export function getUser(id: string | null | undefined) {
  if (!id) return null
  return users.find((u) => u.id === id) ?? null
}

export function statusLabel(status: IssueStatus) {
  return STATUS_COLUMNS.find((c) => c.id === status)?.label ?? status
}
