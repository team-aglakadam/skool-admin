import { create } from "zustand";
import { Teacher, CreateTeacherData, UpdateTeacherData } from "@/types/teacher";

interface TeachersStore {
  teachers: Teacher[];
  setTeachers: (teachers: Teacher[]) => void;
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: string, teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  getTeacherById: (id: string) => Teacher | undefined;
  activeTeachers: () => Teacher[];
  inactiveTeachers: () => Teacher[];
}

export const useTeachersStore = create<TeachersStore>((set, get) => ({
  teachers: [],
  
  setTeachers: (teachers) => set({ teachers }),
  
  addTeacher: (teacher) => 
    set((state) => ({
      teachers: [...state.teachers, teacher]
    })),
  
  updateTeacher: (id, updatedTeacher) =>
    set((state) => ({
      teachers: state.teachers.map((teacher) =>
        teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher
      ),
    })),
  
  deleteTeacher: (id) =>
    set((state) => ({
      teachers: state.teachers.filter((teacher) => teacher.id !== id),
    })),
  
  getTeacherById: (id) => {
    return get().teachers.find((teacher) => teacher.id === id);
  },
  
  activeTeachers: () => {
    return get().teachers.filter((teacher) => teacher.status === "active");
  },
  
  inactiveTeachers: () => {
    return get().teachers.filter((teacher) => teacher.status === "inactive");
  },
}));
