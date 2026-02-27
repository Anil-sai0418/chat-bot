"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bot, ArrowLeft, Settings as SettingsIcon, Bell, Shield, Moon, Monitor, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SettingsPage() {
    const { user, token } = useAuth();
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);
    const [model, setModel] = useState("gemini-1.5-pro");

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden pb-20">
            <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
                <div className="w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-0 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-12 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/chat">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <SettingsIcon className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid gap-8"
                >
                    {/* Appearance */}
                    <Card className="border-border/50 shadow-sm backdrop-blur-sm bg-card/95">
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>
                                Customize how Vextron looks on your device.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted bg-background'}`}
                                >
                                    <Sun className="h-6 w-6 mb-2" />
                                    <span className="text-sm font-medium">Light</span>
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted bg-background'}`}
                                >
                                    <Moon className="h-6 w-6 mb-2" />
                                    <span className="text-sm font-medium">Dark</span>
                                </button>
                                <button
                                    onClick={() => setTheme("system")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted bg-background'}`}
                                >
                                    <Monitor className="h-6 w-6 mb-2" />
                                    <span className="text-sm font-medium">System</span>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Preferences */}
                    <Card className="border-border/50 shadow-sm backdrop-blur-sm bg-card/95">
                        <CardHeader>
                            <CardTitle>AI Model Preferences</CardTitle>
                            <CardDescription>
                                Select the intelligence layer that powers your conversations.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Default Model</Label>
                                    <Select value={model} onValueChange={setModel}>
                                        <SelectTrigger className="w-full sm:w-[300px]">
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gemini-1.5-pro">Vextron Pro (Gemini 1.5 Pro)</SelectItem>
                                            <SelectItem value="gemini-1.5-flash">Vextron Fast (Gemini 1.5 Flash)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Pro offers deep reasoning capabilities for complex tasks, while Fast offers ultra-low latency for quick interactions.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications & Sounds */}
                    <Card className="border-border/50 shadow-sm backdrop-blur-sm bg-card/95">
                        <CardHeader>
                            <CardTitle>Notifications & Sounds</CardTitle>
                            <CardDescription>
                                Control how and when you are notified about activities.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive notifications for new messages.</p>
                                </div>
                                <Switch checked={notifications} onCheckedChange={setNotifications} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">In-app Sounds</Label>
                                    <p className="text-sm text-muted-foreground">Play a subtle ping when AI has finished generating.</p>
                                </div>
                                <Switch checked={sound} onCheckedChange={setSound} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4 pb-8">
                        <Button size="lg" onClick={handleSave} className="shadow-lg shadow-primary/20">
                            Save Preferences
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
