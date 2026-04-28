"use client";

import { useState } from "react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(API_ENDPOINTS.auth.forgotPassword, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                throw new Error("Failed to send reset email");
            }

            setSubmitted(true);
        } catch (err) {
            console.error("Forgot password error:", err);
            setError("Unable to process your request right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4 relative overflow-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
                <div className="w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-0 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <Link href="/" className="flex items-center gap-2 mb-6 group">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                            <Bot className="w-6 h-6 text-primary" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground text-center">
                        Forgot password
                    </h1>
                    <p className="text-muted-foreground mt-2 text-center text-sm">
                        Enter your account email to receive a reset link
                    </p>
                </div>

                <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
                    {submitted ? (
                        <div className="space-y-4 text-center">
                            <p className="p-3 text-sm text-green-600 bg-green-500/10 rounded-md border border-green-500/20">
                                Check your email for a reset link
                            </p>
                            <Link href="/login" className="text-primary hover:underline font-medium text-sm">
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11 bg-background/50 border-border/50 text-foreground"
                                />
                            </div>

                            <Button type="submit" className="w-full h-11" disabled={loading}>
                                {loading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <>
                                        Send Reset Link <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
