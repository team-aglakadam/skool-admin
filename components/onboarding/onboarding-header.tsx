interface OnboardingHeaderProps {
  title: string
  description: string
}

export function OnboardingHeader({ title, description }: OnboardingHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
