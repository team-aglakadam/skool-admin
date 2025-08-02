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
  createdAt: string;
  updatedAt: string;
};
