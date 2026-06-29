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
import { GENDER_OPTIONS, STUDENT_STEPS } from "../constants"
import type { StudentFormData } from "../types"

export function PersonalInfoStep() {
  const form = useFormContext<StudentFormData>()

  return (
    <div className="space-y-6">
      <StepHeader
        stepNumber={1}
        totalSteps={STUDENT_STEPS.length}
        title="Personal"
        description="Basic personal details about the student."
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
            <FormFieldLabel htmlFor="fullName" required>
              Full Name
            </FormFieldLabel>
            <FormControl>
              <Input
                id="fullName"
                placeholder="Enter full name"
                className="h-10"
                {...field}
              />
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
                <Input
                  placeholder="9876543210"
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Used for emergency contact and school notifications.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel optional>Email Address</FormFieldLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="student@example.com"
                  className="h-10"
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
