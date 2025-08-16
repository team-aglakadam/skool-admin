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
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import DailyAttendanceUpdate from "./DailyAttendanceUpdate";
import WeeklyAttendanceUpdate from "./WeeklyAttendanceUpdate";
import { useTeachers } from "@/hooks/useTeachers";
import { cn } from "@/lib/utils";

const TeacherAttendance = () => {
  const { teachers, isLoading } = useTeachers();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("daily");

  if (isLoading) {
    return <div>Loading teachers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Teacher Attendance
          </h1>
          <p className="text-muted-foreground">
            Manage and track teacher attendance
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-[240px] justify-start text-left font-normal")}
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="daily">Daily Update</TabsTrigger>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
        </TabsList>

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
