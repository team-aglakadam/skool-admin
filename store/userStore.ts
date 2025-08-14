import { create } from "zustand";

interface UserStoreState {
  schoolId: string | null;
  userMetaData: any;
  setUserMetaData: (userMetaData: any) => void;
  setSchoolId: (schoolId: string) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  schoolId: null,
  userMetaData: null,
  setUserMetaData: (userMetaData) => set({ userMetaData }),
  setSchoolId: (schoolId) => set({ schoolId }),
}));
