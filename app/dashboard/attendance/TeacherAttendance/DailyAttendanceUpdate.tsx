'use client'

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Plane, Heart, Calendar as CalendarIcon, Save } from 'lucide-react';
import { format } from 'date-fns';
import { GenericTable } from '@/app/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { Teacher } from '@/app/types/teacher';

type AttendanceStatus = 'present' | 'absent' | 'holiday' | 'sick' | 'personal';

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

const DailyAttendanceUpdate: React.FC<DailyAttendanceUpdateProps> = ({ teachers, selectedDate }) => {
  const [attendanceData, setAttendanceData] = useState<Record<string, TeacherAttendanceData>>({});

  const statusOptions = [
    { value: 'present', label: 'Present', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'absent', label: 'Absent', icon: XCircle, color: 'bg-red-100 text-red-800' },
    { value: 'holiday', label: 'Holiday', icon: Plane, color: 'bg-blue-100 text-blue-800' },
    { value: 'sick', label: 'Sick Leave', icon: Heart, color: 'bg-orange-100 text-orange-800' },
    { value: 'personal', label: 'Personal Leave', icon: CalendarIcon, color: 'bg-purple-100 text-purple-800' },
  ];

  const handleStatusChange = (teacherId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        teacherId,
        status,
      }
    }));
  };

  const handleNotesChange = useCallback((teacherId: string, notes: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        teacherId,
        notes,
      }
    }));
  }, []);

  const handleSaveAll = () => {
    // TODO: Implement save functionality
    console.log('Saving daily attendance data:', attendanceData);
  };

  const handleBulkAction = (action: 'present' | 'absent' | 'holiday' | 'clear') => {
    const newData: Record<string, TeacherAttendanceData> = {};
    
    teachers.forEach(teacher => {
      if (action === 'clear') {
        delete newData[teacher.id];
      } else {
        newData[teacher.id] = {
          teacherId: teacher.id,
          status: action,
        };
      }
    });
    
    setAttendanceData(action === 'clear' ? {} : newData);
  };

  // Prepare data for GenericTable
  const tableData: TeacherWithAttendance[] = React.useMemo(() => 
    teachers.map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      subjects: teacher.subjects,
      status: attendanceData[teacher.id]?.status || 'not-marked',
      notes: attendanceData[teacher.id]?.notes || '',
    })), [teachers, attendanceData]
  );

  // Create a stable NotesInput component
  const NotesInput = React.memo(({ teacherId, initialValue }: { teacherId: string; initialValue: string }) => {
    const [value, setValue] = useState(initialValue);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      handleNotesChange(teacherId, newValue);
    };
    
    return (
      <input
        type="text"
        placeholder="Add notes..."
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  });

  // Define columns for GenericTable
  const columns: ColumnDef<TeacherWithAttendance>[] = [
    {
      accessorKey: 'name',
      header: 'Teacher',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
            {row.original.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.subjects.join(', ')}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Select
          value={row.original.status}
          onValueChange={(value: AttendanceStatus) => handleStatusChange(row.original.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  {React.createElement(option.icon, { className: 'h-4 w-4 mr-2' })}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ row }) => (
        <NotesInput 
          teacherId={row.original.id} 
          initialValue={row.original.notes || ''} 
        />
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daily Attendance Update</CardTitle>
            <CardDescription>
              Update attendance for {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleBulkAction('present')}>
              Mark All Present
            </Button>
            <Button variant="outline" onClick={() => handleBulkAction('absent')}>
              Mark All Absent
            </Button>
            <Button variant="outline" onClick={() => handleBulkAction('holiday')}>
              Mark All Holiday
            </Button>
            <Button variant="outline" onClick={() => handleBulkAction('clear')}>
              Clear All
            </Button>
            <Button onClick={handleSaveAll}>
              <Save className="mr-2 h-4 w-4" />
              Save All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <GenericTable
          data={tableData}
          columns={columns}
          pageSize={10}
        />
      </CardContent>
    </Card>
  );
};

export default DailyAttendanceUpdate; 