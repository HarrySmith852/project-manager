"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  FolderKanban,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
} from "lucide-react"

import { CreateIssueDialog } from "@/components/pm/create-issue-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { project } from "@/lib/data"
import { useIssues } from "@/lib/issues-context"
import { PROJECT_TABS, getActiveTab } from "@/lib/project-nav"
import { cn } from "@/lib/utils"

function AppSidebar() {
  const pathname = usePathname()
  const { projectKey, projectName } = useIssues()
  const { isMobile, setOpenMobile } = useSidebar()
  const base = `/projects/${projectKey.toLowerCase()}`
  const activeTab = getActiveTab(pathname)

  function closeMobile() {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-[#DFE1E6]">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <Link
          href={`${base}/summary`}
          onClick={closeMobile}
          className="flex items-center gap-2 rounded-md px-1 py-1"
        >
          <span className="flex size-7 items-center justify-center rounded bg-[#0052CC] text-xs font-bold text-white">
            P
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">Pulse</p>
            <p className="truncate text-[11px] text-muted-foreground">
              Project management
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive
                  tooltip={projectName}
                  render={
                    <Link href={`${base}/summary`} onClick={closeMobile} />
                  }
                >
                  <span
                    className="flex size-4 items-center justify-center rounded text-white"
                    style={{ backgroundColor: project.iconColor }}
                  >
                    <FolderKanban className="size-2.5" />
                  </span>
                  <span>{projectName}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Views</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PROJECT_TABS.map((tab) => {
                const href = `${base}/${tab.href}`
                const Icon = tab.icon
                return (
                  <SidebarMenuItem key={tab.href}>
                    <SidebarMenuButton
                      isActive={activeTab === tab.href}
                      tooltip={tab.label}
                      render={<Link href={href} onClick={closeMobile} />}
                    >
                      <Icon />
                      <span>{tab.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <p className="px-2 py-1 text-xs text-muted-foreground">
          Team-managed project
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function ShellHeader() {
  const router = useRouter()
  const { setCreateOpen, projectKey, setFilters, filters } = useIssues()
  const { user, logout } = useAuth()
  const base = `/projects/${projectKey.toLowerCase()}`

  function handleLogout() {
    logout()
    router.replace("/login")
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-[#DFE1E6] bg-white px-2 sm:gap-3 sm:px-3">
      <SidebarTrigger className="shrink-0" />

      <Link
        href={`${base}/summary`}
        className="hidden items-center gap-2 sm:flex md:hidden"
      >
        <span className="flex size-7 items-center justify-center rounded bg-[#0052CC] text-xs font-bold text-white">
          P
        </span>
      </Link>

      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.query}
          onChange={(e) => setFilters({ query: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(`${base}/issues`)
            }
          }}
          placeholder="Search"
          className="h-9 w-full rounded-md border-[#DFE1E6] bg-[#F4F5F7] pl-8"
        />
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        <Button
          size="sm"
          className="h-8 gap-1 rounded-md bg-[#0052CC] px-2.5 text-white hover:bg-[#0747A6] sm:px-3"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="size-4" data-icon="inline-start" />
          <span className="hidden sm:inline">Create</span>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden sm:inline-flex"
          aria-label="Notifications"
        >
          <Bell />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden md:inline-flex"
          aria-label="Help"
        >
          <HelpCircle />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden md:inline-flex"
          aria-label="Settings"
        >
          <Settings />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]/40">
            <Avatar size="sm">
              <AvatarFallback
                className="text-[10px] font-semibold text-white"
                style={{ backgroundColor: user?.color ?? "#6554C0" }}
              >
                {user?.initials ?? "?"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function ProjectChrome() {
  const pathname = usePathname()
  const { projectKey, projectName } = useIssues()
  const base = `/projects/${projectKey.toLowerCase()}`
  const activeTab = getActiveTab(pathname)

  if (activeTab === null) {
    return null
  }

  return (
    <div className="shrink-0 border-b border-[#DFE1E6] bg-white px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded text-white"
            style={{ backgroundColor: project.iconColor }}
          >
            <LayoutGrid className="size-3.5" />
          </span>
          <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
            {projectName}
          </h1>
          <Button
            variant="ghost"
            size="icon-xs"
            className="hidden sm:inline-flex"
            aria-label="Favorite"
          >
            <Star className="size-3.5" />
          </Button>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="hidden h-8 rounded-md sm:inline-flex"
          >
            <Share2 data-icon="inline-start" />
            Share
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Project settings">
            <Settings />
          </Button>
        </div>
      </div>

      <nav className="-mx-1 flex gap-1 overflow-x-auto pb-px">
        {PROJECT_TABS.map((tab) => {
          const href = `${base}/${tab.href}`
          const isActive = activeTab === tab.href
          return (
            <Link
              key={tab.href}
              href={href}
              className={cn(
                "relative shrink-0 px-3 pb-2.5 text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-foreground",
                isActive && "text-[#0052CC]"
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-[#0052CC]" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider
        defaultOpen
        className="h-svh overflow-hidden bg-[#F4F5F7]"
        style={
          {
            "--sidebar-width": "15rem",
            "--sidebar-width-mobile": "18rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset className="min-w-0 overflow-hidden bg-[#F4F5F7]">
          <ShellHeader />
          <ProjectChrome />
          <div className="min-h-0 flex-1 overflow-auto">{children}</div>
        </SidebarInset>
        <CreateIssueDialog />
      </SidebarProvider>
    </TooltipProvider>
  )
}
