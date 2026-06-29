"use server"

import type { TeacherFormData } from "./types"

export async function submitTeacherOnboarding(data: TeacherFormData) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  console.log("Teacher onboarding submitted:", {
    fullName: data.fullName,
    employeeId: data.employeeId,
    department: data.department,
  })

  return { success: true, message: "Teacher onboarded successfully" }
}

export async function saveTeacherDraft(data: TeacherFormData) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { success: true, message: "Draft saved" }
}
