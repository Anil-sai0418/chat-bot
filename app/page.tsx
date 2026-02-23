import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Zap, Shield, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-background pt-24 pb-32 sm:pt-32 sm:pb-40">
        {/* Background gradient effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-3xl rounded-full opacity-50 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen animate-blob" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full opacity-40 dark:opacity-10 pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full opacity-50 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm transition-all hover:bg-background/80 hover:shadow-md cursor-pointer group">
            <Sparkles className="w-4 h-4 text-primary mr-2 group-hover:animate-pulse" />
            <span className="text-sm font-medium tracking-tight">Introducing ChatBot AI 2.0</span>
            <ArrowRight className="w-4 h-4 ml-2 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground mb-8 max-w-4xl mx-auto leading-[1.1]">
            Experience the Future of <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600 dark:to-blue-400">Intelligent Conversation</span>
          </h1>

          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            Elevate your workflow with an AI assistant that understands context, learns from your interactions, and helps you achieve more in less time.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-base shadow-lg hover:shadow-primary/25 transition-all w-full sm:w-auto hover:scale-[1.02]">
              <Link href="/chat">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base bg-background/50 backdrop-blur-sm border-border/50 hover:bg-muted w-full sm:w-auto">
              <Link href="#features">
                Explore Features
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section id="features" className="w-full py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Designed for Productivity
            </h2>
            <p className="text-lg text-muted-foreground">
              We've built a chat experience that stays out of your way and provides exactly what you need, exactly when you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Natural Conversations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Interact with the AI using completely natural language. It understands context, nuance, and complex instructions effortlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Powered by state-of-the-art models returning responses in milliseconds via optimized streaming interfaces.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your data remains yours. Built with end-to-end encryption standards ensuring your sensitive conversations never leak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10"></div>
        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
            Ready to upgrade your workflow?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of professionals saving hours a week with our intelligent assistant.
          </p>
          <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl hover:shadow-primary/25 hover:scale-105 transition-all">
            <Link href="/chat">
              Start Chatting Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
