"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, User, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
    const [user, setUser] = useState({
        first_name: "Anil",
        last_name: "Sai",
        email: "hello@anilsai.com",
        profile_picture: ""
    });

    useEffect(() => {
        // Fetch user data from backend
        fetch("http://localhost:8000/api/user", { cache: "no-store" })
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setUser({
                        first_name: data.first_name || "Anil",
                        last_name: data.last_name || "Sai",
                        email: data.email || "hello@anilsai.com",
                        profile_picture: data.profile_picture ? `http://localhost:8000${data.profile_picture}` : ""
                    });
                }
            })
            .catch(err => console.error("Failed to load user in navbar", err));

        // Optional: Listen for custom events if profile updates
        const handleProfileUpdate = () => {
            fetch("http://localhost:8000/api/user", { cache: "no-store", headers: { 'Cache-Control': 'no-cache' } })
                .then(res => res.json())
                .then(data => {
                    if (data && !data.error) {
                        setUser({
                            first_name: data.first_name || "Anil",
                            last_name: data.last_name || "Sai",
                            email: data.email || "hello@anilsai.com",
                            profile_picture: data.profile_picture ? `http://localhost:8000${data.profile_picture}?t=${Date.now()}` : ""
                        });
                    }
                });
        };
        window.addEventListener('profile-updated', handleProfileUpdate);
        return () => window.removeEventListener('profile-updated', handleProfileUpdate);
    }, []);

    const initials = (user.first_name?.[0] || 'A') + (user.last_name?.[0] || 'S');

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <div className="rounded-lg bg-primary/10 p-1.5 text-primary flex items-center justify-center">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <span className="hidden font-bold sm:inline-block">
                            ChatBot AI
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/chat"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Chat
                        </Link>
                    </nav>
                </div>
             <div className="flex flex-1 items-center justify-end space-x-2">
    {/* Change space-x-2 to space-x-4 here */}
    <nav className="flex items-center space-x-4">
        <ModeToggle />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 transition-opacity hover:opacity-80">
                        <AvatarImage src={user.profile_picture || "https://github.com/shadcn.png"} alt="@user" />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.first_name} {user.last_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </nav>
</div>

            </div>
        </header>
    );
}
