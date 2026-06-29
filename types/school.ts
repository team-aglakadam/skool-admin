export type SchoolFeatureKey =
  | "attendance"
  | "exams"
  | "transport"
  | "fees"
  | "reports"
  | "timetable";

export type SchoolFeatures = Record<SchoolFeatureKey, boolean>;

export type School = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  principal_name: string | null;
  enabled_features: SchoolFeatures;
  created_at: string;
  updated_at: string | null;
};
