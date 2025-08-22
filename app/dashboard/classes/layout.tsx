"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, Users } from "lucide-react";
import { ClassesProvider } from "@/contexts/ClassesContext";
import { TeachersProvider } from "@/contexts/TeachersContext";
import { StudentsProvider } from "@/contexts/StudentsContext";
import { SubjectsProvider } from "@/contexts/SubjectsContext";
import { SubjectAssignmentsProvider } from "@/contexts/SubjectAssignmentsContext";

type ClassesLayoutProps = {
  children: ReactNode;
};

export default function ClassesLayout({ children }: ClassesLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "All Classes",
      href: "/dashboard/classes",
      icon: BookOpen,
    },
  ];

  return (
    <TeachersProvider>
      <SubjectsProvider>
        <StudentsProvider>
          <SubjectAssignmentsProvider>
            <ClassesProvider>{children}</ClassesProvider>
          </SubjectAssignmentsProvider>
        </StudentsProvider>
      </SubjectsProvider>
    </TeachersProvider>
  );
}
