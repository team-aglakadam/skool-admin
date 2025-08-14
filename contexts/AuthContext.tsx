"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Session, User } from "@supabase/supabase-js";
import { useUserStore } from "@/store/userStore";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching session:", error.message);
          setIsLoading(false);
          return;
        }

        if (session) {
          setSession(session);
          setUser(session.user);
          useUserStore.setState({
            schoolId: session.user.user_metadata?.school_id || null,
            userMetaData: session.user.user_metadata,
          });
        } else {
          // No active session
          const currentPath = window.location.pathname;
          if (currentPath.startsWith("/dashboard")) {
            router.push("/auth/login");
          }
        }
      } catch (error) {
        console.error("Unexpected error during session fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        useUserStore.setState({
          schoolId: session.user.user_metadata?.school_id || null,
          userMetaData: session.user.user_metadata,
        });
      } else {
        setSession(null);
        setUser(null);
        // Only redirect if on a protected route
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/dashboard")) {
          router.push("/auth/login");
        }
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
