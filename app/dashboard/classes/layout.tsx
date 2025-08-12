'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BookOpen, Users } from 'lucide-react';
import { ClassesProvider } from '@/contexts/ClassesContext';
import { TeachersProvider } from '@/contexts/TeachersContext';
import { StudentsProvider } from '@/contexts/StudentsContext';
import { SubjectsProvider } from '@/contexts/SubjectsContext';
import { SubjectAssignmentsProvider } from '@/contexts/SubjectAssignmentsContext';

type ClassesLayoutProps = {
  children: ReactNode;
};

export default function ClassesLayout({ children }: ClassesLayoutProps) {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: 'All Classes',
      href: '/dashboard/classes',
      icon: BookOpen,
    },
    {
      name: 'Sections',
      href: '/dashboard/classes/sections',
      icon: Users,
    },
  ];

  return (
    <TeachersProvider>
      <SubjectsProvider>
        <StudentsProvider>
          <SubjectAssignmentsProvider>
            <ClassesProvider>
              <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Class Management</h2>
                  </div>
                  <div className="flex space-x-2 overflow-x-auto pb-1">
                    {navItems.map((item) => (
                      <Button
                        key={item.href}
                        asChild
                        variant={pathname === item.href ? 'secondary' : 'ghost'}
                        className={cn(
                          'flex items-center gap-2',
                          pathname === item.href ? 'bg-muted' : 'hover:bg-muted/50'
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
                {children}
              </div>
            </ClassesProvider>
          </SubjectAssignmentsProvider>
        </StudentsProvider>
      </SubjectsProvider>
    </TeachersProvider>
  );
} 