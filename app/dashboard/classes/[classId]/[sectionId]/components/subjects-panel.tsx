import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, X, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from 'react';
import AddSubjectModal from './add-subject-modal';
import { useSubjects, Subject, UpdateSubjectData } from '@/contexts/SubjectsContext';
import { ClassSection } from "@/types/database";
import { DeleteSubjectConfirmationDialog } from "./delete-subject-confirmation-dialog";
import { EditSubjectModal } from "./edit-subject-modal";
import { toast } from "sonner";

interface SubjectsPanelProps {
  classData: { name: string };
  sectionData: ClassSection;
  onClose: () => void;
}

export function SubjectsPanel({ classData, sectionData, onClose }: SubjectsPanelProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { subjects, loading, fetchSubjectsByClass, deleteSubject, updateSubject } = useSubjects();
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (sectionData.classId) {
      fetchSubjectsByClass(sectionData.classId);
    }
  }, [sectionData.classId, fetchSubjectsByClass]);

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    fetchSubjectsByClass(sectionData.classId);
  };

  const handleDeleteClick = (subject: Subject) => {
    setSubjectToDelete(subject);
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete) return;
    setIsDeleting(true);
    const result = await deleteSubject(subjectToDelete.id);
    if (result.success) {
      toast.success(`Subject "${subjectToDelete.name}" deleted successfully.`);
    } else {
      toast.error(result.error || 'Failed to delete subject.');
    }
    setIsDeleting(false);
    setSubjectToDelete(null);
  };

  const handleEditClick = (subject: Subject) => {
    setSubjectToEdit(subject);
  };

  const handleEditSave = async (data: UpdateSubjectData) => {
    if (!subjectToEdit) return;
    setIsEditing(true);
    const result = await updateSubject(subjectToEdit.id, data);
    if (result.success) {
      toast.success(`Subject "${subjectToEdit.name}" updated successfully.`);
    } else {
      toast.error(result.error || 'Failed to update subject.');
    }
    setIsEditing(false);
    setSubjectToEdit(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Assignments
            </CardTitle>
            <CardDescription>
              Assign subjects and teachers to {classData.name} - Section {sectionData.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <p>Loading subjects...</p>
          ) : subjects.length > 0 ? (
            <div className="space-y-2">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div>
                    <span className="text-sm font-medium">{subject.name}</span>
                    {subject.teacher_name && <span className="text-xs text-muted-foreground ml-2">({subject.teacher_name})</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={subject.teacher_id ? 'outline' : 'secondary'}>
                      {subject.teacher_id ? 'Assigned' : 'Unassigned'}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditClick(subject)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteClick(subject)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No subjects found for this class.</p>
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-3 w-3 mr-1" />
              Add Subject
            </Button>
          </div>
        </div>
      </CardContent>
      <AddSubjectModal 
        isOpen={isAddModalOpen} 
        onClose={handleAddModalClose} 
        classId={sectionData.classId} 
        classData={classData}
        sectionData={sectionData}
      />
      <DeleteSubjectConfirmationDialog
        isOpen={!!subjectToDelete}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        subject={subjectToDelete}
        isLoading={isDeleting}
      />
      <EditSubjectModal
        isOpen={!!subjectToEdit}
        onClose={() => setSubjectToEdit(null)}
        onSave={handleEditSave}
        subject={subjectToEdit}
        isLoading={isEditing}
      />
    </Card>
  )
}
