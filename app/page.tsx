import Link from "next/link"
import { GraduationCap, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
      <div className="text-center">
        <p className="text-muted-foreground">
          School administration dashboard
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/onboarding/student">
            <GraduationCap className="size-4" />
            Student Onboarding
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/onboarding/teacher">
            <UserRound className="size-4" />
            Teacher Onboarding
          </Link>
        </Button>
      </div>
    </main>
  )
}
