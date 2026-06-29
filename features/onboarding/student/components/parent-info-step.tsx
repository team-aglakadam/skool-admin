"use client"

import { Info } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { FormFieldLabel } from "@/components/onboarding/form-field-label"
import { StepHeader } from "@/components/onboarding/step-header"
import { RELATIONSHIP_OPTIONS, STUDENT_STEPS } from "../constants"
import type { StudentFormData } from "../types"

export function ParentInfoStep() {
  const form = useFormContext<StudentFormData>()

  return (
    <div className="space-y-6">
      <StepHeader
        stepNumber={2}
        totalSteps={STUDENT_STEPS.length}
        title="Parent"
        description="Parent or guardian contact information."
      />

      <Alert className="border-blue-100 bg-blue-50 text-blue-900">
        <Info className="size-4 text-blue-600" />
        <AlertDescription>
          This contact will receive all important school communications —
          attendance alerts, exam schedules, fee reminders, and report cards
          via SMS and email.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="parentName"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Parent / Guardian Name</FormFieldLabel>
              <FormControl>
                <Input className="h-10" placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Relationship</FormFieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {RELATIONSHIP_OPTIONS.map((option) => (
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
          name="parentMobile"
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
          name="alternateContact"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel optional>Alternate Contact</FormFieldLabel>
              <FormControl>
                <Input
                  className="h-10"
                  placeholder="+91 98765 43210"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="parentEmail"
        render={({ field }) => (
          <FormItem>
            <FormFieldLabel optional>Email Address</FormFieldLabel>
            <FormControl>
              <Input
                type="email"
                className="h-10"
                placeholder="parent@example.com"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
