"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Lock, Code2, Cpu, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">

      {/* Precision Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Extremely subtle top glow */}
        <div className="absolute top-0 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full z-10 pt-32 pb-24 sm:pt-48 sm:pb-32 px-4 flex flex-col items-center text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Minimal Pill */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-background text-muted-foreground text-xs font-medium uppercase tracking-widest shadow-sm hover:border-primary/30 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Vextron AI 2.0 is Live
            </div>
          </motion.div>

          {/* Clean Heading */}
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl font-semibold tracking-tighter text-foreground leading-[1.1] mb-8">
            Intelligence,<br />
            <span className="text-muted-foreground">perfectly refined.</span>
          </motion.h1>

          {/* Precise Subtitle */}
          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            A state-of-the-art conversational interface engineered for absolute clarity, speed, and uncompromising performance. Experience the new standard.
          </motion.p>

          {/* Minimalist Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="h-12 px-8 text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90">
              <Link href="/chat">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-sm font-medium rounded-full bg-background border-border hover:bg-muted w-full sm:w-auto transition-all">
              <Link href="#architecture">
                Explore Architecture
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Abstract Structural Preview */}
      <section className="relative w-full z-10 px-4 pb-32 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="w-full max-w-5xl rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl p-2 sm:p-4"
        >
          <div className="w-full rounded-xl bg-background border border-border/50 overflow-hidden flex flex-col h-[400px] shadow-inner">
            <div className="h-12 border-b border-border/50 flex items-center px-6 gap-4 bg-muted/20">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-24 py-1.5 rounded-md bg-muted/50 border border-border/50 text-[10px] uppercase tracking-widest text-muted-foreground">Chat Session // ID: 8XF-99A</div>
              </div>
            </div>
            <div className="flex-1 p-8 flex flex-col gap-6 relative">
              <div className="flex gap-4 items-start w-[80%]">
                <div className="w-8 h-8 rounded-full bg-muted flex shrink-0"></div>
                <div className="h-10 w-full bg-muted/50 rounded-lg border border-border/30"></div>
              </div>
              <div className="flex gap-4 items-start w-[90%] self-end flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="h-24 w-full bg-primary/5 rounded-lg border border-primary/10"></div>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-background to-transparent"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Structured Features / Bento Box format */}
      <section id="architecture" className="relative w-full z-10 py-32 border-t border-border/40 bg-muted/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">Precision Engineered.</h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Every pixel and token optimized for an interface that feels invisible, letting the intelligence take center stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bento Item 1 - Large */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-background border border-border/50 shadow-sm flex flex-col justify-between group hover:border-border transition-colors w-full h-full">
              <div className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center mb-12 group-hover:bg-primary/5 transition-colors">
                <Zap className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Zero Latency Streaming</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Responses materialized instantly through an optimized WebSocket connection. No loaders. No waiting. Just pure speed.
                </p>
              </div>
            </div>

            {/* Bento Item 2 */}
            <div className="p-8 rounded-2xl bg-background border border-border/50 shadow-sm flex flex-col justify-between group hover:border-border transition-colors w-full h-full">
              <div className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center mb-12 group-hover:bg-primary/5 transition-colors">
                <Cpu className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Deep Context</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Persistent infinite memory. It remembers the intricacies of your project architecture seamlessly.
                </p>
              </div>
            </div>

            {/* Bento Item 3 */}
            <div className="p-8 rounded-2xl bg-background border border-border/50 shadow-sm flex flex-col justify-between group hover:border-border transition-colors w-full h-full">
              <div className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center mb-12 group-hover:bg-primary/5 transition-colors">
                <Lock className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Ironclad Privacy</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your prompts are not used for training. End-to-end encryption guarantees complete confidentiality.
                </p>
              </div>
            </div>

            {/* Bento Item 4 - Large */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-background border border-border/50 shadow-sm flex flex-col justify-between group hover:border-border transition-colors w-full h-full">
              <div className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center mb-12 group-hover:bg-primary/5 transition-colors">
                <Code2 className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Developer Native</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Impeccable syntax highlighting, structural understanding of modern frameworks, and Git-aware logical deduction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Call to Action */}
      <section className="relative w-full z-10 flex py-40 border-t border-border/40 w-full justify-center">
        <div className="container relative flex flex-col justify-center items-center w-full px-4 max-w-3xl text-center">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-8">
            Ready to streamline your thought process?
          </h2>
          <Button asChild size="lg" className="h-12 px-10 text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all bg-foreground text-background hover:bg-foreground/90">
            <Link href="/chat">
              Start Chatting
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
