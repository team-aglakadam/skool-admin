import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, X } from "lucide-react";
import { useState, useEffect } from 'react';
import AddSubjectModal from './add-subject-modal';
import { useSubjects } from '@/contexts/SubjectsContext';
import { ClassSection } from "@/types/database"

interface SubjectsPanelProps {
  classData: { name: string }
  sectionData: ClassSection
  onClose: () => void
}

export function SubjectsPanel({ classData, sectionData, onClose }: SubjectsPanelProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { subjects, loading, fetchSubjectsByClass } = useSubjects();

  useEffect(() => {
    if (sectionData.classId) {
      fetchSubjectsByClass(sectionData.classId);
    }
  }, [sectionData.classId, fetchSubjectsByClass]);

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    fetchSubjectsByClass(sectionData.classId);
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
                  <span className="text-sm">{subject.name}</span>
                  <Badge variant={subject.teacher_id ? 'outline' : 'secondary'}>
                    {subject.teacher_id ? 'Assigned' : 'Unassigned'}
                  </Badge>
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
            <Button size="sm" variant="outline">
              <BookOpen className="h-3 w-3 mr-1" />
              Manage Assignments
            </Button>
          </div>
        </div>
      </CardContent>
      <AddSubjectModal 
        isOpen={isAddModalOpen} 
        onClose={handleModalClose} 
        classId={sectionData.classId} 
         
        classData={classData}
        sectionData={sectionData}
      />
    </Card>
  )
}
