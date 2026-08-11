"use client"

import { ClipboardList, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const FORMS = [
  {
    name: "Bug report",
    responses: 12,
    status: "Open",
    description: "Collect reproduction steps and environment details.",
  },
  {
    name: "Feature request",
    responses: 8,
    status: "Open",
    description: "Capture ideas from stakeholders and customers.",
  },
  {
    name: "Launch sign-off",
    responses: 3,
    status: "Closed",
    description: "Approvals from design, eng, and marketing before release.",
  },
]

export function FormsView() {
  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Forms</h2>
          <p className="text-sm text-muted-foreground">
            Intake forms that create work items in this project
          </p>
        </div>
        <Button
          size="sm"
          className="h-8 bg-[#0052CC] text-white hover:bg-[#0747A6]"
        >
          <Plus data-icon="inline-start" />
          Create form
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#DFE1E6] bg-white">
        {FORMS.map((form, i) => (
          <div
            key={form.name}
            className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${
              i < FORMS.length - 1 ? "border-b border-[#DFE1E6]" : ""
            }`}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#F4F5F7] text-[#5E6C84]">
                <ClipboardList className="size-4" />
              </span>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-medium">{form.name}</h3>
                  <Badge
                    variant="secondary"
                    className="rounded-md text-[10px] uppercase"
                  >
                    {form.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {form.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-12 sm:pl-0">
              <span className="text-sm text-muted-foreground">
                {form.responses} responses
              </span>
              <Button variant="outline" size="sm" className="h-8 rounded-md">
                Open
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
