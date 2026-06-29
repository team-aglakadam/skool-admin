"use client";

import { ReactNode } from "react";
import { useSchoolContext } from "@/contexts/SchoolContext";
import type { SchoolFeatureKey } from "@/types/school";
import { ShieldX } from "lucide-react";

type FeatureGateProps = {
  feature: SchoolFeatureKey;
  children: ReactNode;
  fallback?: ReactNode;
};

function DefaultFallback({ feature }: { feature: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <ShieldX className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">Feature Not Available</h2>
      <p className="text-muted-foreground max-w-md">
        The <span className="font-medium capitalize">{feature}</span> feature is
        not enabled for your school. Contact your school administrator to enable
        it.
      </p>
    </div>
  );
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { isFeatureEnabled, loading } = useSchoolContext();

  if (loading) return null;

  if (!isFeatureEnabled(feature)) {
    return fallback ?? <DefaultFallback feature={feature} />;
  }

  return <>{children}</>;
}
