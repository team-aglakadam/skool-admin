export type Teacher = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dateOfJoining?: string;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  dateOfBirth: string;
  homeAddress?: string;
  educationDetails: string;
  status: "active" | "inactive";
  subjects: string[];
  employmentType: "full-time" | "part-time" | "contract";
  designation?: string; // Added from database schema
  salary?: number; // Added from database schema
  is_class_teacher?: boolean; // Added from database schema
  class_assigned?: string; // Added from database schema
  createdAt: string;
  updatedAt: string;
  user_id?: string; // Reference to users table
  school_id?: string; // Reference to schools table
};
