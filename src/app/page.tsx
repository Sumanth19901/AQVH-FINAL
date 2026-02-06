
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircuitBoard, ArrowRight, Bot, Activity, Zap, Server } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b backdrop-blur-sm fixed w-full z-10 bg-background/80">
        <Link className="flex items-center justify-center" href="#">
          <CircuitBoard className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">IBM Quantum Observer</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            About
          </Link>
        </nav>
      </header>

      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Observe the Quantum Realm
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Real-time monitoring, anomaly detection, and AI-driven insights for your IBM Quantum experiments.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Demo View Section */}
        <section className="w-full py-12 bg-background flex justify-center border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard Preview</h2>
              <p className="max-w-[800px] text-muted-foreground text-center">
                Experience a unified interface for all your quantum operations. Visualize results, track queues, and get AI assistance in one place.
              </p>
              <div className="w-full max-w-5xl mt-8 rounded-xl overflow-hidden shadow-2xl border bg-muted/20 relative aspect-video group">
                {/* Mock Browser Header */}
                <div className="h-8 bg-muted/80 backdrop-blur w-full border-b flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <div className="ml-4 h-5 w-2/3 bg-background/50 rounded text-[10px] flex items-center px-2 text-muted-foreground">quantum.observer/dashboard</div>
                </div>
                {/* Placeholder for Screenshot - using a generated gradient/layout representation */}
                <div className="w-full h-full bg-background p-4 grid grid-cols-4 gap-4 overflow-hidden relative">
                  {/* Sidebar Mock */}
                  <div className="hidden md:block col-span-1 h-full rounded-lg bg-muted/30 border p-3 space-y-2">
                    <div className="h-8 w-3/4 bg-primary/20 rounded mb-6"></div>
                    <div className="h-6 w-full bg-muted/50 rounded"></div>
                    <div className="h-6 w-full bg-muted/50 rounded"></div>
                    <div className="h-6 w-full bg-muted/50 rounded"></div>
                  </div>
                  {/* Main Content Mock */}
                  <div className="col-span-4 md:col-span-3 h-full flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="h-24 w-1/3 bg-card border rounded-lg p-3">
                        <div className="h-4 w-1/2 bg-muted rounded mb-2"></div>
                        <div className="h-8 w-1/3 bg-primary/20 rounded"></div>
                      </div>
                      <div className="h-24 w-1/3 bg-card border rounded-lg p-3">
                        <div className="h-4 w-1/2 bg-muted rounded mb-2"></div>
                        <div className="h-8 w-1/3 bg-green-500/20 rounded"></div>
                      </div>
                      <div className="h-24 w-1/3 bg-card border rounded-lg p-3">
                        <div className="h-4 w-1/2 bg-muted rounded mb-2"></div>
                        <div className="h-8 w-1/3 bg-blue-500/20 rounded"></div>
                      </div>
                    </div>
                    <div className="flex-1 bg-card border rounded-lg p-4 relative overflow-hidden">
                      <div className="h-6 w-1/4 bg-muted rounded mb-4"></div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-12 w-full bg-muted/30 rounded flex items-center px-4 justify-between">
                            <div className="h-3 w-1/4 bg-muted/50 rounded"></div>
                            <div className="h-3 w-1/6 bg-primary/20 rounded"></div>
                          </div>
                        ))}
                      </div>
                      {/* Overlay Text */}
                      <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link href="/dashboard">
                          <Button variant="default" className="shadow-lg">View Live Demo</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-muted/40 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Platform Features</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">Everything you need to manage your quantum experiments.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center space-y-3 bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Live Job Tracking</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Watch your jobs move through QUEUED, RUNNING, and COMPLETED states in real-time. View detailed execution metrics like QPU time and queue depth.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center space-y-3 bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Bot className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">AI Assistant (Genkit)</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Integrated AI helps you generate Qiskit code, analyze error logs, and optimize circuits just by chatting. Powered by Google Genkit.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center space-y-3 bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <Zap className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold">Anomaly Detection</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Automated monitoring detects unusual wait times or unexpected job failures, alerting you to potential backend issues instantly.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center space-y-3 bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <Server className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold">Backend Health</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Live connectivity status for all IBM Quantum backends (e.g., Brisbane, Kyoto). Visualize qubit topology and error rates.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="flex flex-col items-center space-y-3 bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <svg
                    className=" h-8 w-8 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Session History</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Keep a detailed log of all your research sessions. Export data to CSV/JSON for easy integration with your research papers.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="flex flex-col items-center space-y-3 bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                  <svg
                    className=" h-8 w-8 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Mock & Live Modes</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Seamlessly toggle between a "Demo Mode" with simulated data for testing and "Live Mode" connected to your real IBM Quantum account.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 IBM Quantum Observer. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
