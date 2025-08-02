"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { isAfter, isBefore } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeachers, CreateTeacherData } from "@/contexts/TeachersContext";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { Teacher } from "@/app/types/teacher";

// Enhanced validation schema
const addTeacherSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-z\s]+$/, "Name can only include letters and spaces"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  dateOfJoining: z.date().optional(),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  dateOfBirth: z.date({
    // required_error: "Date of birth is required",
    // invalid_type_error: "Please select a valid date of birth",
  }),
  homeAddress: z.string().optional(),
  educationDetails: z.string().min(1, "Education details are required"),
  employmentType: z.enum(["full-time", "part-time", "contract"]),
});
type AddTeacherFormData = z.infer<typeof addTeacherSchema>;

interface AddTeacherDialogProps {
  children: React.ReactNode;
  mode?: "create" | "edit";
  teacherData?: Teacher;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddTeacherDialog({
  children,
  mode = "create",
  teacherData,
  open,
  onOpenChange,
}: AddTeacherDialogProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : localOpen;
  const setIsOpen = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setLocalOpen(value);
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    addTeacher,
    // addTeacherStatus: { isPending, isError, isSuccess, error, reset },
    updateTeacher,
  } = useTeachers();

  const form = useForm<AddTeacherFormData>({
    resolver: zodResolver(addTeacherSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      educationDetails: "",
      employmentType: "full-time",
      gender: "prefer-not-to-say",
      bloodGroup: "O+",
      homeAddress: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (mode === "edit" && teacherData && open) {
      form.setValue("name", teacherData.name);
      form.setValue("email", teacherData.email);
      form.setValue("mobile", teacherData.mobile);
      form.setValue("gender", teacherData.gender);
      form.setValue("bloodGroup", teacherData.bloodGroup);
      form.setValue("educationDetails", teacherData.educationDetails);
      form.setValue("employmentType", teacherData.employmentType);
      form.setValue("homeAddress", teacherData.homeAddress || "");
      if (teacherData.dateOfBirth) {
        form.setValue("dateOfBirth", new Date(teacherData.dateOfBirth));
      }
      if (teacherData.dateOfJoining) {
        form.setValue("dateOfJoining", new Date(teacherData.dateOfJoining));
      }
    }
  }, [mode, teacherData, open, form]);

  const onSubmit = async (data: AddTeacherFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "edit" && teacherData) {
        // Update existing teacher
        const updateData = {
          ...data,
          dateOfJoining: data.dateOfJoining
            ? data.dateOfJoining.toISOString().split("T")[0]
            : undefined,
          dateOfBirth: data.dateOfBirth.toISOString().split("T")[0],
          subjects: teacherData.subjects || [],
        };
        const result = await updateTeacher(teacherData.id, updateData);

        if (result.success) {
          toast.success("Teacher updated successfully", {
            description: result.message
          });
          setIsOpen(false);
          form.reset();
        } else {
          toast.error("Failed to update teacher", {
            description: result.error || "Unknown error"
          });
        }
      } else {
        // Create new teacher
        const newTeacherData: CreateTeacherData = {
          ...data,
          dateOfJoining: data.dateOfJoining
            ? data.dateOfJoining.toISOString().split("T")[0]
            : undefined,
          dateOfBirth: data.dateOfBirth.toISOString().split("T")[0],
          subjects: [],
        };
        const result = await addTeacher(newTeacherData);

        if (result.success) {
          toast.success("Teacher created 🎉", {
            description: result.data?.message,
          });
          setIsOpen(false);
          form.reset();
        } else {
          toast.error("Oops! Teacher creation failed ", {
            description: `Failed to add teacher: ${
              result.error || "Unknown error"
            }. Please try again!`,
          });
        }
      }
    } catch (error) {
      toast.error("An error occurred, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // For sections bg
  const sectionBg = "rounded-md bg-muted/50 px-4 py-4 border";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <div role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle id="dialog-title">
            {mode === "edit" ? "Edit Teacher" : "Add New Teacher"}
          </DialogTitle>
          <DialogDescription id="dialog-description">
            {mode === "edit"
              ? `Update ${teacherData?.name}'s information. Fields marked with * are required.`
              : "Please fill the details carefully. Fields marked with * are required."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            autoComplete="off"
          >
            {/* Personal Details */}
            <div className={sectionBg}>
              <h3 className="text-base font-semibold mb-6 text-primary">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name: Full width */}
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Full Name <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Priya Sharma"
                            autoComplete="name"
                            aria-required="true"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use alphabets only, e.g., Priya Sharma
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Gender <span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Select gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Blood Group */}
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Blood Group <span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Select blood group">
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DOB */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date of Birth <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select date"
                          startYear={1900}
                          endYear={new Date().getFullYear()}
                          disabled={(date) =>
                            isAfter(date, new Date()) ||
                            isBefore(date, new Date("1900-01-01"))
                          }
                          aria-label="Select date of birth"
                        />
                      </FormControl>
                      <FormDescription>
                        Must be a valid date of birth
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className={sectionBg}>
              <h3 className="text-base font-semibold mb-6 text-primary">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mobile Number <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 9876543210"
                          autoComplete="off"
                          inputMode="numeric"
                          maxLength={10}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        10 digits only, no country code.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. teacher@school.com"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="homeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Apartment, City, Pincode"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Professional Details */}
            <div className={sectionBg}>
              <h3 className="text-base font-semibold mb-6 text-primary">
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Employment Type <span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-time">Full-Time</SelectItem>
                          <SelectItem value="part-time">Part-Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="educationDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Education Details
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. MSc Science, B.Ed from University"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Add all degrees/certifications.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-6 w-[40%]">
                <FormField
                  control={form.control}
                  name="dateOfJoining"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Joining</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select date"
                          startYear={1900}
                          endYear={new Date().getFullYear()}
                          disabled={(date) =>
                            isAfter(date, new Date()) ||
                            isBefore(date, new Date("1900-01-01"))
                          }
                        />
                      </FormControl>

                      <FormDescription>
                        Optional. If not sure, skip this.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mode === "edit" ? "Update Teacher" : "Add Teacher"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
