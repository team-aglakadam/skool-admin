"use client";

import { signInUser, signOutUser } from "@/app/apiHelpers";
import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [schoolId, setSchoolId] = useState(null);
  const queryClient = useQueryClient();
  const supabase = createClient();
  const router = useRouter();

  const fetchUserSessionDetails = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    console.log("User:", user?.id, user?.user_metadata); // Debug
    console.log("User Error:", userError); // Debug

    // if (userError || !user) {
    //   console.error("No user found:", userError?.message);
    //   router.push("/login");
    //   return;
    // }
  };

  // useEffect(() => {
  //   fetchUserSessionDetails();
  // }, []);

  const signIn = useMutation({
    mutationFn: signInUser,
  });

  const signOut = useMutation({
    mutationFn: signOutUser,
  });

  return {
    signIn,
    signOut,
    fetchUserSessionDetails,
  };
}
