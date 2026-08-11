"use client"

import { FileText, MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useIssues } from "@/lib/issues-context"

const PAGES = [
  {
    title: "Project brief",
    updated: "Updated 2 days ago",
    excerpt: "Goals, audience, and success metrics for the landing page redesign.",
  },
  {
    title: "Design system notes",
    updated: "Updated yesterday",
    excerpt: "Color tokens, spacing rules, and component guidelines for handoff.",
  },
  {
    title: "Launch checklist",
    updated: "Updated 5 hours ago",
    excerpt: "SEO, analytics, redirects, and QA checks before go-live.",
  },
]

export function PagesView() {
  const { projectName } = useIssues()

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Pages</h2>
          <p className="text-sm text-muted-foreground">
            Docs and notes for {projectName}
          </p>
        </div>
        <Button
          size="sm"
          className="h-8 bg-[#0052CC] text-white hover:bg-[#0747A6]"
        >
          <Plus data-icon="inline-start" />
          Create page
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {PAGES.map((page) => (
          <article
            key={page.title}
            className="rounded-lg border border-[#DFE1E6] bg-white p-4 hover:bg-[#FAFBFC]"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <span className="flex size-9 items-center justify-center rounded-md bg-[#E9F2FF] text-[#0052CC]">
                <FileText className="size-4" />
              </span>
              <Button variant="ghost" size="icon-xs" aria-label="More">
                <MoreHorizontal />
              </Button>
            </div>
            <h3 className="mb-1 font-medium">{page.title}</h3>
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {page.excerpt}
            </p>
            <p className="text-xs text-muted-foreground">{page.updated}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
