import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Teacher, CreateTeacherData, UpdateTeacherData } from "@/types/teacher";
import { useTeachersStore } from "@/store/teachersStore";
import { deleteTeacher, getTeachers, updateTeacher } from "@/app/apiHelpers";
import { useUserStore } from "@/store/userStore";

// API functions

const createTeacher = async (data: CreateTeacherData): Promise<Teacher> => {
  const response = await fetch("/api/teachers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create teacher");
  }
  return response.json();
};

// React Query hooks
export const useTeachersQuery = () => {
  const { schoolId } = useUserStore();
  return useQuery<Teacher[], Error>({
    queryKey: ["teachers", schoolId],
    queryFn: () => getTeachers(schoolId),
    enabled: !!schoolId,
  });
};

// Separate effect for syncing with Zustand
export const useSyncTeachersToStore = () => {
  const { data: teachers } = useTeachersQuery();
  const { setTeachers } = useTeachersStore();

  useEffect(() => {
    if (teachers) {
      setTeachers(teachers);
    }
  }, [teachers, setTeachers]);
};

export const useCreateTeacher = () => {
  const { refetch: refetchTeachers } = useTeachersQuery();

  return useMutation<Teacher, Error, CreateTeacherData>({
    mutationFn: createTeacher,
    onSuccess: (newTeacher) => {
      refetchTeachers();
      // // Optimistically update the cache
      // queryClient.setQueryData<Teacher[]>(["teachers"], (old = []) => [
      //   ...old,
      //   newTeacher,
      // ]);
      // // Update Zustand store
      // addTeacher(newTeacher);
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  const { updateTeacher: updateInStore } = useTeachersStore();

  return useMutation<Teacher, Error, { id: string } & UpdateTeacherData>({
    mutationFn: (variables) => updateTeacher(variables.id, variables),
    onSuccess: (updatedTeacher) => {
      // Update the cache
      queryClient.setQueryData<Teacher[]>(["teachers"], (old = []) =>
        old.map((teacher) =>
          teacher.id === updatedTeacher.id ? updatedTeacher : teacher
        )
      );
      // Update Zustand store
      updateInStore(updatedTeacher.id, updatedTeacher);
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  const { deleteTeacher: deleteFromStore } = useTeachersStore();
  const { refetch: refetchTeachers } = useTeachersQuery();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id: string) => deleteTeacher(id),
    // onMutate: async (id: string) => {
    //   // Optimistically update the cache
    //   await queryClient.cancelQueries({ queryKey: ["teachers"] });
    //   const previousTeachers = queryClient.getQueryData<Teacher[]>([
    //     "teachers",
    //   ]);

    //   queryClient.setQueryData<Teacher[]>(["teachers"], (old = []) =>
    //     old.filter((teacher) => teacher.id !== id)
    //   );

    //   return { previousTeachers };
    // },
    onError: (error: Error, id: string, context: any) => {
      // Revert on error
      if (context?.previousTeachers) {
        queryClient.setQueryData(["teachers"], context.previousTeachers);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onSuccess: (_, id) => {
      // Update Zustand store
      deleteFromStore(id);
      refetchTeachers();
    },
  });
};

// Custom hook that combines both Zustand and React Query
export const useTeachers = () => {
  // Sync teachers to Zustand store
  useSyncTeachersToStore();

  // Get data from React Query
  const { data: teachers, isLoading, error } = useTeachersQuery();

  // Get mutations
  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher();
  const deleteMutation = useDeleteTeacher();

  return {
    teachers: teachers || [],
    isLoading,
    error,
    // Export mutations with proper naming
    createTeacher: createMutation.mutate,
    updateTeacher: updateMutation.mutate,
    deleteTeacher: deleteMutation.mutate,
    // Export mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    // Export mutation errors
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    // Export mutation success
    createSuccess: createMutation.isSuccess,
    updateSuccess: updateMutation.isSuccess,
    deleteSuccess: deleteMutation.isSuccess,
  };
};
