"use client";

import { useSchoolContext } from "@/contexts/SchoolContext";

export function useSchool() {
  const { school, loading, error, isFeatureEnabled, updateSchool, refetch } =
    useSchoolContext();

  return {
    currentSchool: school,
    loading,
    error,
    hasSchools: !!school,
    isFeatureEnabled,
    updateSchool,
    refetch,
  };
}
