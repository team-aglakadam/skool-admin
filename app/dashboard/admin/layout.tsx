'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage students, classes, and their relationships
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="classes">Classes & Sections</TabsTrigger>
          <TabsTrigger value="mappings">Student Mappings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-4">
          {children}
        </TabsContent>
        
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Manage Classes & Sections</CardTitle>
              <CardDescription>
                Create, edit, and organize classes and their sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Classes management will go here */}
              <div className="text-center text-muted-foreground py-8">
                Classes management coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mappings">
          <Card>
            <CardHeader>
              <CardTitle>Student Mappings</CardTitle>
              <CardDescription>
                Assign students to classes and sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Student mappings will go here */}
              <div className="text-center text-muted-foreground py-8">
                Student mappings coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
