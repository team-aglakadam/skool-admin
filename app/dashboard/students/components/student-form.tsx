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
  rollNumber: z.string().optional().or(z.literal('')),
  classId: z.string().min(1, { message: "Class is required" }),
  sectionId: z.string().min(1, { message: "Section is required" }),
  mobile: z.string().min(10, { message: "Please enter a valid mobile number" }).or(z.literal('')),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: GenderEnum.optional(),
  bloodGroup: BloodGroupEnum.optional(),
  parentName: z.string().min(2, { message: "Parent's name is required" }),
  parentMobile: z.string().min(10, { message: "Please enter a valid mobile number" }).or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
});

// We infer the form values type directly when using it

interface StudentFormProps {
  initialData?: Student;
  onSuccess?: () => void;
  onCancel?: () => void;
  disableClassSection?: boolean;
}

export function StudentForm({
  initialData,
  onSuccess,
  onCancel,
  disableClassSection = false,
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
      gender: "",
      bloodGroup: "",
      parentName: "",
      parentMobile: "",
      address: "",
    },
  });

  // Set initial values on component mount
  useEffect(() => {
    if (initialData) {
      console.log("Raw initialData received by form:", initialData);
      console.log("Gender type and value:", typeof initialData.gender, initialData.gender);
      console.log("BloodGroup type and value:", typeof initialData.bloodGroup, initialData.bloodGroup);
      console.log("Address type and value:", typeof initialData.address, initialData.address);
      
      // Convert undefined values to default values for fields that can't be undefined
      const sanitizedData = {
        ...initialData,
        gender: initialData.gender || 'prefer-not-to-say',
        bloodGroup: initialData.bloodGroup || 'O+',
        address: initialData.address || '',
      };
      
      console.log("Sanitized form data:", sanitizedData);
      form.reset(sanitizedData);

      // Set selectedClassId to make section dropdown work correctly
      if (initialData.classId) {
        setSelectedClassId(initialData.classId);
      } 
    }
  }, [initialData, form]);

  const selectedClass = classes.find((cls) => cls.id === selectedClassId);
  const sections = selectedClass?.sections || [];
  
  // Get display names for class and section when disabled
  const classDisplayName = selectedClass?.name || "";
  // In the database, class_id is used for both class and section
  // So for display purposes, we need to use the class name
  // const sectionDisplayName = initialData?.classId === selectedClassId ? selectedClass?.name || "" : 
  //   sections.find(s => s.id === form.getValues().sectionId)?.name || "";
  const sectionDisplayName = sections.find((s) => s.id === selectedClassId)?.name || "";
    
  console.log("Class Display Name:", classDisplayName);
  console.log("Section Display Name:", sectionDisplayName);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Form submitted with values:", values);
      
      // Use default values if gender or bloodGroup are not provided
      const gender = values.gender || 'prefer-not-to-say';
      const bloodGroup = values.bloodGroup || 'O+';
      
      console.log("Using gender:", gender, "and bloodGroup:", bloodGroup);

      // Create studentData with proper values
      const studentData: CreateStudentData = {
        ...values,
        gender: gender as Gender,
        bloodGroup: bloodGroup as BloodGroup,
        address: values.address || "", // Ensure address is not undefined
      };
      console.log("Prepared student data for API:", studentData);

      if (initialData && initialData.id && initialData.id.trim() !== "") {
        console.log("Updating existing student with ID:", initialData.id);
        const result = await updateStudent(initialData.id, studentData);
        console.log("Update student result:", result);
        if (result.success) {
          toast.success("Student updated successfully");
          onSuccess?.();
        } else {
          toast.error(result.error || "Failed to update student");
        }
      } else {
        console.log("Creating new student, calling addStudent...");
        const result = await addStudent(studentData);
        console.log("Add student result:", result);
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
debugger;
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
                <FormControl>
                  {disableClassSection && initialData?.classId ? (
                    <Input value={classDisplayName} disabled readOnly />
                  ) : (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedClassId(value);
                        form.setValue("sectionId", ""); // Reset section when class changes
                      }}
                      value={field.value}
                      disabled={loadingClasses}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
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
                <FormControl>
                  {disableClassSection && initialData?.sectionId ? (
                    <Input value={sectionDisplayName} disabled readOnly />
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedClassId || loadingClasses}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
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
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || "prefer-not-to-say"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender"/>
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
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || "O+"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group"/>
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
            {form.formState.isSubmitting ? "Saving..." : 
              initialData?.id ? "Update Student" : "Save Student"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
