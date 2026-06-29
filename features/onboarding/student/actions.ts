"use server"

import type { StudentFormData } from "./types"

export async function submitStudentOnboarding(data: StudentFormData) {
  // Placeholder for API integration
  await new Promise((resolve) => setTimeout(resolve, 800))

  console.log("Student onboarding submitted:", {
    fullName: data.fullName,
    admissionNumber: data.admissionNumber,
    class: data.class,
  })

  return { success: true, message: "Student enrolled successfully" }
}

export async function saveStudentDraft(data: StudentFormData) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { success: true, message: "Draft saved" }
}
