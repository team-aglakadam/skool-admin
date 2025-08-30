"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useStudents } from '@/contexts/StudentsContext';
import { Student, CreateStudentData } from '@/contexts/StudentsContext';
import { useClasses } from "@/contexts/ClassesContext";

// Define enums for type safety
export const GENDER = ['male', 'female', 'other', 'prefer-not-to-say'] as const;
export type Gender = typeof GENDER[number];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = typeof BLOOD_GROUPS[number];

// Create enum types for Zod
const GenderEnum = z.enum(GENDER as unknown as [string, ...string[]]);
const BloodGroupEnum = z.enum(BLOOD_GROUPS as unknown as [string, ...string[]]);

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  rollNumber: z.string().min(1, { message: "Roll number is required" }),
  classId: z.string().min(1, { message: "Class is required" }),
  sectionId: z.string().min(1, { message: "Section is required" }),
  mobile: z.string().min(10, { message: "Please enter a valid mobile number" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: GenderEnum,
  bloodGroup: BloodGroupEnum,
  parentName: z.string().min(2, { message: "Parent's name is required" }),
  parentMobile: z.string().min(10, { message: "Please enter a valid mobile number" }),
  address: z.string().min(1, { message: "Address is required" }),
});

type StudentFormValues = z.infer<typeof formSchema>;

interface StudentFormProps {
  initialData?: Student;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StudentForm({
  initialData,
  onSuccess,
  onCancel,
}: StudentFormProps) {
  // Import the StudentsContext
  const { addStudent, updateStudent } = useStudents();
  const { classes, loading: loadingClasses } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      rollNumber: "",
      classId: "",
      sectionId: "",
      mobile: "",
      dateOfBirth: "",
      gender: undefined,
      bloodGroup: undefined,
      parentName: "",
      parentMobile: "",
      address: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      setSelectedClassId(initialData.classId);
    }
  }, [initialData, form]);

  const selectedClass = classes.find((cls) => cls.id === selectedClassId);
  const sections = selectedClass?.sections || [];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Ensure required fields are present
      if (!values.gender || !values.bloodGroup) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Cast to the correct types
      const studentData: CreateStudentData = {
        ...values,
        gender: values.gender as Gender,
        bloodGroup: values.bloodGroup as BloodGroup,
      };

      if (initialData) {
        const result = await updateStudent(initialData.id, studentData);
        if (result.success) {
          toast.success("Student updated successfully");
          onSuccess?.();
        } else {
          toast.error(result.error || "Failed to update student");
        }
      } else {
        const result = await addStudent(studentData);
        if (result.success) {
          toast.success("Student created successfully");
          onSuccess?.();
        } else {
          toast.error(result.error || "Failed to create student");
        }
      }
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("Failed to save student. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Student name" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="student@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rollNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl>
                  <Input placeholder="Roll number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="classId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedClassId(value);
                    form.setValue("sectionId", ""); // Reset section when class changes
                  }}
                  value={field.value}
                  disabled={loadingClasses}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
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
            name="sectionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedClassId || loadingClasses}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
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
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input placeholder="Mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Name</FormLabel>
                <FormControl>
                  <Input placeholder="Parent's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentMobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Mobile</FormLabel>
                <FormControl>
                  <Input placeholder="Parent's mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDER.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender.charAt(0).toUpperCase() + gender.slice(1).replace('-', ' ')}
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
            name="bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bloodGroup) => (
                      <SelectItem key={bloodGroup} value={bloodGroup}>
                        {bloodGroup}
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
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Full address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Student"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
