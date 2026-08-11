import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUser } from "@/lib/data"
import { cn } from "@/lib/utils"

export function UserAvatar({
  userId,
  size = "sm",
  className,
}: {
  userId: string | null | undefined
  size?: "sm" | "default" | "lg"
  className?: string
}) {
  const user = getUser(userId)

  if (!user) {
    return (
      <Avatar size={size} className={cn("bg-muted", className)}>
        <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
          ?
        </AvatarFallback>
      </Avatar>
    )
  }

  return (
    <Avatar size={size} className={className} title={user.name}>
      <AvatarFallback
        className="text-[10px] font-semibold text-white"
        style={{ backgroundColor: user.color }}
      >
        {user.initials}
      </AvatarFallback>
    </Avatar>
  )
}
