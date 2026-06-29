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
import { StepHeader } from "@/components/onboarding/step-header"
import {
  CLASS_OPTIONS,
  SECTION_OPTIONS,
  STUDENT_STEPS,
} from "../constants"
import type { StudentFormData } from "../types"

export function AcademicInfoStep() {
  const form = useFormContext<StudentFormData>()

  return (
    <div className="space-y-6">
      <StepHeader
        stepNumber={3}
        totalSteps={STUDENT_STEPS.length}
        title="Academic"
        description="Class assignment and academic background."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="admissionNumber"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Admission Number</FormFieldLabel>
              <FormControl>
                <Input className="h-10" placeholder="ADM-123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="class"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Class</FormFieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CLASS_OPTIONS.map((option) => (
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

        <FormField
          control={form.control}
          name="section"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Section</FormFieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SECTION_OPTIONS.map((option) => (
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

        <FormField
          control={form.control}
          name="rollNumber"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Roll Number</FormFieldLabel>
              <FormControl>
                <Input className="h-10" placeholder="23" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="admissionDate"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel optional>Admission Date</FormFieldLabel>
              <FormControl>
                <DatePicker
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  placeholder="Select admission date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="previousSchool"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel optional>Previous School</FormFieldLabel>
              <FormControl>
                <Input
                  className="h-10"
                  placeholder="e.g. Sunrise Public School"
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
