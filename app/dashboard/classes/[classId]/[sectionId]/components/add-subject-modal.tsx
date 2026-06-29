import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubjects } from '@/contexts/SubjectsContext';
import { useTeachers } from '@/contexts/TeachersContext';
import { useState } from 'react';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  classData: { name: string };
  sectionData: { name: string };
}

export default function AddSubjectModal({ isOpen, onClose, classId, classData, sectionData }: AddSubjectModalProps) {
  const { addSubject } = useSubjects();
  const { teachers } = useTeachers();
  const [subjectName, setSubjectName] = useState('');
  const [teacherId, setTeacherId] = useState<string | undefined>(undefined);
  const [isBreak, setIsBreak] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!subjectName.trim()) return;

    setIsSaving(true);
    try {
      await addSubject({
        name: subjectName,
        class_id: classId,
        teacher_id: teacherId,
        is_break: isBreak,
      });
      onClose();
      setSubjectName('');
    } catch (error) {
      console.error('Failed to add subject', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Class</Label>
            <Input value={`${classData.name} - ${sectionData.name}`} disabled className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject-name" className="text-right">
              Subject Name
            </Label>
            <Input
              id="subject-name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Mathematics"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacher" className="text-right">
              Teacher
            </Label>
            <Select onValueChange={setTeacherId} value={teacherId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is-break" className="text-right">
              Is Break
            </Label>
            <Select onValueChange={(value) => setIsBreak(value === 'true')} value={String(isBreak)}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Subject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
