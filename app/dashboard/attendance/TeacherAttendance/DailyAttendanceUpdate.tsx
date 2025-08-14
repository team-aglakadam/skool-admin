"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  Save,
  Loader2,
  Edit3,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { GenericTable } from "@/app/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { Teacher } from "@/types/teacher";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DailyAttendanceCharts } from "@/app/components/AttendanceCharts";

type AttendanceStatus = "present" | "absent" | "not-marked";

interface TeacherAttendanceRecord {
  id: string;
  teacher_id: string;
  date: string;
  status: "present" | "absent" | "leave";
  remarks?: string;
  last_updated_at?: string;
  teachers: {
    id: string;
    user_id: string;
    users: {
      full_name: string;
      email: string;
      updated_at?: string;
    };
  };
  admin_user?: {
    full_name: string;
    email: string;
  };
}

interface TeacherAttendanceData {
  teacherId: string;
  status: AttendanceStatus;
  notes?: string;
}

interface TeacherWithAttendance {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  status: AttendanceStatus;
  notes?: string;
}

interface DailyAttendanceUpdateProps {
  teachers: Teacher[];
  selectedDate: Date;
}

const DailyAttendanceUpdate: React.FC<DailyAttendanceUpdateProps> = ({
  teachers,
  selectedDate,
}) => {
  const [attendanceData, setAttendanceData] = useState<
    Record<string, TeacherAttendanceData>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
  const [lastUpdatedInfo, setLastUpdatedInfo] = useState<{
    updatedBy: string;
    updatedAt: string;
  } | null>(null);
  const [hasBulkChanges, setHasBulkChanges] = useState(false);
  const [selectedBulkAction, setSelectedBulkAction] = useState<
    "present" | "absent" | null
  >(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch attendance data for the selected date
  const { data: existingAttendance, isLoading } = useQuery({
    queryKey: ["teacher-attendance", format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      const response = await fetch(
        `/api/teacher-attendance?date=${format(selectedDate, "yyyy-MM-dd")}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }
      return response.json();
    },
  });

  // Update local state when existing attendance data is fetched
  useEffect(() => {
    if (existingAttendance?.data) {
      const formattedData: Record<string, TeacherAttendanceData> = {};
      let latestUpdate: { updatedBy: string; updatedAt: string } | null = null;
      let mostRecentTimestamp: Date | null = null;

      existingAttendance.data.forEach((record: TeacherAttendanceRecord) => {
        formattedData[record.teacher_id] = {
          teacherId: record.teacher_id,
          status: record.status === "leave" ? "absent" : record.status, // Convert leave to absent for UI
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

      setAttendanceData(formattedData);
      setLastUpdatedInfo(latestUpdate);
      setHasBulkChanges(false);
    }
  }, [existingAttendance]);

  const statusOptions = [
    {
      value: "not-marked",
      label: "Not Marked",
      icon: CalendarIcon,
      color: "bg-gray-100 text-gray-800",
    },
    {
      value: "present",
      label: "Present",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800",
    },
    {
      value: "absent",
      label: "Absent",
      icon: XCircle,
      color: "bg-red-100 text-red-800",
    },
  ];

  const handleStatusChange = (teacherId: string, status: AttendanceStatus) => {
    setAttendanceData((prev) => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        teacherId,
        status,
      },
    }));
  };

  const handleNotesChange = useCallback((teacherId: string, notes: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        teacherId,
        notes,
      },
    }));
  }, []);

  const handleEditRow = (teacherId: string) => {
    setEditingRows((prev) => new Set([...prev, teacherId]));
  };

  const handleSaveRow = async (teacherId: string) => {
    const teacherData = attendanceData[teacherId];
    if (
      !teacherData ||
      !teacherData.status ||
      teacherData.status === "not-marked"
    ) {
      toast.error("Please select a status before saving");
      return;
    }

    try {
      setIsSaving(true);

      const attendanceArray = [
        {
          teacherId,
          status: teacherData.status,
          notes: teacherData.notes || "",
        },
      ];

      const response = await fetch("/api/teacher-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendanceData: attendanceArray,
          date: format(selectedDate, "yyyy-MM-dd"),
          marked_by_admin_id: user?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save attendance");
      }

      toast.success("Attendance saved successfully!");

      // Remove from editing rows
      setEditingRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(teacherId);
        return newSet;
      });

      // Invalidate and refetch the query
      queryClient.invalidateQueries({
        queryKey: ["teacher-attendance", format(selectedDate, "yyyy-MM-dd")],
      });
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save attendance"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = (teacherId: string) => {
    setEditingRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(teacherId);
      return newSet;
    });
    // Reset to original data if needed
    // You might want to store original values to reset here
  };

  const handleBulkAction = (action: "present" | "absent" | "clear") => {
    if (action === "clear") {
      setAttendanceData({});
      setEditingRows(new Set());
      setSelectedBulkAction(null);
    } else {
      const updatedData: Record<string, TeacherAttendanceData> = {};
      const allTeacherIds = new Set<string>();

      teachers.forEach((teacher) => {
        updatedData[teacher.id] = {
          teacherId: teacher.id,
          status: action,
        };
        allTeacherIds.add(teacher.id);
      });

      setAttendanceData(updatedData);
      // Put all rows in edit mode when mark present/absent is selected
      setEditingRows(allTeacherIds);
      // Set the selected bulk action for UI feedback
      setSelectedBulkAction(action);
    }
    setHasBulkChanges(true);
  };

  const handleBulkSave = async () => {
    if (!hasBulkChanges || Object.keys(attendanceData).length === 0) {
      toast.error("No changes to save");
      return;
    }

    try {
      setIsSaving(true);

      const attendanceArray = Object.entries(attendanceData).map(
        ([teacherId, data]) => ({
          teacherId,
          status: data.status,
          notes: data.notes || "",
        })
      );

      const response = await fetch("/api/teacher-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendanceData: attendanceArray,
          date: format(selectedDate, "yyyy-MM-dd"),
          marked_by_admin_id: user?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save attendance");
      }

      toast.success("Bulk attendance saved successfully!");
      setHasBulkChanges(false);
      // Return all rows to non-editable state after saving
      setEditingRows(new Set());
      // Reset selected bulk action
      setSelectedBulkAction(null);

      // Invalidate and refetch the query
      queryClient.invalidateQueries({
        queryKey: ["teacher-attendance", format(selectedDate, "yyyy-MM-dd")],
      });
    } catch (error) {
      console.error("Error saving bulk attendance:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save attendance"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Prepare data for GenericTable
  const tableData: TeacherWithAttendance[] = React.useMemo(
    () =>
      teachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        subjects: teacher.subjects,
        status: attendanceData[teacher.id]?.status || "not-marked",
        notes: attendanceData[teacher.id]?.notes || "",
      })),
    [teachers, attendanceData]
  );

  // Calculate chart data
  const chartData = useMemo(() => {
    const present = tableData.filter((t) => t.status === "present").length;
    const absent = tableData.filter((t) => t.status === "absent").length;
    const notMarked = tableData.filter((t) => t.status === "not-marked").length;
    const total = tableData.length;

    return {
      present,
      absent,
      notMarked,
      total,
    };
  }, [tableData]);

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

  // Define columns for GenericTable
  const columns: ColumnDef<TeacherWithAttendance>[] = [
    {
      accessorKey: "name",
      header: "Teacher",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-semibold text-white shadow-sm">
            {row.original.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.original.name}</div>
            <div className="text-sm text-gray-500">
              {row.original.subjects.join(", ")}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isRowEditing = editingRows.has(row.original.id);
        return (
          <Select
            value={row.original.status}
            onValueChange={(value: AttendanceStatus) =>
              handleStatusChange(row.original.id, value)
            }
            disabled={!isRowEditing}
          >
            <SelectTrigger className="w-36 h-9 text-sm border-gray-300 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-[140px]">
              {statusOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    {React.createElement(option.icon, { className: "h-4 w-4" })}
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => {
        const isRowEditing = editingRows.has(row.original.id);
        return (
          <input
            type="text"
            placeholder="Add notes..."
            value={attendanceData[row.original.id]?.notes || ""}
            onChange={(e) => handleNotesChange(row.original.id, e.target.value)}
            disabled={!isRowEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isRowEditing = editingRows.has(row.original.id);
        return (
          <div className="flex items-center gap-2">
            {isRowEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={() => handleSaveRow(row.original.id)}
                  disabled={isSaving}
                  className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white"
                  title="Save attendance for this teacher"
                >
                  {isSaving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancelEdit(row.original.id)}
                  className="h-8 px-3 hover:bg-red-50 hover:border-red-300"
                  title="Cancel editing"
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEditRow(row.original.id)}
                className="h-8 px-3 hover:bg-blue-50 hover:border-blue-300"
                title="Edit attendance for this teacher"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Daily Attendance Update
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              Update attendance for{" "}
              <span className="font-medium text-gray-800">
                {format(selectedDate, "EEEE, MMMM dd, yyyy")}
              </span>
            </CardDescription>
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
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedBulkAction === "present" ? "default" : "outline"}
              size="sm"
              onClick={() => handleBulkAction("present")}
              className={`${
                selectedBulkAction === "present"
                  ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                  : "hover:bg-green-50 hover:border-green-300"
              }`}
              title="Mark all teachers as present for this date"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark Present
            </Button>
            <Button
              variant={selectedBulkAction === "absent" ? "default" : "outline"}
              size="sm"
              onClick={() => handleBulkAction("absent")}
              className={`${
                selectedBulkAction === "absent"
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                  : "hover:bg-red-50 hover:border-red-300"
              }`}
              title="Mark all teachers as absent for this date"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Mark Absent
            </Button>
            <Button
              onClick={handleBulkSave}
              disabled={!hasBulkChanges || isSaving}
              className={`${
                hasBulkChanges && !isSaving
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              size="sm"
              title={hasBulkChanges ? "Save all changes" : "No changes to save"}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Attendance Table */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Teacher Details
          </h3>
          <GenericTable
            data={tableData}
            columns={columns}
            pageSize={10}
            showActions={false}
          />
        </div>
        {/* Attendance Charts */}
        <DailyAttendanceCharts
          attendanceData={chartData}
          date={format(selectedDate, "EEEE, MMMM dd, yyyy")}
        />
      </CardContent>
    </Card>
  );
};

export default DailyAttendanceUpdate;
