import type { LucideIcon } from "lucide-react"
import {
  CalendarDays,
  ClipboardList,
  FileText,
  GanttChart,
  LayoutDashboard,
  LayoutGrid,
  ListTodo,
  BarChart3,
  CircleDot,
} from "lucide-react"

export type ProjectTab = {
  href: string
  label: string
  icon: LucideIcon
}

/** Matches Jira project view tabs from Mobbin */
export const PROJECT_TABS: ProjectTab[] = [
  { href: "summary", label: "Summary", icon: LayoutDashboard },
  { href: "list", label: "List", icon: ListTodo },
  { href: "board", label: "Board", icon: LayoutGrid },
  { href: "calendar", label: "Calendar", icon: CalendarDays },
  { href: "timeline", label: "Timeline", icon: GanttChart },
  { href: "issues", label: "Issues", icon: CircleDot },
  { href: "pages", label: "Pages", icon: FileText },
  { href: "forms", label: "Forms", icon: ClipboardList },
  { href: "reports", label: "Reports", icon: BarChart3 },
]

export function getActiveTab(pathname: string): string | null {
  // Full issue detail page hides project tabs
  if (/\/issues\/[^/]+/.test(pathname)) {
    return null
  }
  // Prefer longer/more specific matches first (issues before list)
  const ordered = [...PROJECT_TABS].sort(
    (a, b) => b.href.length - a.href.length
  )
  for (const tab of ordered) {
    if (pathname.includes(`/${tab.href}`)) return tab.href
  }
  return "summary"
}
