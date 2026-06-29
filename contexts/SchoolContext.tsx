"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { School, SchoolFeatureKey, SchoolFeatures } from "@/types/school";

const DEFAULT_FEATURES: SchoolFeatures = {
  attendance: true,
  exams: false,
  transport: false,
  fees: false,
  reports: false,
  timetable: true,
};

type SchoolContextType = {
  school: School | null;
  loading: boolean;
  error: string | null;
  isFeatureEnabled: (feature: SchoolFeatureKey) => boolean;
  updateSchool: (updates: Partial<School>) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
};

const SchoolContext = createContext<SchoolContextType>({
  school: null,
  loading: true,
  error: null,
  isFeatureEnabled: () => false,
  updateSchool: async () => ({ success: false }),
  refetch: async () => {},
});

export function SchoolProvider({ children }: { children: ReactNode }) {
  const { schoolId, isLoading: authLoading } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchool = useCallback(async () => {
    if (!schoolId) {
      setSchool(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/schools/current");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch school");
      }

      const { data } = await res.json();
      setSchool(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch school";
      setError(message);
      console.error("SchoolContext fetch error:", message);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    if (!authLoading) {
      fetchSchool();
    }
  }, [authLoading, fetchSchool]);

  const isFeatureEnabled = useCallback(
    (feature: SchoolFeatureKey): boolean => {
      if (!school?.enabled_features) return DEFAULT_FEATURES[feature] ?? false;
      return school.enabled_features[feature] ?? false;
    },
    [school]
  );

  const updateSchool = useCallback(
    async (updates: Partial<School>): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/schools/current", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!res.ok) {
          const errData = await res.json();
          return { success: false, error: errData.error };
        }

        const { data } = await res.json();
        setSchool(data);
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update school";
        return { success: false, error: message };
      }
    },
    []
  );

  return (
    <SchoolContext.Provider
      value={{
        school,
        loading,
        error,
        isFeatureEnabled,
        updateSchool,
        refetch: fetchSchool,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export const useSchoolContext = () => useContext(SchoolContext);
