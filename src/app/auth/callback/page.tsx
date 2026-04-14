"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getProfile } from "@/api/profiles";
import { useUserStore } from "@/stores/user.store";
import { Loader2, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  
  // Ref to ensure we only process the login success once in Strict Mode
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;
    
    const handleCallback = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          isProcessed.current = true;
          toast.success("Login successfuly", {
            description: `welcome ${session.user.email?.split("@")[0] || "user"} `,
          });

          const profile = await getProfile(supabase, session.user.id);
          setUser(profile);
          router.push(`/${profile?.role || "customer"}/profile`);
        } else {
          // Listen to changes in case session isn't available instantly
          const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
              if (event === "SIGNED_IN" && currentSession?.user && !isProcessed.current) {
                isProcessed.current = true;
                toast.success("Login successfuly", {
                  description: `welcome ${currentSession.user.email?.split("@")[0] || "user"} `,
                });
                const profile = await getProfile(supabase, currentSession.user.id);
                setUser(profile);
                router.push(`/${profile?.role || "customer"}/profile`);
              }
            }
          );
          
          return () => {
            listener.subscription.unsubscribe();
          };
        }
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to authenticate session");
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    };

    handleCallback();
  }, [router, setUser, supabase]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface text-on-surface antialiased">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
          <UtensilsCrossed className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            {!error && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            <p className="text-on-surface font-semibold text-lg tracking-wide">
              {error ? "Authentication Failed" : "Completing your login..."}
            </p>
          </div>
          {error && (
            <p className="text-error text-sm max-w-sm text-center">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
