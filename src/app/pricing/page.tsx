
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircuitBoard, Check, X, ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false);

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
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
                        About
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                        Get Started
                    </Link>
                </nav>
            </header>

            <main className="flex-1 pt-24 pb-12">
                <div className="container px-4 md:px-6 max-w-6xl mx-auto space-y-12">

                    {/* Header Section */}
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Choose the plan that fits your research needs. From simulation to dedicated quantum hardware access.
                        </p>

                        <div className="flex items-center justify-center gap-4 pt-4">
                            <span className={`text-sm ${!isAnnual ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                            <Switch
                                checked={isAnnual}
                                onCheckedChange={setIsAnnual}
                                className="data-[state=checked]:bg-primary"
                            />
                            <span className={`text-sm ${isAnnual ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                                Yearly <Badge variant="secondary" className="ml-1 text-[10px] text-green-600 dark:text-green-400">SAVE 20%</Badge>
                            </span>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-3 gap-8 pt-8">

                        {/* Free Tier */}
                        <div className="flex flex-col p-6 rounded-2xl border bg-card/50 shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                            <div className="p-4">
                                <h3 className="text-2xl font-bold">Observer</h3>
                                <p className="text-sm text-muted-foreground mt-2">Perfect for students and hobbyists starting their quantum journey.</p>
                            </div>
                            <div className="p-4 pt-0">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">$0</span>
                                    <span className="text-muted-foreground">/mo</span>
                                </div>
                            </div>
                            <ul className="flex-1 p-4 space-y-3 text-sm">
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Basic Job Monitoring</li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> 1 Mock Backend</li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> 3 Days History Retention</li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Community Support</li>
                                <li className="flex items-center gap-3 text-muted-foreground"><X className="h-4 w-4" /> No AI Assistant</li>
                                <li className="flex items-center gap-3 text-muted-foreground"><X className="h-4 w-4" /> No Export Capabilities</li>
                            </ul>
                            <div className="p-4 mt-auto">
                                <Link href="/signup">
                                    <Button variant="outline" className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Pro Tier - Best Value */}
                        <div className="flex flex-col p-6 rounded-2xl border-2 border-primary bg-card shadow-xl scale-105 relative z-10">
                            <div className="absolute top-0 right-0 -mr-px -mt-px rounded-bl-xl rounded-tr-xl bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                                POPULAR
                            </div>
                            <div className="p-4">
                                <h3 className="text-2xl font-bold text-primary">Researcher</h3>
                                <p className="text-sm text-muted-foreground mt-2">For serious researchers needing real hardware insights and AI help.</p>
                            </div>
                            <div className="p-4 pt-0">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">${isAnnual ? '29' : '39'}</span>
                                    <span className="text-muted-foreground">/mo</span>
                                </div>
                                {isAnnual && <p className="text-xs text-muted-foreground mt-1">Billed ${29 * 12} yearly</p>}
                            </div>
                            <ul className="flex-1 p-4 space-y-3 text-sm">
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> <strong>Real IBM Quantum Backend</strong></li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Unlimited Job Tracking</li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> <strong>Genkit AI Access</strong> (500 req/mo)</li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> 30 Days History Retention</li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Anomaly Detection Alerts</li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> CSV/JSON Exports</li>
                            </ul>
                            <div className="p-4 mt-auto">
                                <Link href="/signup?plan=researcher">
                                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">Start Free Trial</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Enterprise Tier */}
                        <div className="flex flex-col p-6 rounded-2xl border bg-card/50 shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                            <div className="p-4">
                                <h3 className="text-2xl font-bold">Lab / Team</h3>
                                <p className="text-sm text-muted-foreground mt-2">Managed infrastructure for entire research labs and universities.</p>
                            </div>
                            <div className="p-4 pt-0">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">$99</span>
                                    <span className="text-muted-foreground">/mo</span>
                                </div>
                                {isAnnual && <p className="text-xs text-muted-foreground mt-1">per user, billed yearly</p>}
                            </div>
                            <ul className="flex-1 p-4 space-y-3 text-sm">
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> All Researcher Features</li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> <strong>Unlimited AI Requests</strong></li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> 1 Year History Retention</li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Team Roles & detailed Logs</li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Priority Email Support</li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Custom Backend Integrations</li>
                            </ul>
                            <div className="p-4 mt-auto">
                                <Link href="/contact">
                                    <Button variant="outline" className="w-full">Contact Sales</Button>
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* FAQ Preview (Optional, keeps it simple for now) */}
                    <div className="text-center pt-12 space-y-4">
                        <p className="text-muted-foreground">
                            Have questions? <Link href="/about" className="text-primary hover:underline">Chat with our team</Link> or check our documentation.
                        </p>
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
