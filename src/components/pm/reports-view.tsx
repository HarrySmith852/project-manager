"use client"

import Link from "next/link"
import {
  Activity,
  BarChart3,
  LineChart,
  ScatterChart,
  TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { useIssues } from "@/lib/issues-context"

const REPORTS = [
  {
    title: "Cumulative flow diagram",
    description: "Track work item count by status over time.",
    icon: Activity,
    href: "#",
  },
  {
    title: "Cycle time report",
    description: "See how long work items take to complete.",
    icon: ScatterChart,
    href: "#",
  },
  {
    title: "Burnup report",
    description: "Compare completed scope against total scope.",
    icon: TrendingUp,
    badge: "Requires sprints",
    href: "#",
  },
  {
    title: "Sprint burndown chart",
    description: "Monitor remaining work through a sprint.",
    icon: LineChart,
    badge: "Requires sprints",
    href: "#",
  },
  {
    title: "Velocity report",
    description: "Compare completed work across recent sprints.",
    icon: BarChart3,
    badge: "Requires sprints",
    href: "#",
  },
  {
    title: "Deployment frequency",
    description: "Understand how often changes ship to production.",
    icon: Activity,
    href: "#",
  },
]

export function ReportsView() {
  const { projectName } = useIssues()

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Reports</h2>
        <p className="text-sm text-muted-foreground">
          Insights for {projectName}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((report) => {
          const Icon = report.icon
          return (
            <Link
              key={report.title}
              href={report.href}
              className="rounded-lg border border-[#DFE1E6] bg-white p-4 transition hover:border-[#0052CC]/40 hover:bg-[#FAFBFC]"
            >
              <div className="mb-4 flex h-24 items-end rounded-md bg-[#F4F5F7] p-3">
                <Icon className="size-10 text-[#0052CC]/70" />
              </div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="font-medium">{report.title}</h3>
                {report.badge && (
                  <Badge
                    variant="secondary"
                    className="rounded-md bg-[#FFFAE6] text-[10px] text-[#FF8B00] uppercase"
                  >
                    {report.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {report.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
