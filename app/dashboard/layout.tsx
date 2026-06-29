"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Users,
  ClipboardCheck,
  BarChart3,
  Bus,
  Settings,
  LogOut,
  Home,
  UserCheck,
  GraduationCap,
  Calendar,
  FileText,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";
import { useSchool } from "@/hooks/useSchool";
import { useTheme } from "@/hooks/useTheme";
import type { SchoolFeatureKey } from "@/types/school";

type NavigationItem = {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  feature?: SchoolFeatureKey;
  submenu?: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    feature?: SchoolFeatureKey;
  }[];
};

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

const navigation: Record<string, NavigationItem[]> = {
  admin: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Schools", href: "/dashboard/schools", icon: BookOpen },
    { name: "Users", href: "/dashboard/users", icon: Users },
    {
      name: "Teachers",
      icon: GraduationCap,
      submenu: [
        { name: "Details", href: "/dashboard/teachers", icon: Users },
        { name: "Manage", href: "/dashboard/teachers/manage", icon: Settings },
      ],
    },
    {
      name: "Students",
      icon: UserCheck,
      submenu: [
        { name: "All Students", href: "/dashboard/students", icon: Users },
        {
          name: "Attendance",
          href: "/dashboard/attendance/students",
          icon: ClipboardCheck,
          feature: "attendance",
        },
      ],
    },
    {
      name: "Classes",
      icon: GraduationCap,
      submenu: [
        { name: "All Classes", href: "/dashboard/classes", icon: BookOpen },
        { name: "Sections", href: "/dashboard/classes/sections", icon: Users },
      ],
    },
    { name: "Attendance", href: "/dashboard/attendance", icon: ClipboardCheck, feature: "attendance" },
    { name: "Results", href: "/dashboard/results", icon: BarChart3, feature: "exams" },
    { name: "Bus Routes", href: "/dashboard/bus-routes", icon: Bus, feature: "transport" },
    { name: "Reports", href: "/dashboard/reports", icon: FileText, feature: "reports" },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
  teacher: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Classes", href: "/dashboard/classes", icon: GraduationCap },
    { name: "Attendance", href: "/dashboard/attendance", icon: ClipboardCheck, feature: "attendance" },
    { name: "Results", href: "/dashboard/results", icon: BarChart3, feature: "exams" },
    { name: "Schedule", href: "/dashboard/schedule", icon: Calendar, feature: "timetable" },
    { name: "Reports", href: "/dashboard/reports", icon: FileText, feature: "reports" },
  ],
  student: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    {
      name: "My Attendance",
      href: "/dashboard/attendance",
      icon: ClipboardCheck,
      feature: "attendance",
    },
    { name: "My Results", href: "/dashboard/results", icon: BarChart3, feature: "exams" },
    { name: "Schedule", href: "/dashboard/schedule", icon: Calendar, feature: "timetable" },
    { name: "Bus Route", href: "/dashboard/bus-route", icon: Bus, feature: "transport" },
  ],
  staff: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Attendance", href: "/dashboard/attendance", icon: UserCheck, feature: "attendance" },
    { name: "Students", href: "/dashboard/students", icon: Users },
    { name: "Reports", href: "/dashboard/reports", icon: FileText, feature: "reports" },
  ],
  parent: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Children", href: "/dashboard/children", icon: Users },
    { name: "Attendance", href: "/dashboard/attendance", icon: ClipboardCheck, feature: "attendance" },
    { name: "Results", href: "/dashboard/results", icon: BarChart3, feature: "exams" },
    { name: "Bus Tracking", href: "/dashboard/bus-tracking", icon: Bus, feature: "transport" },
  ],
};

function AppSidebar() {
  const { signOut } = useAuth();
  const { user } = useAuthContext();
  const { currentSchool, isFeatureEnabled } = useSchool();
  const router = useRouter();

  const handleSignOut = () => {
    signOut.mutate();
    router.push("/auth/login");
  };

  const userRole = (user?.user_metadata?.role as string) || "admin";
  const roleNav = navigation[userRole] || navigation.student;
  const userNavigation = roleNav
    .filter((item) => !item.feature || isFeatureEnabled(item.feature))
    .map((item) => {
      if (item.submenu) {
        return {
          ...item,
          submenu: item.submenu.filter(
            (sub) => !sub.feature || isFeatureEnabled(sub.feature)
          ),
        };
      }
      return item;
    })
    .filter((item) => !item.submenu || item.submenu.length > 0);

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            SchoolHub
          </span>
        </div>

        {/* School info */}
        {currentSchool && (
          <div className="mt-4 px-2">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {currentSchool.name}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs capitalize">
                {userRole}
              </Badge>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  {item.submenu ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuItem key={subItem.name}>
                              <SidebarMenuButton asChild>
                                <Link href={subItem.href}>
                                  <subItem.icon className="h-4 w-4" />
                                  <span>{subItem.name}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link href={item.href!}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center space-x-3 p-2">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.user_metadata?.full_name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user, profile, loading: authLoading } = useAuth();
  const { currentSchool, hasSchools, loading: schoolLoading } = useSchool();
  const router = useRouter();

  // useEffect(() => {
  //   if (!authLoading && !user) {
  //     router.push("/auth/login");
  //   }
  // }, [user, authLoading, router]);

  // if (authLoading || schoolLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
  //       <div className="text-center">
  //         <BookOpen className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
  //         <p className="text-gray-600 dark:text-gray-400">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!user || !profile) {
  //   return null;
  // }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header with sidebar trigger for mobile */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-sidebar-border" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {currentSchool?.name || "Dashboard"}
            </h1>
          </div>

          {/* Theme toggle button */}
          <div className="ml-auto px-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
