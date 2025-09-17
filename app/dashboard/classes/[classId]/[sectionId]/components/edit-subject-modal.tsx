import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Subject, UpdateSubjectData } from "@/contexts/SubjectsContext";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeachers } from "@/contexts/TeachersContext";
import { useEffect } from "react";

interface EditSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
  onSave: (data: UpdateSubjectData) => Promise<void>;
  isLoading: boolean;
}

export function EditSubjectModal({ isOpen, onClose, subject, onSave, isLoading }: EditSubjectModalProps) {
  const { teachers } = useTeachers();
  const { register, handleSubmit, control, reset } = useForm<UpdateSubjectData>();

  useEffect(() => {
    if (subject) {
      reset({
        name: subject.name,
        teacher_id: subject.teacher_id,
      });
    }
  }, [subject, reset]);

  if (!isOpen || !subject) return null;

  const onSubmit = async (data: UpdateSubjectData) => {
    await onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Subject Name</Label>
            <Input id="name" {...register("name")} />
          </div>
          <div>
            <Label htmlFor="teacher_id">Assign Teacher</Label>
            <Controller
              name="teacher_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
