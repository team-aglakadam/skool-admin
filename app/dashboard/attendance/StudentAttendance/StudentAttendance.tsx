"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, BookOpen, GraduationCap, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import DailyStudentAttendanceUpdate from "./DailyStudentAttendanceUpdate";
import WeeklyStudentAttendanceUpdate from "./WeeklyStudentAttendanceUpdate";
import { useQuery } from "@tanstack/react-query";

interface Class {
  id: string;
  name: string;
  section_id?: string;
}

interface Section {
  id: string;
  name: string;
  class_id: string;
}

interface Student {
  id: string;
  name: string;
  roll_number?: string;
  class_id: string;
  section_id?: string;
}

const StudentAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<"daily" | "weekly">("daily");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");

  // Fetch classes
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await fetch("/api/classes");
      if (!response.ok) throw new Error("Failed to fetch classes");
      return response.json();
    },
  });

  // Fetch sections for selected class
  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ["sections", selectedClassId],
    queryFn: async () => {
      if (!selectedClassId) return [];
      const response = await fetch(`/api/sections?class_id=${selectedClassId}`);
      if (!response.ok) throw new Error("Failed to fetch sections");
      return response.json();
    },
    enabled: !!selectedClassId,
  });

  // Fetch students for selected class and section
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ["students", selectedClassId, selectedSectionId],
    queryFn: async () => {
      if (!selectedClassId) return [];
      const params = new URLSearchParams({ class_id: selectedClassId });
      if (selectedSectionId) params.append("section_id", selectedSectionId);
      
      const response = await fetch(`/api/students?${params}`);
      if (!response.ok) throw new Error("Failed to fetch students");
      return response.json();
    },
    enabled: !!selectedClassId,
  });

  // Reset section when class changes
  useEffect(() => {
    setSelectedSectionId("");
  }, [selectedClassId]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const selectedClass = classes.find((cls: Class) => cls.id === selectedClassId);
  const selectedSection = sections.find((sec: Section) => sec.id === selectedSectionId);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Student Attendance Management
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Track and manage student attendance by class and section
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {format(selectedDate, "EEEE, MMMM dd, yyyy")}
                </span>
              </div>
              <div className="flex space-x-2">
                <Link href="/dashboard/students">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Users className="h-4 w-4" />
                    <span>Manage Students</span>
                  </Button>
                </Link>
                <Link href="/dashboard/classes">
                  <Button variant="outline" size="sm" className="gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>Manage Classes</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Class and Section Selection */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Select Class & Section
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Class Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Class
                </label>
                <Select
                  value={selectedClassId}
                  onValueChange={setSelectedClassId}
                  disabled={classesLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={classesLoading ? "Loading classes..." : "Select a class"} />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls: Class) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Section Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Section
                </label>
                <Select
                  value={selectedSectionId}
                  onValueChange={setSelectedSectionId}
                  disabled={!selectedClassId || sectionsLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                      !selectedClassId 
                        ? "Select class first" 
                        : sectionsLoading 
                        ? "Loading sections..." 
                        : sections.length === 0 
                        ? "No sections available"
                        : "Select a section (optional)"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section: Section) => (
                      <SelectItem key={section.id} value={section.id}>
                        Section {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Student Count Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Students
                </label>
                <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-md">
                  <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {studentsLoading ? "Loading..." : `${students.length} students`}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Info Display */}
            {selectedClassId && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-blue-800 dark:text-blue-300">Selected:</span>
                  <span className="text-blue-700 dark:text-blue-400">
                    {selectedClass?.name}
                    {selectedSection && ` - Section ${selectedSection.name}`}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    ({students.length} students)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* View Type Toggle */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <div className="flex space-x-1">
                <Button
                  variant={viewType === "daily" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewType("daily")}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    viewType === "daily"
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md dark:bg-blue-500 dark:hover:bg-blue-600"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Daily View
                </Button>
                <Button
                  variant={viewType === "weekly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewType("weekly")}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    viewType === "weekly"
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md dark:bg-blue-500 dark:hover:bg-blue-600"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Weekly View
                </Button>
              </div>
            </div>
          </div>

          {/* Attendance Content */}
          {selectedClassId && students.length > 0 ? (
            <>
              {viewType === "daily" ? (
                <DailyStudentAttendanceUpdate
                  students={students}
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                  classInfo={{
                    id: selectedClassId,
                    name: selectedClass?.name || "",
                    sectionId: selectedSectionId,
                    sectionName: selectedSection?.name || ""
                  }}
                />
              ) : (
                <WeeklyStudentAttendanceUpdate
                  students={students}
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                  classInfo={{
                    id: selectedClassId,
                    name: selectedClass?.name || "",
                    sectionId: selectedSectionId,
                    sectionName: selectedSection?.name || ""
                  }}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {!selectedClassId 
                  ? "Select a Class to Get Started" 
                  : students.length === 0 
                  ? "No Students Found" 
                  : "Loading Students..."}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                {!selectedClassId 
                  ? "Choose a class and optionally a section to view and manage student attendance records."
                  : students.length === 0 
                  ? "No students are enrolled in the selected class and section."
                  : "Please wait while we load the student data."}
              </p>
              {!selectedClassId && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link href="/dashboard/students">
                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                      <Users className="h-4 w-4" />
                      <span>Manage Students</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/classes">
                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                      <BookOpen className="h-4 w-4" />
                      <span>Manage Classes</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendance;
