'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { StudentForm } from './student-form';

interface StudentDialogProps {
  initialData?: any;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function StudentDialog({ initialData, onSuccess, trigger }: StudentDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Update the student details below.' 
              : 'Fill in the details below to add a new student.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <StudentForm 
            initialData={initialData} 
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
