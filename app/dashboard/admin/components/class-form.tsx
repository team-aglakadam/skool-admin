"use client";

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
import { toast } from "sonner";
import { Class, ClassSection } from "@/contexts/ClassesContext";

const classFormSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  sections: z
    .array(z.string().min(1, "Section name is required"))
    .min(1, "At least one section is required"),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

interface ClassFormProps {
  initialData?: Class | null;
  onSubmit: (data: ClassFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ClassForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: ClassFormProps) {
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      sections: initialData?.sections.map((s) => s.name) || [""],
    },
  });

  const sections = form.watch("sections");

  const handleSubmit = async (data: ClassFormValues) => {
    try {
      await onSubmit(data);
      toast.success(initialData ? "Class updated" : "Class created");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const addSection = () => {
    form.setValue("sections", [...sections, ""]);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    form.setValue("sections", newSections);
  };

  const updateSection = (index: number, value: string) => {
    const newSections = [...sections];
    newSections[index] = value;
    form.setValue("sections", newSections);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Class 1, Grade 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <FormLabel>Sections</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSection}
            >
              Add Section
            </Button>
          </div>

          <div className="space-y-2">
            {sections.map((section, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={section}
                  onChange={(e) => updateSection(index, e.target.value)}
                  placeholder={`Section ${String.fromCharCode(65 + index)}`}
                />
                {sections.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSection(index)}
                  >
                    <span className="text-destructive">×</span>
                  </Button>
                )}
              </div>
            ))}
            {form.formState.errors.sections && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.sections.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Class"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
