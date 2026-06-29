"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { FormFieldLabel } from "@/components/onboarding/form-field-label"
import { PhotoUpload } from "@/components/onboarding/photo-upload"
import { StepHeader } from "@/components/onboarding/step-header"
import { GENDER_OPTIONS, TEACHER_STEPS } from "../constants"
import type { TeacherFormData } from "../types"

export function PersonalInfoStep() {
  const form = useFormContext<TeacherFormData>()

  return (
    <div className="space-y-6">
      <StepHeader
        stepNumber={1}
        totalSteps={TEACHER_STEPS.length}
        title="Personal"
        description="Basic personal details about the teacher."
      />

      <FormField
        control={form.control}
        name="photo"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <PhotoUpload
                value={field.value}
                onChange={field.onChange}
                title="Profile Photo"
                description="Upload a clear, professional photo for the teacher profile and ID card."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormFieldLabel required>Full Name</FormFieldLabel>
            <FormControl>
              <Input className="h-10" placeholder="Enter full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Date of Birth</FormFieldLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select date of birth"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Gender</FormFieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Mobile Number</FormFieldLabel>
              <FormControl>
                <Input className="h-10" placeholder="9876543210" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Email Address</FormFieldLabel>
              <FormControl>
                <Input
                  type="email"
                  className="h-10"
                  placeholder="teacher@school.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
