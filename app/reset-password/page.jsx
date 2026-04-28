"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/api-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Invalid reset link. Please request a new password reset.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.auth.resetPassword, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Unable to reset password. The link may be expired.");
                return;
            }

            toast.success("Password reset successful. Please log in.");
            router.push("/login");
        } catch (err) {
            console.error("Reset password error:", err);
            setError("Unable to reset password right now. Please try again.");
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
                        Reset password
                    </h1>
                    <p className="text-muted-foreground mt-2 text-center text-sm">
                        Set a new password for your account
                    </p>
                </div>

                <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-xs uppercase tracking-wider text-muted-foreground">
                                New Password
                            </Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                className="h-11 bg-background/50 border-border/50 text-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wider text-muted-foreground">
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                className="h-11 bg-background/50 border-border/50 text-foreground"
                            />
                        </div>

                        <Button type="submit" className="w-full h-11" disabled={loading}>
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <>
                                    Update Password <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
