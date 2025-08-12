"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Save, X, CheckCircle, XCircle, Edit3, Loader2 } from "lucide-react";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type AttendanceStatus = "present" | "absent" | "leave" | "not-marked";

interface Student {
  id: string;
  name: string;
  roll_number?: string;
  class_id: string;
  section_id?: string;
}

interface WeeklyAttendanceData {
  [studentId: string]: {
    [date: string]: AttendanceStatus;
  };
}

interface StudentAttendanceRecord {
  id?: string;
  student_id: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  marked_by_admin_id?: string;
  last_updated_at?: string;
}

interface ClassInfo {
  id: string;
  name: string;
  sectionId?: string;
  sectionName?: string;
}

interface WeeklyStudentAttendanceUpdateProps {
  students: Student[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  classInfo: ClassInfo;
}

const WeeklyStudentAttendanceUpdate: React.FC<WeeklyStudentAttendanceUpdateProps> = ({
  students,
  selectedDate,
  onDateChange,
  classInfo,
}) => {
  const [weeklyAttendanceData, setWeeklyAttendanceData] = useState<WeeklyAttendanceData>({});
  const [editableDates, setEditableDates] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdatedInfo, setLastUpdatedInfo] = useState<{ updatedBy: string; updatedAt: string; } | null>(null);

  const queryClient = useQueryClient();

  // Calculate week boundaries
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Sunday
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const isCurrentDateInWeek = weekDays.some(day => format(day, "yyyy-MM-dd") === currentDate);

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch weekly attendance data
  const { data: weeklyAttendance = [], isLoading } = useQuery({
    queryKey: ["student-attendance-weekly", format(weekStart, "yyyy-MM-dd"), format(weekEnd, "yyyy-MM-dd"), classInfo.id, classInfo.sectionId],
    queryFn: async () => {
      const params = new URLSearchParams({
        start_date: format(weekStart, "yyyy-MM-dd"),
        end_date: format(weekEnd, "yyyy-MM-dd"),
        class_id: classInfo.id,
      });
      if (classInfo.sectionId) {
        params.append("section_id", classInfo.sectionId);
      }
      
      const response = await fetch(`/api/student-attendance?${params}`);
      if (!response.ok) throw new Error("Failed to fetch weekly attendance");
      return response.json();
    },
  });

