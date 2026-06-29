"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormFieldLabel } from "@/components/onboarding/form-field-label"
import { StepHeader } from "@/components/onboarding/step-header"
import { TEACHER_STEPS } from "../constants"
import type { TeacherFormData } from "../types"

export function BankDetailsStep() {
  const form = useFormContext<TeacherFormData>()

  return (
    <div className="space-y-6">
      <StepHeader
        stepNumber={4}
        totalSteps={TEACHER_STEPS.length}
        title="Bank Details"
        description="Salary account information for payroll."
      />

      <p className="text-sm text-muted-foreground">
        Provide accurate bank details for salary disbursement. All information
        is stored securely.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="accountHolderName"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormFieldLabel required>Account Holder Name</FormFieldLabel>
              <FormControl>
                <Input className="h-10" placeholder="As per bank records" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Account Number</FormFieldLabel>
              <FormControl>
                <Input className="h-10" placeholder="Enter account number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Bank Name</FormFieldLabel>
              <FormControl>
                <Input className="h-10" placeholder="e.g. State Bank of India" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ifscCode"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>IFSC Code</FormFieldLabel>
              <FormControl>
                <Input
                  className="h-10 uppercase"
                  placeholder="SBIN0001234"
                  {...field}
                  onChange={(event) =>
                    field.onChange(event.target.value.toUpperCase())
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="branchName"
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required>Branch Name</FormFieldLabel>
              <FormControl>
                <Input className="h-10" placeholder="Branch location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
