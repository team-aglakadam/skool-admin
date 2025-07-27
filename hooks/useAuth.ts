"use client";

import { signInUser, signOutUser } from "@/app/apiHelpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();

  const signIn = useMutation({
    mutationFn: signInUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const signOut = useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      queryClient.removeQueries();
    },
  });

  return {
    signIn,
    signOut,
  };
}
