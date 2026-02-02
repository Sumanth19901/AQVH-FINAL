
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircuitBoard, ArrowLeft, Github, Linkedin, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Navbar */}
            <header className="px-4 lg:px-6 h-14 flex items-center border-b backdrop-blur-sm fixed w-full z-10 bg-background/80">
                <Link className="flex items-center justify-center" href="/">
                    <CircuitBoard className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-lg font-bold">Quantum Sentinel</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/#features">
                        Features
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
                        Pricing
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                        Get Started
                    </Link>
                </nav>
            </header>

            <main className="flex-1 pt-24 pb-12">
                <div className="container px-4 md:px-6 max-w-4xl mx-auto space-y-12">

                    {/* Header Section */}
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">About Quantum Sentinel</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Bridging the gap between quantum experiments and actionable insights through real-time observability and AI.
                        </p>
                    </div>

                    <Separator />

                    {/* Mission Section */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Quantum computing is rapidly evolving, but the tools to monitor and debug these complex systems haven't kept pace.
                                Researchers often stare at black boxes, waiting for jobs to complete without knowing if errors are occurring in real-time.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                **Quantum Sentinel** was built to change that. We provide a "glass box" view into IBM Quantum backends, utilizing advanced AI to detect anomalies, explain circuit performance, and optimize resource usage—saving researchers valuable time and computational credits.
                            </p>
                        </div>
                        <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl border bg-muted/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                            {/* Abstract visual representation */}
                            <svg className="w-full h-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
                                <path d="M0 100 C 20 20 50 20 100 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-500" />
                                <path d="M0 100 C 20 40 50 40 100 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-500" />
                                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/50" />
                            </svg>
                        </div>
                    </div>

                    {/* What We Do Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight text-center">What Sets Us Apart</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 border rounded-xl bg-card hover:shadow-lg transition-all">
                                <h3 className="font-semibold mb-2 text-lg">Real-Time Observability</h3>
                                <p className="text-sm text-muted-foreground">
                                    Direct integration with IBM Quantum Transpiler service allows us to intercept and visualize job events as they happen, not just after they finish.
                                </p>
                            </div>
                            <div className="p-6 border rounded-xl bg-card hover:shadow-lg transition-all">
                                <h3 className="font-semibold mb-2 text-lg">Genkit-Powered AI</h3>
                                <p className="text-sm text-muted-foreground">
                                    We use Google's Genkit framework to power an intelligent assistant that understands Qiskit code and error logs, providing human-readable explanations.
                                </p>
                            </div>
                            <div className="p-6 border rounded-xl bg-card hover:shadow-lg transition-all">
                                <h3 className="font-semibold mb-2 text-lg">Developer Centric</h3>
                                <p className="text-sm text-muted-foreground">
                                    Built by developers for developers. We define open standards for quantum telemetry and provide easy export options for your research data.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Tech Stack Section (About the Project) */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight text-center">Built With Modern Tech</h2>
                        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                            Quantum Sentinel is architected for performance and scalability, combining the best of web and data science ecosystems.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <div className="font-bold text-lg mb-1">Next.js 15</div>
                                <div className="text-xs text-muted-foreground">Frontend Framework</div>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <div className="font-bold text-lg mb-1">FastAPI</div>
                                <div className="text-xs text-muted-foreground">Python Backend</div>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <div className="font-bold text-lg mb-1">Google Genkit</div>
                                <div className="text-xs text-muted-foreground">AI Agent Framework</div>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <div className="font-bold text-lg mb-1">IBM Quantum</div>
                                <div className="text-xs text-muted-foreground">Compute Provider</div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Team/Contact Section */}
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <h2 className="text-2xl font-bold tracking-tight">Join the Revolution</h2>
                        <p className="text-muted-foreground max-w-xl">
                            Quantum Sentinel is an open initiative. We welcome contributions, feedback, and partnerships from the quantum research community.
                        </p>
                        <div className="flex gap-4 sticky">
                            <Button variant="outline" size="icon">
                                <Github className="h-5 w-5" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <Linkedin className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-center pt-8">
                        <Link href="/">
                            <Button variant="ghost" className="text-muted-foreground">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Quantum Sentinel. All rights reserved.</p>
            </footer>
        </div>
    );
}
