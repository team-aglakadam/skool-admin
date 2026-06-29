"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar, CalendarDays, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import DailyAttendanceUpdate from "./DailyAttendanceUpdate";
import WeeklyAttendanceUpdate from "./WeeklyAttendanceUpdate";
import { useTeachers } from "@/hooks/useTeachers";
import { cn } from "@/lib/utils";
import Loader from "@/app/components/Loader";

const TeacherAttendance = () => {
  const { teachers, isLoading } = useTeachers();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("daily");

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Simplified header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Teacher Attendance
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track teacher attendance records
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-[240px] justify-start text-left font-normal")}
                disabled
              >
                <Calendar className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-gray-200">
          <TabsList className="inline-flex h-auto items-center justify-start bg-transparent p-0 text-muted-foreground w-full sm:w-1/2">
            <TabsTrigger
              value="daily"
              className="relative inline-flex items-center justify-center whitespace-nowrap px-6 py-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 bg-transparent border-0 rounded-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent after:transition-all after:duration-200 data-[state=active]:after:bg-blue-600"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Daily Update</span>
              <span className="sm:hidden">Daily</span>
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="relative inline-flex items-center justify-center whitespace-nowrap px-6 py-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 bg-transparent border-0 rounded-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent after:transition-all after:duration-200 data-[state=active]:after:bg-blue-600"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Weekly View</span>
              <span className="sm:hidden">Weekly</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily" className="space-y-4">
          <DailyAttendanceUpdate
            teachers={teachers}
            selectedDate={selectedDate}
          />
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <WeeklyAttendanceUpdate
            teachers={teachers}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherAttendance;
