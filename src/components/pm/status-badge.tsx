import { STATUS_COLUMNS } from "@/lib/data"
import type { IssueStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

export function StatusBadge({
  status,
  className,
}: {
  status: IssueStatus
  className?: string
}) {
  const column = STATUS_COLUMNS.find((c) => c.id === status)

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded px-2 text-[11px] font-bold tracking-wide uppercase",
        className
      )}
      style={{
        backgroundColor: `${column?.accent ?? "#6B778C"}22`,
        color: column?.accent ?? "#6B778C",
      }}
    >
      {column?.label ?? status}
    </span>
  )
}
