import Link from "next/link"
import { ChevronRight, HelpCircle } from "lucide-react"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-slate-900">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span>Onboarding</span>
          <ChevronRight className="size-4" />
          <span className="text-slate-900">New Enrollment</span>
        </nav>

        {children}
      </div>

      <button
        type="button"
        className="fixed right-6 bottom-6 flex size-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-transform hover:scale-105"
        aria-label="Help"
      >
        <HelpCircle className="size-5" />
      </button>
    </>
  )
}
