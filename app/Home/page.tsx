"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles, Zap, Shield } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function PremiumLightMode() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary font-sans transition-colors duration-300 overflow-x-hidden">

      {/* Premium Aurora Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_50%)] opacity-20 blur-[100px] dark:opacity-10"
        />
        <motion.div
          animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div
          animate={{ x: [100, -100, 100], y: [50, -50, 50] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-purple-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[10px]" />
      </div>

      {/* --- Navigation --- */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto backdrop-blur-sm bg-background/50 border-b border-border/40">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>
          <span className="bg-clip-text text-transparent bg-linear-to-r from-foreground to-muted-foreground">
            Vextron
          </span>
        </div>
        <div className="hidden md:flex gap-10 text-sm dark:text-red-600 font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Product</a>
          <a href="#" className="hover:text-primary transition-colors">Integrations</a>
          <a href="#" className="hover:text-primary transition-colors">Enterprise</a>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-lg active:scale-95">
            Get Started
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="relative z-10 pt-24 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8 hover:bg-primary/15 transition-colors cursor-default">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen AI Platform
            </div>

            <div className="relative mb-8">
              <h1 className="text-6xl md:text-[6rem] font-bold tracking-tight leading-[1.05] text-foreground">
                Talk to the future <br />
                <motion.span
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-[200%_auto] dark:from-blue-400 dark:via-purple-400 dark:to-blue-400"
                >
                  effortlessly.
                </motion.span>
              </h1>
            </div>

            <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-normal leading-relaxed">
              Elevate your customer experience with a chatbot that understands
              complexity and delivers clarity in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg flex items-center justify-center gap-2 group transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)] active:scale-95">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-background text-foreground border border-input rounded-full font-bold text-lg transition-all hover:bg-accent hover:text-accent-foreground active:scale-95">
                Book a Demo
              </button>
            </div>
          </motion.div>

          {/* --- The "Clean" Mockup --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative mx-auto max-w-4xl"
          >
            <div className="p-4 bg-card rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-border">
              <div className="bg-muted rounded-[1.8rem] aspect-[16/9] border border-border overflow-hidden flex flex-col">
                {/* Minimal Interface Header */}
                <div className="h-14 border-b border-border flex items-center px-6 justify-between bg-card/50 backdrop-blur-md">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                  </div>
                  <div className="h-6 w-32 bg-muted-foreground/10 rounded-full" />
                </div>
                {/* Content area */}
                <div className="flex-1 p-10 flex flex-col justify-end items-start space-y-4">
                  <div className="h-12 w-2/3 bg-card rounded-2xl shadow-sm border border-border p-4 flex items-center">
                    <div className="h-2 w-full bg-muted rounded" />
                  </div>
                  <div className="h-12 w-1/2 bg-primary rounded-2xl shadow-sm p-4 flex items-center self-end">
                    <div className="h-2 w-full bg-primary-foreground/30 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* --- Feature Grid --- */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="text-orange-500" />, title: "Instant Response", desc: "No more waiting. Get answers in under 200ms with our global edge network." },
            { icon: <Shield className="text-green-500" />, title: "Bank-Grade Security", desc: "We use 256-bit encryption and SOC2 compliant data centers for total privacy." },
            { icon: <Bot className="text-blue-500" />, title: "Custom Personas", desc: "Train your AI on your own documents to match your brand's unique voice." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="p-8 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 cursor-default group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-base">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}