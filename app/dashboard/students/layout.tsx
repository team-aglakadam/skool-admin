'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Users, ClipboardCheck } from 'lucide-react';
import { StudentsProvider } from '@/contexts/StudentsContext';
import { ClassesProvider } from '@/contexts/ClassesContext';

type StudentLayoutProps = {
  children: ReactNode;
};

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <ClassesProvider>
      <StudentsProvider>
        <StudentLayoutContent>{children}</StudentLayoutContent>
      </StudentsProvider>
    </ClassesProvider>
  );
}

function StudentLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: 'All Students',
      href: '/dashboard/students',
      icon: Users,
    },
    {
      name: 'Attendance',
      href: '/dashboard/attendance/students',
      icon: ClipboardCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Student Management</h2>
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
  );
}
