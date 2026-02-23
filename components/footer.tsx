import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, Sparkles } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-background border-t border-border mt-auto">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
                    {/* Brand & Description */}
                    <div className="col-span-1 lg:col-span-1 flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                            <div className="rounded-xl bg-primary/10 p-2 text-primary flex items-center justify-center">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-foreground">ChatBot AI</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Empowering your workflow with intelligent conversations. Experience the next generation of AI assistance.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-foreground tracking-wide">Product</h3>
                        <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Integrations</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-foreground tracking-wide">Resources</h3>
                        <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">API Reference</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-foreground tracking-wide">Company</h3>
                        <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} ChatBot AI. Developed by Anil, Sunny, and Satya.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-all hover:scale-110">
                            <Github className="w-5 h-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-all hover:scale-110">
                            <Twitter className="w-5 h-5" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-all hover:scale-110">
                            <Linkedin className="w-5 h-5" />
                            <span className="sr-only">LinkedIn</span>
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-all hover:scale-110">
                            <Mail className="w-5 h-5" />
                            <span className="sr-only">Email</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}