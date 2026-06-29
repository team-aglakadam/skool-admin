import { Bell, Settings } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-end px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-50"
            aria-label="Settings"
          >
            <Settings className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                SA
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-sm sm:block">
              <p className="font-medium text-slate-900">Suresh A.</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
