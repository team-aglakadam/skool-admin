'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define the shape of a single timetable slot
interface TimetableSlot {
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
}

// Define the context shape
interface TimetableContextType {
  timetable: TimetableSlot[];
  loading: boolean;
  error: string | null;
  fetchTimetable: (classId: string) => Promise<void>;
}

// Create the context with a default value
const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

// Create the provider component
export function TimetableProvider({ children }: { children: ReactNode }) {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetable = useCallback(async (classId: string) => {
    if (!classId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/timetable?classId=${classId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch timetable');
      }
      const data: TimetableSlot[] = await response.json();
      setTimetable(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setTimetable([]); // Clear previous data on error
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    timetable,
    loading,
    error,
    fetchTimetable,
  };

  return (
    <TimetableContext.Provider value={value}>
      {children}
    </TimetableContext.Provider>
  );
}

// Create a custom hook for easy consumption
export function useTimetable() {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
}
