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
import { useSchool } from "@/hooks/useSchool";
import { useTheme } from "@/hooks/useTheme";

type NavigationItem = {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
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
    { name: "Attendance", href: "/dashboard/attendance", icon: ClipboardCheck },
    { name: "Results", href: "/dashboard/results", icon: BarChart3 },
    { name: "Bus Routes", href: "/dashboard/bus-routes", icon: Bus },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
  teacher: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Classes", href: "/dashboard/classes", icon: GraduationCap },
    { name: "Attendance", href: "/dashboard/attendance", icon: ClipboardCheck },
    { name: "Results", href: "/dashboard/results", icon: BarChart3 },
    { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
  ],
  student: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    {
      name: "My Attendance",
      href: "/dashboard/attendance",
      icon: ClipboardCheck,
    },
    { name: "My Results", href: "/dashboard/results", icon: BarChart3 },
    { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
    { name: "Bus Route", href: "/dashboard/bus-route", icon: Bus },
  ],
  staff: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Attendance", href: "/dashboard/attendance", icon: UserCheck },
    { name: "Students", href: "/dashboard/students", icon: Users },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
  ],
  parent: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Children", href: "/dashboard/children", icon: Users },
    { name: "Attendance", href: "/dashboard/attendance", icon: ClipboardCheck },
    { name: "Results", href: "/dashboard/results", icon: BarChart3 },
    { name: "Bus Tracking", href: "/dashboard/bus-tracking", icon: Bus },
  ],
};

function AppSidebar() {
  const { signOut } = useAuth();
  const { currentSchool } = useSchool();
  const router = useRouter();

  const handleSignOut = () => {
    signOut.mutate();
    router.push("/auth/login");
  };

  // if (!profile) return null;

  const userNavigation = navigation["admin"] || navigation.student;

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
              <Badge variant="secondary" className="text-xs">
                {"admin"}
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
                <span className="text-white text-sm font-medium">{"U"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {"User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {"Email"}
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
