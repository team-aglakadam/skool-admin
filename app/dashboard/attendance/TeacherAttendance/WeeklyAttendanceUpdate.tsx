"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  Save,
  Edit3,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addWeeks,
  subWeeks,
} from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Teacher } from "@/types/teacher";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WeeklyAttendanceCharts } from "@/app/components/AttendanceCharts";

type AttendanceStatus = "present" | "absent" | "leave";

interface TeacherAttendanceRecord {
  id: string;
  teacher_id: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  last_updated_at?: string;
  teachers?: {
    id: string;
    users: {
      full_name: string;
      email: string;
    };
  };
  admin_user?: {
    full_name: string;
    email: string;
  };
}

interface ApiResponse {
  data: TeacherAttendanceRecord[];
  message: string;
}

interface WeeklyAttendanceData {
  teacherId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

interface WeeklyAttendanceUpdateProps {
  teachers: Teacher[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WeeklyAttendanceUpdate: React.FC<WeeklyAttendanceUpdateProps> = ({
  teachers,
  selectedDate,
  onDateChange,
}) => {
  const [weeklyAttendanceData, setWeeklyAttendanceData] = useState<
    Record<string, WeeklyAttendanceData>
  >({});
  const [editableDates, setEditableDates] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdatedInfo, setLastUpdatedInfo] = useState<{
    updatedBy: string;
    updatedAt: string;
  } | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get current week dates
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Check if current week is editable (only current week)
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const isCurrentWeek = isSameDay(weekStart, currentWeekStart);
  const canEdit = isCurrentWeek;

  // Get current date for editing restriction
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const isCurrentDateInWeek = weekDays.some(
    (day) => format(day, "yyyy-MM-dd") === currentDate
  );

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some((subject) =>
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Fetch attendance data for the week
  const { data: existingAttendance, isLoading } = useQuery<ApiResponse>({
    queryKey: ["teacher-attendance-week", format(weekStart, "yyyy-MM-dd")],
    queryFn: async () => {
      try {
        const response = await fetch(
          `/api/teacher-attendance?startDate=${format(
            weekStart,
            "yyyy-MM-dd"
          )}&endDate=${format(weekEnd, "yyyy-MM-dd")}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch attendance data"
          );
        }

        return response.json();
      } catch (err) {
        console.error("Error fetching attendance:", err);
        throw err;
      }
    },
    retry: 2,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Save attendance mutation
  const saveAttendanceMutation = useMutation({
    mutationFn: async (data: {
      attendanceData: WeeklyAttendanceData[];
      marked_by_admin_id: string;
    }) => {
      try {
        const response = await fetch("/api/teacher-attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to save attendance");
        }

        return response.json();
      } catch (err) {
        console.error("Error saving attendance:", err);
        throw err;
      }
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: ["teacher-attendance-week"],
      });
      const previousData = queryClient.getQueryData([
        "teacher-attendance-week",
      ]);

      queryClient.setQueryData(["teacher-attendance-week"], () => ({
        data: newData.attendanceData.map((item) => ({
          id: `temp-${item.teacherId}-${item.date}`,
          teacher_id: item.teacherId,
          date: item.date,
          status: item.status,
          remarks: item.notes,
        })),
        message: "Updating attendance...",
      }));

      return { previousData };
    },
    onSuccess: (response) => {
      toast.success(response.message);
      // Invalidate both weekly and daily attendance queries to ensure cross-view consistency
      queryClient.invalidateQueries({ queryKey: ["teacher-attendance-week"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-attendance"] }); // This covers daily attendance
    },
    onError: (error: Error, _variables, context) => {
      toast.error(error.message);
      if (context?.previousData) {
        queryClient.setQueryData(
          ["teacher-attendance-week"],
          context.previousData
        );
      }
    },
  });

  // Update local state when existing attendance data is fetched
  useEffect(() => {
    if (existingAttendance?.data) {
      const formattedData: Record<string, WeeklyAttendanceData> = {};
      let latestUpdate: { updatedBy: string; updatedAt: string } | null = null;
      let mostRecentTimestamp: Date | null = null;

      existingAttendance.data.forEach((record: TeacherAttendanceRecord) => {
        const key = `${record.teacher_id}-${record.date}`;
        formattedData[key] = {
          teacherId: record.teacher_id,
          date: record.date,
          status: record.status,
          notes: record.remarks,
        };

        // Track the most recent attendance update info
        if (record.last_updated_at && record.admin_user?.full_name) {
          const updateTimestamp = new Date(record.last_updated_at);
          if (!mostRecentTimestamp || updateTimestamp > mostRecentTimestamp) {
            mostRecentTimestamp = updateTimestamp;
            latestUpdate = {
              updatedBy: record.admin_user.full_name,
              updatedAt: updateTimestamp.toLocaleString(),
            };
          }
        }
      });

      setWeeklyAttendanceData(formattedData);
      setLastUpdatedInfo(latestUpdate);
    }
  }, [existingAttendance]);

  const statusOptions = [
    { value: "present", label: "Present", icon: CheckCircle },
    { value: "absent", label: "Absent", icon: XCircle },
  ];

  const handleWeeklyStatusChange = (
    teacherId: string,
    date: string,
    status: AttendanceStatus
  ) => {
    if (!canEdit || date !== currentDate || !editableDates.has(date)) {
      toast.error("Can only edit attendance for today");
      return;
    }

    const key = `${teacherId}-${date}`;
    setWeeklyAttendanceData((prev) => ({
      ...prev,
      [key]: {
        teacherId,
        date,
        status,
      },
    }));
  };

  const handleMarkAllForDate = (status: AttendanceStatus) => {
    if (!canEdit || !isCurrentDateInWeek || !editableDates.has(currentDate)) {
      toast.error("Can only edit attendance for today");
      return;
    }

    const newData = { ...weeklyAttendanceData };
    filteredTeachers.forEach((teacher) => {
      const key = `${teacher.id}-${currentDate}`;
      newData[key] = {
        teacherId: teacher.id,
        date: currentDate,
        status,
      };
    });
    setWeeklyAttendanceData(newData);
  };

  const handleClearCurrentDay = () => {
    if (!canEdit || !isCurrentDateInWeek) {
      toast.error("Can only clear attendance for today");
      return;
    }

    const newData = { ...weeklyAttendanceData };
    filteredTeachers.forEach((teacher) => {
      const key = `${teacher.id}-${currentDate}`;
      delete newData[key];
    });
    setWeeklyAttendanceData(newData);
  };

  const toggleDateEdit = (date: string) => {
    if (!canEdit || date !== currentDate) {
      toast.error("Can only edit attendance for today");
      return;
    }

    const newEditableDates = new Set(editableDates);
    if (newEditableDates.has(date)) {
      newEditableDates.delete(date);
    } else {
      newEditableDates.add(date);
    }
    setEditableDates(newEditableDates);
  };

  const isDateEdited = (date: string): boolean => {
    return teachers.some((teacher) => {
      const key = `${teacher.id}-${date}`;
      return (
        weeklyAttendanceData[key] ||
        existingAttendance?.data.some(
          (record) => record.teacher_id === teacher.id && record.date === date
        )
      );
    });
  };

  const getWeeklyStatus = (
    teacherId: string,
    date: string
  ): AttendanceStatus | "not-marked" => {
    const key = `${teacherId}-${date}`;
    return weeklyAttendanceData[key]?.status || "not-marked";
  };

  // Calculate chart data for weekly view
  const weeklyChartData = useMemo(() => {
    return weekDays.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      const dayAttendance = teachers.reduce(
        (acc, teacher) => {
          const status = getWeeklyStatus(teacher.id, dateKey);
          if (status === "present") acc.present++;
          else if (status === "absent") acc.absent++;
          else acc.notMarked++;
          return acc;
        },
        { present: 0, absent: 0, notMarked: 0 }
      );

      return {
        date: dateKey,
        ...dayAttendance,
      };
    });
  }, [weekDays, teachers, weeklyAttendanceData]);

  const getWeeklyStatusIcon = (status: AttendanceStatus | "not-marked") => {
    if (status === "not-marked") {
      return (
        <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300" />
      );
    }
    const option = statusOptions.find((opt) => opt.value === status);
    return option
      ? React.createElement(option.icon, { className: "h-4 w-4" })
      : null;
  };

  const calculateWeekPercentage = (teacherId: string): number => {
    const presentDays = weekDays.filter((day) => {
      const status = getWeeklyStatus(teacherId, format(day, "yyyy-MM-dd"));
      return status === "present";
    }).length;
    return Math.round((presentDays / weekDays.length) * 100);
  };

  const handleSaveAll = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    const attendanceArray = Object.entries(weeklyAttendanceData).map(
      ([, data]) => ({
        teacherId: data.teacherId,
        date: data.date,
        status: data.status,
        notes: data.notes,
      })
    );

    if (attendanceArray.length === 0) {
      toast.error("No attendance data to save");
      return;
    }

    try {
      await saveAttendanceMutation.mutateAsync({
        attendanceData: attendanceArray,
        marked_by_admin_id: user.id,
      });
      // After successful save, disable editing for saved dates
      setEditableDates(new Set());
    } catch (error) {
      console.error("Error in handleSaveAll:", error);
    }
  };

  const handleClearAll = () => {
    if (!canEdit || !isCurrentDateInWeek) {
      toast.error("Can only clear attendance for today");
      return;
    }

    const newData = { ...weeklyAttendanceData };

    // Remove all attendance data for current date only
    filteredTeachers.forEach((teacher) => {
      const key = `${teacher.id}-${currentDate}`;
      delete newData[key];
    });

    setWeeklyAttendanceData(newData);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    if (editableDates.size > 0) {
      toast.error("Please save or clear changes before navigating");
      return;
    }

    const newDate =
      direction === "prev"
        ? subWeeks(selectedDate, 1)
        : addWeeks(selectedDate, 1);

    onDateChange(newDate);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading attendance data...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Weekly Attendance Overview
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Week of{" "}
              <span className="font-medium text-gray-800">
                {format(weekStart, "MMM dd")} -{" "}
                {format(weekEnd, "MMM dd, yyyy")}
              </span>
            </CardDescription>
            {!canEdit && (
              <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md inline-flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {isCurrentWeek
                  ? "Only current week can be edited"
                  : "Past/future weeks are read-only"}
              </div>
            )}
            {lastUpdatedInfo && (
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                Last updated by{" "}
                <span className="font-medium">
                  {lastUpdatedInfo.updatedBy}
                </span>{" "}
                at {lastUpdatedInfo.updatedAt}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("prev")}
                disabled={
                  editableDates.size > 0 || saveAttendanceMutation.isPending
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("next")}
                disabled={
                  editableDates.size > 0 || saveAttendanceMutation.isPending
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Attendance Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Weekly Teacher Attendance
              </h3>
            </div>

            {/* Table Action Buttons */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                Actions:
              </span>
              <Button
                onClick={handleClearAll}
                size="sm"
                variant="outline"
                disabled={
                  !isCurrentDateInWeek ||
                  !editableDates.has(currentDate) ||
                  saveAttendanceMutation.isPending
                }
                className="text-xs hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400"
              >
                <X className="mr-1 h-3 w-3" />
                Clear Today
              </Button>
              <Button
                onClick={handleSaveAll}
                size="sm"
                disabled={
                  Object.keys(weeklyAttendanceData).length === 0 ||
                  saveAttendanceMutation.isPending
                }
                className={`text-xs transition-all duration-200 ${
                  Object.keys(weeklyAttendanceData).length > 0 &&
                  !saveAttendanceMutation.isPending
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-md dark:bg-green-500 dark:hover:bg-green-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                }`}
              >
                {saveAttendanceMutation.isPending ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Save className="mr-1 h-3 w-3" />
                )}
                {saveAttendanceMutation.isPending ? "Saving..." : "Save All"}
              </Button>
            </div>
          </div>

          {/* Search Bar - Above table on the left */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search teachers by name or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent shadow-sm"
                />
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchTerm && (
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                  {filteredTeachers.length} of {teachers.length} teachers
                </span>
              )}
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l4-4m0 0l4-4m-4 4v12"
                />
              </svg>
              Scroll horizontally to view all days
            </div>
          </div>

          {/* Mark All Buttons - Above table rows */}
          {isCurrentDateInWeek && editableDates.has(currentDate) && (
            <div className="flex items-center gap-2 mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300 mr-2">
                Quick Actions for Today ({format(new Date(), "MMM dd")}):
              </span>
              <Button
                onClick={() => handleMarkAllForDate("present")}
                size="sm"
                variant="outline"
                className="text-xs text-green-600 dark:text-green-400 border-green-200 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
              >
                <CheckCircle className="mr-1 h-3 w-3" />
                Mark All Present
              </Button>
              <Button
                onClick={() => handleMarkAllForDate("absent")}
                size="sm"
                variant="outline"
                className="text-xs text-red-600 dark:text-red-400 border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                <XCircle className="mr-1 h-3 w-3" />
                Mark All Absent
              </Button>
              <Button
                onClick={handleClearCurrentDay}
                size="sm"
                variant="outline"
                className="text-xs text-gray-600 border-gray-200 hover:bg-gray-50"
              >
                <X className="mr-1 h-3 w-3" />
                Clear Today
              </Button>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden bg-white dark:bg-gray-800">
            {/* Enhanced scrollable container with better visual cues */}
            <div className="relative">
              {/* Scroll indicator overlay */}
              <div
                className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white/80 dark:from-gray-800/80 to-transparent pointer-events-none z-30 opacity-0 transition-opacity duration-300"
                id="scroll-indicator"
              ></div>

              <div className="overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700">
                <table className="w-full border-collapse">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 sticky top-0 z-10 shadow-sm">
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-gray-100 sticky left-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 z-20 border-r border-gray-200 dark:border-gray-600 min-w-[200px] h-20">
                        <div className="flex items-center h-full">
                          <span>Teacher</span>
                        </div>
                      </th>
                      {weekDays.map((day) => {
                        const dateKey = format(day, "yyyy-MM-dd");
                        const isEditableDay = editableDates.has(dateKey);
                        const isToday = dateKey === currentDate;

                        return (
                          <th
                            key={day.toISOString()}
                            className={`text-center p-4 font-semibold text-gray-900 dark:text-gray-100 min-w-[120px] h-20 border-r border-gray-200 dark:border-gray-600 ${
                              isToday
                                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-600"
                                : ""
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center h-full space-y-2">
                              <div className="text-center">
                                <div
                                  className={`text-sm font-semibold ${
                                    isToday
                                      ? "text-blue-700 dark:text-blue-300"
                                      : "text-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {format(day, "EEE")}
                                </div>
                                <div
                                  className={`text-xs ${
                                    isToday
                                      ? "text-blue-600 dark:text-blue-400"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                >
                                  {format(day, "MMM dd")}
                                </div>
                              </div>

                              {/* Edit button only for current day */}
                              {isToday && canEdit && (
                                <Button
                                  onClick={() => toggleDateEdit(dateKey)}
                                  size="sm"
                                  variant={
                                    isEditableDay ? "default" : "outline"
                                  }
                                  disabled={saveAttendanceMutation.isPending}
                                  className={`text-xs h-6 px-2 transition-all duration-200 ${
                                    isEditableDay
                                      ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-md"
                                      : "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-600"
                                  }`}
                                >
                                  <Edit3 className="w-3 h-3 mr-1" />
                                  {isEditableDay ? "Editing" : "Edit"}
                                </Button>
                              )}
                            </div>
                          </th>
                        );
                      })}
                      <th className="text-center p-4 font-semibold text-gray-900 dark:text-gray-100 min-w-[80px] h-20 bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center justify-center h-full">
                          <span>Week %</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredTeachers.map((teacher) => (
                      <tr
                        key={teacher.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        <td className="p-4 sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-200 dark:border-gray-600 min-w-[200px]">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center text-sm font-semibold text-white shadow-sm">
                              {teacher.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                                {teacher.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {teacher.subjects.join(", ")}
                              </div>
                            </div>
                          </div>
                        </td>
                        {weekDays.map((day) => {
                          const dateKey = format(day, "yyyy-MM-dd");
                          const status = getWeeklyStatus(teacher.id, dateKey);
                          const isEditableDay =
                            editableDates.has(dateKey) &&
                            dateKey === currentDate;
                          const isToday = dateKey === currentDate;

                          return (
                            <td
                              key={day.toISOString()}
                              className={`text-center p-3 border-r border-gray-200 dark:border-gray-600 min-w-[120px] ${
                                isToday
                                  ? "bg-blue-50/50 dark:bg-blue-900/20"
                                  : "bg-white dark:bg-gray-800"
                              }`}
                            >
                              {isEditableDay ? (
                                <div className="flex flex-col items-center space-y-2">
                                  <div className="flex space-x-1">
                                    {statusOptions.map((option) => {
                                      const isSelected =
                                        status === option.value;
                                      return (
                                        <button
                                          key={option.value}
                                          onClick={() =>
                                            handleWeeklyStatusChange(
                                              teacher.id,
                                              dateKey,
                                              option.value as AttendanceStatus
                                            )
                                          }
                                          className={`
                                          w-9 h-9 rounded-full border-2 transition-all duration-200 
                                          flex items-center justify-center hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm
                                          ${
                                            isSelected
                                              ? option.value === "present"
                                                ? "bg-green-500 border-green-500 text-white shadow-md focus:ring-green-300 dark:focus:ring-green-400"
                                                : "bg-red-500 border-red-500 text-white shadow-md focus:ring-red-300 dark:focus:ring-red-400"
                                              : option.value === "present"
                                              ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/30 hover:border-green-400 dark:hover:border-green-500"
                                              : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/30 hover:border-red-400 dark:hover:border-red-500"
                                          }
                                        `}
                                          title={option.label}
                                        >
                                          {React.createElement(option.icon, {
                                            className: `h-4 w-4 ${
                                              isSelected ? "animate-pulse" : ""
                                            }`,
                                          })}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {status !== "not-marked" && (
                                    <div
                                      className={`
                                    text-xs font-semibold px-2 py-1 rounded-full shadow-sm
                                    ${
                                      status === "present"
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : "bg-red-100 text-red-800 border border-red-200"
                                    }
                                  `}
                                    >
                                      {status === "present"
                                        ? "Present"
                                        : "Absent"}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center space-y-2">
                                  <div
                                    className={`
                                  w-9 h-9 rounded-full flex items-center justify-center shadow-sm border-2
                                  ${
                                    status === "present"
                                      ? "bg-green-500 text-white border-green-500"
                                      : status === "absent"
                                      ? "bg-red-500 text-white border-red-500"
                                      : "bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-300 border-gray-200 dark:border-gray-500"
                                  }
                                `}
                                  >
                                    {getWeeklyStatusIcon(status)}
                                  </div>
                                  {status !== "not-marked" && (
                                    <div
                                      className={`
                                    text-xs font-semibold px-2 py-1 rounded-full shadow-sm
                                    ${
                                      status === "present"
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-600"
                                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-600"
                                    }
                                  `}
                                    >
                                      {status === "present" ? "P" : "A"}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                        <td className="text-center p-4 bg-gray-50 dark:bg-gray-700 min-w-[80px]">
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                          >
                            {calculateWeekPercentage(teacher.id)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section - Visually Separated */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Weekly Attendance Analytics
            </h3>
          </div>

          {/* Weekly Attendance Charts */}
          <WeeklyAttendanceCharts
            weeklyData={weeklyChartData}
            weekRange={`${format(weekStart, "MMM dd")} - ${format(
              weekEnd,
              "MMM dd, yyyy"
            )}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyAttendanceUpdate;
