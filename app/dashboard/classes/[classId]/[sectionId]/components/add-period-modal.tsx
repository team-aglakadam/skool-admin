'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface AddPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: { id: string; name: string }[];
  classId: string;
  onPeriodAdded: () => void;
}

export function AddPeriodModal({ isOpen, onClose, subjects, classId, onPeriodAdded }: AddPeriodModalProps) {
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [periodType, setPeriodType] = useState<'subject' | 'custom'>('subject');
  const [subjectId, setSubjectId] = useState('');
  const [customName, setCustomName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const payload = {
      classId,
      day,
      startTime,
      endTime,
      subjectId: periodType === 'subject' ? subjectId : null,
      customName: periodType === 'custom' ? customName : null,
    };

    try {
      const response = await fetch('/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add period');
      }

      onPeriodAdded();
      onClose();
    } catch (error) {
      console.error('Error saving period:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Period</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="day" className="text-right">
              Day
            </Label>
            <Select onValueChange={setDay} value={day}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {days.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              Start Time
            </Label>
            <Input id="startTime" type="time" className="col-span-3" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              End Time
            </Label>
            <Input id="endTime" type="time" className="col-span-3" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>

          <div className="flex justify-center pt-4 space-x-4">
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="r1" 
                value="subject" 
                title="Select Subject"
                checked={periodType === 'subject'}
                onChange={() => setPeriodType('subject')}
              />
              <Label htmlFor="r1">Select Subject</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="r2" 
                value="custom" 
                title="Custom Name"
                checked={periodType === 'custom'}
                onChange={() => setPeriodType('custom')}
              />
              <Label htmlFor="r2">Custom Name</Label>
            </div>
          </div>

          {periodType === 'subject' ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Select onValueChange={setSubjectId} value={subjectId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customName" className="text-right">
                Custom Name
              </Label>
              <Input id="customName" placeholder="e.g., Lunch Break" className="col-span-3" value={customName} onChange={(e) => setCustomName(e.target.value)} />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
