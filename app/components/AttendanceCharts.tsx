"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Users, UserCheck, UserX, Clock } from "lucide-react";

interface AttendanceData {
  present: number;
  absent: number;
  notMarked: number;
  total: number;
}

interface DailyAttendanceChartsProps {
  attendanceData: AttendanceData;
  date: string;
}

interface WeeklyAttendanceChartsProps {
  weeklyData: Array<{
    date: string;
    present: number;
    absent: number;
    notMarked: number;
  }>;
  weekRange: string;
}

const chartConfig = {
  present: {
    label: "Present",
    color: "hsl(var(--chart-1))",
  },
  absent: {
    label: "Absent", 
    color: "hsl(var(--chart-2))",
  },
  notMarked: {
    label: "Not Marked",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

// Daily Attendance Charts Component
export const DailyAttendanceCharts: React.FC<DailyAttendanceChartsProps> = ({
  attendanceData,
  date,
}) => {
  const { present, absent, notMarked, total } = attendanceData;
  const attendancePercentage = total > 0 ? Math.round((present / total) * 100) : 0;

  const pieData = [
    { name: "Present", value: present, color: "#22c55e" },
    { name: "Absent", value: absent, color: "#ef4444" },
    { name: "Not Marked", value: notMarked, color: "#94a3b8" },
  ].filter(item => item.value > 0);

  const summaryCards = [
    {
      title: "Total Teachers",
      value: total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Present",
      value: present,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Absent",
      value: absent,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Not Marked",
      value: notMarked,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Attendance Overview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {attendancePercentage}% Present
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress/Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Daily Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Present Rate</span>
                <span className="text-sm font-bold text-green-600">{attendancePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${attendancePercentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Teachers Present</span>
                <span className="text-sm font-semibold">{present} / {total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Teachers Absent</span>
                <span className="text-sm font-semibold">{absent} / {total}</span>
              </div>
              {notMarked > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Not Marked</span>
                  <span className="text-sm font-semibold">{notMarked} / {total}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="text-center">
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-700">{date}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Weekly Attendance Charts Component
export const WeeklyAttendanceCharts: React.FC<WeeklyAttendanceChartsProps> = ({
  weeklyData,
  weekRange,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter data to only include current/past days for meaningful metrics
  const relevantDays = weeklyData.filter(day => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate <= today;
  });

  const totalPresent = relevantDays.reduce((sum, day) => sum + day.present, 0);
  const totalAbsent = relevantDays.reduce((sum, day) => sum + day.absent, 0);
  const totalTeachers = weeklyData.length > 0 ? weeklyData[0].present + weeklyData[0].absent + weeklyData[0].notMarked : 0;
  
  // Calculate better metrics
  const weeklyAverage = relevantDays.length > 0 ? Math.round((totalPresent / (relevantDays.length * totalTeachers)) * 100) : 0;
  
  // Find best and worst attendance days
  const dayPercentages = relevantDays.map(day => ({
    date: day.date,
    percentage: totalTeachers > 0 ? Math.round((day.present / totalTeachers) * 100) : 0,
    present: day.present,
  }));
  
  const bestDay = dayPercentages.reduce((best, current) => 
    current.percentage > best.percentage ? current : best, 
    { percentage: 0, date: '', present: 0 }
  );
  
  const worstDay = dayPercentages.reduce((worst, current) => 
    current.percentage < worst.percentage ? current : worst, 
    { percentage: 100, date: '', present: 0 }
  );

  // Consistency score (lower standard deviation = more consistent)
  const avgPercentage = dayPercentages.reduce((sum, day) => sum + day.percentage, 0) / dayPercentages.length;
  const variance = dayPercentages.reduce((sum, day) => sum + Math.pow(day.percentage - avgPercentage, 2), 0) / dayPercentages.length;
  const consistencyScore = Math.max(0, Math.round(100 - Math.sqrt(variance)));

  // Prepare chart data - exclude 'Not Marked' for future dates
  const chartData = weeklyData.map(day => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    const isFutureDate = dayDate > today;
    
    return {
      date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      present: day.present,
      absent: day.absent,
      notMarked: isFutureDate ? 0 : day.notMarked, // Exclude 'Not Marked' for future dates
    };
  });

  return (
    <div className="space-y-6">
      {/* Weekly Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Weekly Average</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyAverage}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-50">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Day</p>
              <p className="text-lg font-bold text-gray-900">{bestDay.percentage}%</p>
              <p className="text-xs text-gray-500">{bestDay.date ? new Date(bestDay.date).toLocaleDateString('en-US', { weekday: 'short' }) : 'N/A'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-orange-50">
              <UserX className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Worst Day</p>
              <p className="text-lg font-bold text-gray-900">{worstDay.percentage}%</p>
              <p className="text-xs text-gray-500">{worstDay.date ? new Date(worstDay.date).toLocaleDateString('en-US', { weekday: 'short' }) : 'N/A'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Consistency</p>
              <p className="text-2xl font-bold text-gray-900">{consistencyScore}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Weekly Attendance Trend
          </CardTitle>
          <p className="text-sm text-gray-600">{weekRange}</p>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="h-[300px]"
          >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="present" stackId="a" fill="#22c55e" name="Present" />
              <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
              <Bar dataKey="notMarked" stackId="a" fill="#94a3b8" name="Not Marked" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