  // Save attendance mutation
  const saveAttendanceMutation = useMutation({
    mutationFn: async (attendanceRecords: StudentAttendanceRecord[]) => {
      const response = await fetch("/api/student-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_id: classInfo.id,
          section_id: classInfo.sectionId,
          attendance: attendanceRecords,
        }),
      });
      if (!response.ok) throw new Error("Failed to save attendance");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-attendance-weekly"] });
      toast.success("Attendance saved successfully!");
    },
    onError: (error) => {
      toast.error("Failed to save attendance");
      console.error("Save error:", error);
    },
  });

  // Load existing attendance data
  useEffect(() => {
    if (weeklyAttendance.length > 0) {
      const attendanceMap: WeeklyAttendanceData = {};
      let mostRecentUpdate: { updatedBy: string; updatedAt: string; } | null = null;

      weeklyAttendance.forEach((record: StudentAttendanceRecord & { users?: { name: string } }) => {
        if (!attendanceMap[record.student_id]) {
          attendanceMap[record.student_id] = {};
        }
        attendanceMap[record.student_id][record.date] = record.status;
        
        if (record.last_updated_at && record.users?.name) {
          if (!mostRecentUpdate || new Date(record.last_updated_at) > new Date(mostRecentUpdate.updatedAt)) {
            mostRecentUpdate = {
              updatedBy: record.users.name,
              updatedAt: record.last_updated_at,
            };
          }
        }
      });

      setWeeklyAttendanceData(attendanceMap);
      setLastUpdatedInfo(mostRecentUpdate);
    } else {
      setWeeklyAttendanceData({});
      setLastUpdatedInfo(null);
    }
  }, [weeklyAttendance]);

  const getWeeklyStatus = (studentId: string, dateKey: string): AttendanceStatus => {
    return weeklyAttendanceData[studentId]?.[dateKey] || "not-marked";
  };

  const handleWeeklyStatusChange = (studentId: string, dateKey: string, status: AttendanceStatus) => {
    setWeeklyAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [dateKey]: status,
      },
    }));
  };

  const toggleDateEdit = (dateKey: string) => {
    setEditableDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey);
      } else {
        newSet.add(dateKey);
      }
      return newSet;
    });
  };

  const handleSaveAll = () => {
    const attendanceRecords: StudentAttendanceRecord[] = [];
    
    Object.entries(weeklyAttendanceData).forEach(([studentId, dates]) => {
      Object.entries(dates).forEach(([date, status]) => {
        if (status !== "not-marked") {
          attendanceRecords.push({
            student_id: studentId,
            date,
            status,
          });
        }
      });
    });

    saveAttendanceMutation.mutate(attendanceRecords);
  };

  const handleClearAll = () => {
    if (!isCurrentDateInWeek) {
      toast.error("You can only clear attendance for the current week");
      return;
    }

    const clearedData = { ...weeklyAttendanceData };
    Object.keys(clearedData).forEach(studentId => {
      if (clearedData[studentId][currentDate]) {
        delete clearedData[studentId][currentDate];
      }
    });
    
    setWeeklyAttendanceData(clearedData);
    toast.info("Today's attendance cleared");
  };

  const handleMarkAllForDate = (status: AttendanceStatus) => {
    if (!isCurrentDateInWeek || !editableDates.has(currentDate)) {
      toast.error("You can only mark attendance for the current day");
      return;
    }

    const updatedData = { ...weeklyAttendanceData };
    filteredStudents.forEach(student => {
      if (!updatedData[student.id]) {
        updatedData[student.id] = {};
      }
      updatedData[student.id][currentDate] = status;
    });

    setWeeklyAttendanceData(updatedData);
    toast.success(`All students marked ${status} for today`);
  };

  const calculateWeekPercentage = (studentId: string): number => {
    const studentData = weeklyAttendanceData[studentId] || {};
    const markedDays = Object.values(studentData).filter(status => status !== "not-marked");
    const presentDays = Object.values(studentData).filter(status => status === "present");
    
    if (markedDays.length === 0) return 0;
    return Math.round((presentDays.length / markedDays.length) * 100);
  };

  const getWeeklyStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4" />;
      case "absent":
        return <XCircle className="h-4 w-4" />;
      case "leave":
        return <Calendar className="h-4 w-4" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>;
    }
  };

  const statusOptions = [
    { value: "present", label: "Present", icon: CheckCircle },
    { value: "absent", label: "Absent", icon: XCircle },
  ];

  const canEdit = isCurrentDateInWeek;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Weekly Student Attendance
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {classInfo.name}{classInfo.sectionName && ` - Section ${classInfo.sectionName}`} • {format(weekStart, "MMM dd")} - {format(weekEnd, "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(subWeeks(selectedDate, 1))}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3">
              Week {format(selectedDate, "w, yyyy")}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(addWeeks(selectedDate, 1))}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Last Updated Info */}
        {lastUpdatedInfo && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Last updated by {lastUpdatedInfo.updatedBy} at {format(new Date(lastUpdatedInfo.updatedAt), "MMM dd, yyyy 'at' h:mm a")}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Weekly Attendance Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Weekly Student Attendance
              </h3>
            </div>
            
            {/* Table Action Buttons */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Actions:</span>
              <Button
                onClick={handleClearAll}
                size="sm"
                variant="outline"
                disabled={!isCurrentDateInWeek || !editableDates.has(currentDate) || saveAttendanceMutation.isPending}
                className="text-xs hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400"
              >
                <X className="mr-1 h-3 w-3" />
                Clear Today
              </Button>
              <Button 
                onClick={handleSaveAll} 
                size="sm"
                disabled={Object.keys(weeklyAttendanceData).length === 0 || saveAttendanceMutation.isPending}
                className={`text-xs transition-all duration-200 ${
                  Object.keys(weeklyAttendanceData).length > 0 && !saveAttendanceMutation.isPending
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

          {/* Search Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent shadow-sm"
                />
                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0z" />
                </svg>
              </div>
              {searchTerm && (
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                  {filteredStudents.length} of {students.length} students
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Scroll horizontally to view all days
            </div>
          </div>
          
          {/* Mark All Buttons */}
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
            </div>
          )}

          <div className="rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden bg-white dark:bg-gray-800">
            <div className="overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700">
              <table className="w-full border-collapse">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 sticky top-0 z-10 shadow-sm">
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left p-4 font-semibold text-gray-900 dark:text-gray-100 sticky left-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 z-20 border-r border-gray-200 dark:border-gray-600 min-w-[200px] h-20">
                      <div className="flex items-center h-full">
                        <span>Student</span>
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
                            isToday ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-600" : ""
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center h-full space-y-2">
                            <div className="text-center">
                              <div className={`text-sm font-semibold ${
                                isToday ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"
                              }`}>
                                {format(day, "EEE")}
                              </div>
                              <div className={`text-xs ${
                                isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                              }`}>
                                {format(day, "MMM dd")}
                              </div>
                            </div>
                            
                            {/* Edit button only for current day */}
                            {isToday && canEdit && (
                              <Button
                                onClick={() => toggleDateEdit(dateKey)}
                                size="sm"
                                variant={isEditableDay ? "default" : "outline"}
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
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td className="p-4 sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-200 dark:border-gray-600 min-w-[200px]">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center text-sm font-semibold text-white shadow-sm">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                              {student.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              Roll: {student.roll_number || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      {weekDays.map((day) => {
                        const dateKey = format(day, "yyyy-MM-dd");
                        const status = getWeeklyStatus(student.id, dateKey);
                        const isEditableDay = editableDates.has(dateKey) && dateKey === currentDate;
                        const isToday = dateKey === currentDate;

                        return (
                          <td
                            key={day.toISOString()}
                            className={`text-center p-3 border-r border-gray-200 dark:border-gray-600 min-w-[120px] ${
                              isToday ? "bg-blue-50/50 dark:bg-blue-900/20" : "bg-white dark:bg-gray-800"
                            }`}
                          >
                            {isEditableDay ? (
                              <div className="flex flex-col items-center space-y-2">
                                <div className="flex space-x-1">
                                  {statusOptions.map((option) => {
                                    const isSelected = status === option.value;
                                    return (
                                      <button
                                        key={option.value}
                                        onClick={() =>
                                          handleWeeklyStatusChange(
                                            student.id,
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
                                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                    {status === "present" ? "Present" : "Absent"}
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
                        <Badge variant="secondary" className="text-xs font-semibold px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                          {calculateWeekPercentage(student.id)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyStudentAttendanceUpdate;
