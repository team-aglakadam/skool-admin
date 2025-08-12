'use client';

import { useState } from 'react';
import { Plus, Search, Users, MoreVertical, Edit, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClasses } from '@/contexts/ClassesContext';

export default function ClassSectionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { classes, loading, searchClasses } = useClasses();

  const filteredClasses = searchClasses(searchTerm);

  if (loading) {
    return <SectionsLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Class Sections</h2>
          <p className="text-muted-foreground">
            Manage class sections and their details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search classes..."
              className="pl-9 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Class Sections List */}
      <div className="grid gap-6">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <Card key={cls.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">{cls.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cls.sections?.length || 0} sections
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {cls.sections && cls.sections.length > 0 ? (
                  <div className="space-y-2">
                    {cls.sections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {section.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">Section {section.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {section.studentCount || 0} students
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Section
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Section
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-muted-foreground">No sections found for this class.</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Section
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No classes found</h3>
            <p className="text-muted-foreground mt-2">
              {searchTerm
                ? 'No classes match your search. Try a different term.'
                : 'Create your first class to get started.'}
            </p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-64" />
      </div>
      
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-9 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2].map((j) => (
                  <Skeleton key={j} className="h-16 w-full rounded-md" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
