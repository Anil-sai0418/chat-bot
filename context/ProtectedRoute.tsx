"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { token, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!token && (pathname?.startsWith("/chat") || pathname?.startsWith("/profile") || pathname?.startsWith("/settings"))) {
                router.push("/login");
            }
        }
    }, [token, loading, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (!token && (pathname?.startsWith("/chat") || pathname?.startsWith("/profile") || pathname?.startsWith("/settings"))) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}
