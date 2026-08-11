import { ChevronsDown, ChevronsUp, Equal } from "lucide-react"

import { PRIORITY_META } from "@/lib/data"
import type { Priority } from "@/lib/types"
import { cn } from "@/lib/utils"

export function PriorityIcon({
  priority,
  className,
}: {
  priority: Priority
  className?: string
}) {
  const meta = PRIORITY_META[priority]
  const Icon =
    priority === "highest" || priority === "high"
      ? ChevronsUp
      : priority === "medium"
        ? Equal
        : ChevronsDown

  return (
    <Icon
      className={cn("size-3.5 shrink-0", className)}
      style={{ color: meta.color }}
      aria-label={meta.label}
    />
  )
}

export function PriorityLabel({ priority }: { priority: Priority }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <PriorityIcon priority={priority} />
      {PRIORITY_META[priority].label}
    </span>
  )
}
