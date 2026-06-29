import { Card, CardContent } from "@/components/ui/card"
import { OnboardingFooter } from "@/components/onboarding/onboarding-footer"
import { cn } from "@/lib/utils"

interface OnboardingLayoutProps {
  children: React.ReactNode
  stepper?: React.ReactNode
  className?: string
}

export function OnboardingLayout({
  children,
  stepper,
  className,
}: OnboardingLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {stepper && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">{stepper}</CardContent>
        </Card>
      )}

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6 sm:p-8">{children}</CardContent>
      </Card>

      <OnboardingFooter />
    </div>
  )
}
