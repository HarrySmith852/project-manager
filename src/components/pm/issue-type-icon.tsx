import { Bug, CheckSquare, Bookmark } from "lucide-react"

import type { IssueType } from "@/lib/types"
import { cn } from "@/lib/utils"

const META: Record<
  IssueType,
  { label: string; color: string; Icon: typeof CheckSquare }
> = {
  task: { label: "Task", color: "#4BADE8", Icon: CheckSquare },
  bug: { label: "Bug", color: "#E34935", Icon: Bug },
  story: { label: "Story", color: "#63BA3C", Icon: Bookmark },
}

export function IssueTypeIcon({
  type,
  className,
}: {
  type: IssueType
  className?: string
}) {
  const { Icon, color, label } = META[type]
  return (
    <Icon
      className={cn("size-3.5 shrink-0", className)}
      style={{ color }}
      aria-label={label}
    />
  )
}
