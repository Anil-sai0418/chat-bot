"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useApplicationCommands } from "@/hooks/use-application-commands";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChatPage = pathname?.startsWith("/chat");
    
    // Initialize application commands
    useApplicationCommands();

    if (isChatPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
