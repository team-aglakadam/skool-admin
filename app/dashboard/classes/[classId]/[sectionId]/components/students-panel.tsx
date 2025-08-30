import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, User, X } from "lucide-react"
import { useState } from "react"
import { StudentForm } from "@/app/dashboard/students/components/student-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { ClassSection } from "@/contexts/ClassesContext"
import { Student } from "@/contexts/StudentsContext"

interface StudentsPanelProps {
  classData: { name: string }
  sectionData: ClassSection
  onClose: () => void
}

export function StudentsPanel({ classData, sectionData, onClose }: StudentsPanelProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    toast.success("Student added successfully");
    // You might want to refresh the student count here
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Students
            </CardTitle>
            <CardDescription>
              Add, remove, and manage students in {classData.name} - Section {sectionData.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Students</span>
            <Badge variant="secondary">{sectionData.studentCount} students</Badge>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new student to {classData.name} - Section {sectionData.name}. Class and section are pre-selected.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <StudentForm
                    disableClassSection={true}
                    initialData={{
                      // Using explicit type for Student interface requirements
                      // Provide only the class and section ID, other fields will be filled by the user
                      id: "",
                      name: "",
                      email: "",
                      mobile: "",
                      dateOfBirth: "",
                      gender: "prefer-not-to-say", 
                      bloodGroup: "O+",
                      address: "",
                      parentName: "",
                      parentMobile: "",
                      // Since class and section are in the same record in the database, use the same ID for both
                      classId: sectionData.classId,
                      sectionId: sectionData.classId,
                      status: "active",
                      createdAt: "",
                      updatedAt: ""
                    } as Student}
                    onSuccess={handleAddSuccess}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Button size="sm" variant="outline">
              <Users className="h-3 w-3 mr-1" />
              View All Students
            </Button>
            <Button size="sm" variant="outline">
              <User className="h-3 w-3 mr-1" />
              Import Students
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Manage student enrollment, attendance, and academic records for this section.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
