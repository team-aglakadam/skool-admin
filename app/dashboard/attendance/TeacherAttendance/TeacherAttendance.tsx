'use client'

import { useTeachers } from '@/contexts/TeachersContext';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Upload } from 'lucide-react';
import { format } from 'date-fns';
import DailyAttendanceUpdate from './DailyAttendanceUpdate';
import WeeklyAttendanceUpdate from './WeeklyAttendanceUpdate';

const TeacherAttendance = () => {
    const { teachers, loading } = useTeachers();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState('daily');

    if (loading) {
        return <div>Loading teachers...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teacher Attendance</h1>
                    <p className="text-muted-foreground">
                        Manage and track teacher attendance
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(selectedDate, 'MMM dd, yyyy')}
                    </Button>
                    <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Bulk Upload
                    </Button>
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
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TeacherAttendance;