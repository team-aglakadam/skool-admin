"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Save, X, CheckCircle, XCircle, Edit3, Loader2, Users } from "lucide-react";
import { format, addDays, subDays, isToday } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type AttendanceStatus = "present" | "absent" | "leave";

interface Student {
  id: string;
  name: string;
  roll_number?: string;
  class_id: string;
  section_id?: string;
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

interface DailyStudentAttendanceUpdateProps {
  students: Student[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  classInfo: ClassInfo;
}

const DailyStudentAttendanceUpdate: React.FC<DailyStudentAttendanceUpdateProps> = ({
  students,
  selectedDate,
  onDateChange,
  classInfo,
}) => {
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [lastUpdatedInfo, setLastUpdatedInfo] = useState<{ updatedBy: string; updatedAt: string; } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();
  const dateString = format(selectedDate, "yyyy-MM-dd");

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch attendance data for the selected date
  const { data: existingAttendance = [], isLoading } = useQuery({
    queryKey: ["student-attendance", dateString, classInfo.id, classInfo.sectionId],
    queryFn: async () => {
      const params = new URLSearchParams({
        date: dateString,
        class_id: classInfo.id,
      });
      if (classInfo.sectionId) {
        params.append("section_id", classInfo.sectionId);
      }
      
      const response = await fetch(`/api/student-attendance?${params}`);
      if (!response.ok) throw new Error("Failed to fetch attendance");
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
          date: dateString,
          class_id: classInfo.id,
          section_id: classInfo.sectionId,
          attendance: attendanceRecords,
        }),
      });
      if (!response.ok) throw new Error("Failed to save attendance");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-attendance"] });
      toast.success("Attendance saved successfully!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error("Failed to save attendance");
      console.error("Save error:", error);
    },
  });

  // Load existing attendance data
  useEffect(() => {
    if (existingAttendance.length > 0) {
      const attendanceMap: Record<string, AttendanceStatus> = {};
      let mostRecentUpdate: { updatedBy: string; updatedAt: string; } | null = null;

      existingAttendance.forEach((record: StudentAttendanceRecord & { users?: { name: string } }) => {
        attendanceMap[record.student_id] = record.status;
        
        if (record.last_updated_at && record.users?.name) {
          if (!mostRecentUpdate || new Date(record.last_updated_at) > new Date(mostRecentUpdate.updatedAt)) {
            mostRecentUpdate = {
              updatedBy: record.users.name,
              updatedAt: record.last_updated_at,
            };
          }
        }
      });

      setAttendanceData(attendanceMap);
      setLastUpdatedInfo(mostRecentUpdate);
    } else {
      setAttendanceData({});
      setLastUpdatedInfo(null);
    }
  }, [existingAttendance]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSave = () => {
    const attendanceRecords: StudentAttendanceRecord[] = Object.entries(attendanceData).map(([studentId, status]) => ({
      student_id: studentId,
      date: dateString,
      status,
    }));

    saveAttendanceMutation.mutate(attendanceRecords);
  };

  const handleClear = () => {
    setAttendanceData({});
    toast.info("Attendance cleared");
  };

  const handleMarkAllPresent = () => {
    const newAttendanceData: Record<string, AttendanceStatus> = {};
    filteredStudents.forEach(student => {
      newAttendanceData[student.id] = "present";
    });
    setAttendanceData(prev => ({ ...prev, ...newAttendanceData }));
    toast.success("All students marked present");
  };

  const handleMarkAllAbsent = () => {
    const newAttendanceData: Record<string, AttendanceStatus> = {};
    filteredStudents.forEach(student => {
      newAttendanceData[student.id] = "absent";
    });
    setAttendanceData(prev => ({ ...prev, ...newAttendanceData }));
    toast.success("All students marked absent");
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4" />;
      case "absent":
        return <XCircle className="h-4 w-4" />;
      case "leave":
        return <Calendar className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const statusOptions = [
    { value: "present", label: "Present", icon: CheckCircle },
    { value: "absent", label: "Absent", icon: XCircle },
  ];

  const presentCount = Object.values(attendanceData).filter(status => status === "present").length;
  const absentCount = Object.values(attendanceData).filter(status => status === "absent").length;
  const totalMarked = presentCount + absentCount;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Daily Student Attendance
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {classInfo.name}{classInfo.sectionName && ` - Section ${classInfo.sectionName}`} • {format(selectedDate, "EEEE, MMMM dd, yyyy")}
              </p>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(subDays(selectedDate, 1))}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3">
              {isToday(selectedDate) ? "Today" : format(selectedDate, "MMM dd")}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(addDays(selectedDate, 1))}
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

      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search students by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent shadow-sm"
              />
              <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                {filteredStudents.length} of {students.length} students
              </span>
            )}
          </div>

          {/* Statistics */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {totalMarked}/{filteredStudents.length} marked
              </span>
            </div>
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
              Present: {presentCount}
            </Badge>
            <Badge variant="secondary" className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
              Absent: {absentCount}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <span className="text-sm font-medium text-green-800 dark:text-green-300 mr-2">Quick Actions:</span>
            <Button
              onClick={handleMarkAllPresent}
              size="sm"
              variant="outline"
              disabled={filteredStudents.length === 0 || saveAttendanceMutation.isPending}
              className="text-xs text-green-600 dark:text-green-400 border-green-200 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Mark All Present
            </Button>
            <Button
              onClick={handleMarkAllAbsent}
              size="sm"
              variant="outline"
              disabled={filteredStudents.length === 0 || saveAttendanceMutation.isPending}
              className="text-xs text-red-600 dark:text-red-400 border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <XCircle className="mr-1 h-3 w-3" />
              Mark All Absent
            </Button>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Actions:</span>
            <Button
              onClick={handleClear}
              size="sm"
              variant="outline"
              disabled={Object.keys(attendanceData).length === 0 || saveAttendanceMutation.isPending}
              className="text-xs hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400"
            >
              <X className="mr-1 h-3 w-3" />
              Clear All
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              disabled={Object.keys(attendanceData).length === 0 || saveAttendanceMutation.isPending}
              className={`text-xs transition-all duration-200 ${
                Object.keys(attendanceData).length > 0 && !saveAttendanceMutation.isPending
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

        {/* Students Table */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden bg-white dark:bg-gray-800">
          <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 sticky top-0 z-10 shadow-sm">
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-gray-100 min-w-[60px]">
                    Roll No.
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-gray-100 min-w-[200px]">
                    Student Name
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-900 dark:text-gray-100 min-w-[150px]">
                    Attendance Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                {filteredStudents.map((student) => {
                  const status = attendanceData[student.id];
                  
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {student.roll_number || "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 flex items-center justify-center text-sm font-semibold text-white shadow-sm">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                              {student.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center space-x-2">
                          {statusOptions.map((option) => {
                            const isSelected = status === option.value;
                            return (
                              <button
                                key={option.value}
                                onClick={() =>
                                  handleStatusChange(student.id, option.value as AttendanceStatus)
                                }
                                className={`
                                  w-10 h-10 rounded-full border-2 transition-all duration-200 
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
                        {status && (
                          <div className="mt-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs font-semibold px-2 py-1 ${
                                status === "present"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-600"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-600"
                              }`}
                            >
                              {status === "present" ? "Present" : "Absent"}
                            </Badge>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? "No students found matching your search." : "No students available."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyStudentAttendanceUpdate;
