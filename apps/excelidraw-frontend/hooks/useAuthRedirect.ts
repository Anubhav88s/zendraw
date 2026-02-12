"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Hook that redirects authenticated users to the dashboard.
 * Returns `true` while checking auth state (show nothing during check),
 * and `false` once confirmed unauthenticated (safe to render page).
 */
export function useAuthRedirect() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    } else {
      setIsChecking(false);
    }
  }, [token, router]);

  return isChecking;
}
