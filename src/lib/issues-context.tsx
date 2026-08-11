"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { initialIssues, project } from "@/lib/data"
import {
  DEFAULT_FILTERS,
  filterIssues,
  type IssueFilters,
} from "@/lib/filters"
import type {
  CreateIssueInput,
  Issue,
  IssueStatus,
  Priority,
} from "@/lib/types"

const STORAGE_KEY = "pulse-issues-v1"

type StoredState = {
  issues: Issue[]
  nextNumber: number
}

type IssuesContextValue = {
  issues: Issue[]
  filteredIssues: Issue[]
  filters: IssueFilters
  setFilters: (
    patch: Partial<IssueFilters> | ((prev: IssueFilters) => IssueFilters)
  ) => void
  resetFilters: () => void
  hydrated: boolean
  projectKey: string
  projectName: string
  createOpen: boolean
  setCreateOpen: (open: boolean) => void
  createIssue: (input: CreateIssueInput) => Issue
  updateIssue: (id: string, patch: Partial<Issue>) => void
  moveIssue: (id: string, status: IssueStatus) => void
  addComment: (issueId: string, body: string) => void
  getIssueByKey: (key: string) => Issue | undefined
}

const IssuesContext = createContext<IssuesContextValue | null>(null)

function loadStored(): StoredState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredState
    if (!Array.isArray(parsed.issues)) return null
    return parsed
  } catch {
    return null
  }
}

export function IssuesProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const [nextNumber, setNextNumber] = useState(10)
  const [createOpen, setCreateOpen] = useState(false)
  const [filters, setFiltersState] = useState<IssueFilters>(DEFAULT_FILTERS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = loadStored()
    if (stored) {
      setIssues(stored.issues)
      setNextNumber(stored.nextNumber || 10)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const payload: StoredState = { issues, nextNumber }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [issues, nextNumber, hydrated])

  const setFilters = useCallback(
    (
      patch: Partial<IssueFilters> | ((prev: IssueFilters) => IssueFilters)
    ) => {
      setFiltersState((prev) =>
        typeof patch === "function" ? patch(prev) : { ...prev, ...patch }
      )
    },
    []
  )

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS)
  }, [])

  const createIssue = useCallback(
    (input: CreateIssueInput) => {
      const now = new Date().toISOString()
      const key = `${project.key}-${nextNumber}`
      const issue: Issue = {
        id: `i-${Date.now()}`,
        key,
        title: input.title,
        description: input.description ?? "",
        type: input.type,
        status: input.status,
        priority: input.priority,
        assigneeId: input.assigneeId ?? null,
        reporterId: "u-sam",
        dueDate: null,
        labels: [],
        createdAt: now,
        updatedAt: now,
        comments: [],
      }
      setNextNumber((n) => n + 1)
      setIssues((prev) => [issue, ...prev])
      return issue
    },
    [nextNumber]
  )

  const updateIssue = useCallback((id: string, patch: Partial<Issue>) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id
          ? { ...issue, ...patch, updatedAt: new Date().toISOString() }
          : issue
      )
    )
  }, [])

  const moveIssue = useCallback((id: string, status: IssueStatus) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id
          ? { ...issue, status, updatedAt: new Date().toISOString() }
          : issue
      )
    )
  }, [])

  const addComment = useCallback((issueId: string, body: string) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              updatedAt: new Date().toISOString(),
              comments: [
                ...issue.comments,
                {
                  id: `c-${Date.now()}`,
                  authorId: "u-sam",
                  body,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : issue
      )
    )
  }, [])

  const getIssueByKey = useCallback(
    (key: string) =>
      issues.find((i) => i.key.toLowerCase() === key.toLowerCase()),
    [issues]
  )

  const filteredIssues = useMemo(
    () => filterIssues(issues, filters),
    [issues, filters]
  )

  const value = useMemo(
    () => ({
      issues,
      filteredIssues,
      filters,
      setFilters,
      resetFilters,
      hydrated,
      projectKey: project.key,
      projectName: project.name,
      createOpen,
      setCreateOpen,
      createIssue,
      updateIssue,
      moveIssue,
      addComment,
      getIssueByKey,
    }),
    [
      issues,
      filteredIssues,
      filters,
      setFilters,
      resetFilters,
      hydrated,
      createOpen,
      createIssue,
      updateIssue,
      moveIssue,
      addComment,
      getIssueByKey,
    ]
  )

  return (
    <IssuesContext.Provider value={value}>{children}</IssuesContext.Provider>
  )
}

export function useIssues() {
  const ctx = useContext(IssuesContext)
  if (!ctx) throw new Error("useIssues must be used within IssuesProvider")
  return ctx
}

export function useIssuePriorityUpdate() {
  const { updateIssue } = useIssues()
  return (id: string, priority: Priority) => updateIssue(id, { priority })
}
