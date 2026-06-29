"use client"

import * as React from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormFieldLabel } from "@/components/onboarding/form-field-label"
import { StepHeader } from "@/components/onboarding/step-header"
import { STUDENT_STEPS } from "../constants"
import type { StudentFormData } from "../types"

function AddressFields({
  prefix,
  disabled = false,
}: {
  prefix: "current" | "permanent"
  disabled?: boolean
}) {
  const form = useFormContext<StudentFormData>()
  const fieldMap = {
    street: `${prefix}Street` as const,
    city: `${prefix}City` as const,
    state: `${prefix}State` as const,
    postalCode: `${prefix}PostalCode` as const,
  }

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={fieldMap.street}
        render={({ field }) => (
          <FormItem>
            <FormFieldLabel required={!disabled && prefix === "current"}>
              Street Address
            </FormFieldLabel>
            <FormControl>
              <Input
                className="h-10"
                disabled={disabled}
                placeholder="Enter street address"
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
          name={fieldMap.city}
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required={!disabled && prefix === "current"}>
                City
              </FormFieldLabel>
              <FormControl>
                <Input
                  className="h-10"
                  disabled={disabled}
                  placeholder="City"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={fieldMap.state}
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required={!disabled && prefix === "current"}>
                State
              </FormFieldLabel>
              <FormControl>
                <Input
                  className="h-10"
                  disabled={disabled}
                  placeholder="State"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:w-1/2">
        <FormField
          control={form.control}
          name={fieldMap.postalCode}
          render={({ field }) => (
            <FormItem>
              <FormFieldLabel required={!disabled && prefix === "current"}>
                Postal Code
              </FormFieldLabel>
              <FormControl>
                <Input
                  className="h-10"
                  disabled={disabled}
                  placeholder="500001"
                  maxLength={6}
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

export function AddressStep() {
  const form = useFormContext<StudentFormData>()
  const sameAsCurrent = useWatch({ control: form.control, name: "sameAsCurrent" })

  const currentStreet = useWatch({ control: form.control, name: "currentStreet" })
  const currentCity = useWatch({ control: form.control, name: "currentCity" })
  const currentState = useWatch({ control: form.control, name: "currentState" })
  const currentPostalCode = useWatch({
    control: form.control,
    name: "currentPostalCode",
  })

  React.useEffect(() => {
    if (!sameAsCurrent) return

    form.setValue("permanentStreet", currentStreet)
    form.setValue("permanentCity", currentCity)
    form.setValue("permanentState", currentState)
    form.setValue("permanentPostalCode", currentPostalCode)
  }, [
    sameAsCurrent,
    currentStreet,
    currentCity,
    currentState,
    currentPostalCode,
    form,
  ])

  return (
    <div className="space-y-8">
      <StepHeader
        stepNumber={4}
        totalSteps={STUDENT_STEPS.length}
        title="Address"
        description="Current and permanent address details."
      />

      <div className="space-y-4">
        <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Current Address
        </p>
        <AddressFields prefix="current" />
      </div>

      <FormField
        control={form.control}
        name="sameAsCurrent"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-blue-600 data-[state=checked]:bg-blue-600"
                />
              </FormControl>
              <Label className="font-normal text-blue-900">
                Permanent address is same as current address
              </Label>
            </div>
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Permanent Address
        </p>
        <AddressFields prefix="permanent" disabled={sameAsCurrent} />
      </div>
    </div>
  )
}
