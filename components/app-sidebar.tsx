"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  GraduationCap,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const ONBOARDING_ITEMS = [
  {
    href: "/onboarding/student",
    label: "Student",
    icon: GraduationCap,
  },
  {
    href: "/onboarding/teacher",
    label: "Teacher",
    icon: UserRound,
  },
] as const

function isNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(() =>
    pathname.startsWith("/onboarding")
  )

  const isOnboardingActive = pathname.startsWith("/onboarding")

  useEffect(() => {
    if (isOnboardingActive) {
      setOnboardingOpen(true)
    }
  }, [isOnboardingActive])

  const homeActive = pathname === "/"

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-slate-200",
          collapsed ? "justify-center px-2" : "px-4"
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-slate-900"
        >
          <GraduationCap className="size-6 shrink-0 text-blue-600" />
          {!collapsed && <span className="truncate">EduAdmin</span>}
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        <Link
          href="/"
          title={collapsed ? "Home" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            collapsed && "justify-center px-2",
            homeActive
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-slate-50"
          )}
        >
          <Home className="size-5 shrink-0" />
          {!collapsed && <span>Home</span>}
        </Link>

        {collapsed ? (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                title="Onboarding"
                className={cn(
                  "flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium transition-colors",
                  isOnboardingActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <UserPlus className="size-5 shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="w-44 p-1">
              {ONBOARDING_ITEMS.map((item) => {
                const active = isNavActive(pathname, item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </PopoverContent>
          </Popover>
        ) : (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setOnboardingOpen((open) => !open)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isOnboardingActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <UserPlus className="size-5 shrink-0" />
              <span className="flex-1 text-left">Onboarding</span>
              {onboardingOpen ? (
                <ChevronUp className="size-4 shrink-0 text-slate-400" />
              ) : (
                <ChevronDown className="size-4 shrink-0 text-slate-400" />
              )}
            </button>

            {onboardingOpen && (
              <div className="relative ml-5 space-y-0.5 pl-4 before:absolute before:top-0 before:bottom-2 before:left-0 before:w-px before:bg-slate-200">
                {ONBOARDING_ITEMS.map((item) => {
                  const active = isNavActive(pathname, item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-2 rounded-lg py-2 pr-3 pl-2 text-sm font-medium transition-colors before:absolute before:top-1/2 before:-left-4 before:h-px before:w-3 before:bg-slate-200",
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <span className="flex-1">{item.label}</span>
                      {active && (
                        <ChevronRight className="size-4 shrink-0" />
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="border-t border-slate-200 p-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed((value) => !value)}
          className={cn(
            "w-full justify-start text-slate-500 hover:text-slate-900",
            collapsed && "justify-center px-2"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <>
              <PanelLeftClose className="size-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
