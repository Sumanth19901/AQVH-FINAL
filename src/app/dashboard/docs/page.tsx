export default function DocsPage() {
    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">IBM Quantum Observer: Project Documentation</h1>
                <div className="text-sm text-muted-foreground flex gap-4">
                    <span>Date: October 26, 2023</span>
                    <span>Version: 1.0</span>
                </div>
            </div>

            <div className="space-y-8">
                {/* 1. Executive Summary */}
                <section id="executive-summary" className="space-y-3">
                    <h2 className="text-2xl font-semibold border-b pb-2">1. Executive Summary</h2>
                    <p className="leading-7">
                        <strong>IBM Quantum Observer</strong> is a cutting-edge, real-time monitoring dashboard designed specifically for the quantum computing era. It bridges the gap between complex quantum backend operations and user-friendly management. By leveraging modern web technologies and Generative AI, IBM Quantum Observer provides researchers and developers with a comprehensive view of their quantum jobs, system health, and performance metrics, all while offering intelligent insights through an integrated AI assistant.
                    </p>
                </section>

                {/* 2. Project Overview */}
                <section id="project-overview" className="space-y-3">
                    <h2 className="text-2xl font-semibold border-b pb-2">2. Project Overview</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">2.1 Problem Statement</h3>
                            <p className="text-muted-foreground">
                                As quantum computing scales, managing job queues, monitoring backend uptime (QPU availability), and debugging circuit errors becomes increasingly complex. Existing tools often lack real-time visual feedback or require deep command-line expertise to diagnose issues, leading to inefficient resource usage and slower research cycles.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">2.2 Proposed Solution</h3>
                            <p className="text-muted-foreground">
                                IBM Quantum Observer offers a centralized platform that visualizes the status of IBM Quantum backends and jobs. It incorporates <strong>Google’s Genkit</strong> to analyze error logs and detect anomalies automatically, reducing downtime and providing actionable advice to users without them needing to sift through raw logs.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. System Architecture */}
                <section id="system-architecture" className="space-y-3">
                    <h2 className="text-2xl font-semibold border-b pb-2">3. System Architecture</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">3.1 High-Level Design</h3>
                            <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                                <li><strong>Frontend</strong>: A responsive Single Page Application (SPA) served via Next.js.</li>
                                <li><strong>Backend API</strong>: A high-performance Python FastAPI service that acts as a proxy to the IBM Quantum API.</li>
                                <li><strong>AI Layer</strong>: Embedded Genkit flows that process data for anomaly detection and chat assistance.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">3.2 Technology Stack</h3>
                            <div className="rounded-md border mt-2">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="p-2 text-left font-medium">Component</th>
                                            <th className="p-2 text-left font-medium">Technology</th>
                                            <th className="p-2 text-left font-medium">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">Frontend</td>
                                            <td className="p-2">Next.js 15 (App Router)</td>
                                            <td className="p-2 text-muted-foreground">React framework for server-side rendering and static generation.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">UI Library</td>
                                            <td className="p-2">Shadcn UI & Tailwind CSS</td>
                                            <td className="p-2 text-muted-foreground">Provides accessible, premium, and responsive design components.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">Backend</td>
                                            <td className="p-2">Python (FastAPI)</td>
                                            <td className="p-2 text-muted-foreground">Asynchronous web server handling IBM Quantum integration.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">AI Engine</td>
                                            <td className="p-2">Firebase Genkit</td>
                                            <td className="p-2 text-muted-foreground">Orchestrates LLM flows for anomaly detection and chat.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">Quantum SDK</td>
                                            <td className="p-2">Qiskit</td>
                                            <td className="p-2 text-muted-foreground">Interacts directly with IBM Quantum processors.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 font-medium">Visualization</td>
                                            <td className="p-2">Recharts</td>
                                            <td className="p-2 text-muted-foreground">Renders real-time charts for QPU usage and job analytics.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Key Features */}
                <section id="key-features" className="space-y-3">
                    <h2 className="text-2xl font-semibold border-b pb-2">4. Key Features</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="border p-4 rounded-lg bg-card">
                            <h3 className="font-semibold flex items-center gap-2">🔍 Real-Time Job Tracking</h3>
                            <p className="text-sm text-muted-foreground mt-2">Monitor the lifecycle of quantum circuits (Queued, Running, Completed, Error) with sub-second latency updates.</p>
                        </div>
                        <div className="border p-4 rounded-lg bg-card">
                            <h3 className="font-semibold flex items-center gap-2">🤖 AI-Powered Anomaly Detection</h3>
                            <p className="text-sm text-muted-foreground mt-2">The system automatically flags irregular patterns in job execution times or error rates using Genkit.</p>
                        </div>
                        <div className="border p-4 rounded-lg bg-card">
                            <h3 className="font-semibold flex items-center gap-2">💬 Interactive AI Assistant</h3>
                            <p className="text-sm text-muted-foreground mt-2">A built-in chat interface allows users to ask questions like "Why did my circuit fail?" or "Generate a Qiskit code".</p>
                        </div>
                        <div className="border p-4 rounded-lg bg-card">
                            <h3 className="font-semibold flex items-center gap-2">📊 Comprehensive Analytics</h3>
                            <p className="text-sm text-muted-foreground mt-2">Visual dashboards display backend calibration data, queue lengths, and historical performance trends.</p>
                        </div>
                    </div>
                </section>

                {/* 5. User Guide */}
                <section id="user-guide" className="space-y-3">
                    <h2 className="text-2xl font-semibold border-b pb-2">5. User Guide</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">Getting Started</h3>
                            <ol className="list-decimal ml-6 space-y-2 mt-2 text-muted-foreground">
                                <li>
                                    <strong>Clone the Repository</strong>:
                                    <pre className="bg-muted p-2 rounded mt-1 text-xs">git clone &lt;repository-url&gt;</pre>
                                </li>
                                <li>
                                    <strong>Install Dependencies</strong>:
                                    <ul className="list-disc ml-6 mt-1">
                                        <li>Frontend: <code>npm install</code></li>
                                        <li>Backend: <code>pip install -r requirements.txt</code></li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Configuration</strong>: Rename <code>.env</code> to <code>.env.local</code> and add your <code>GEMINI_API_KEY</code>.
                                </li>
                                <li>
                                    <strong>Run the System</strong>:
                                    <ul className="list-disc ml-6 mt-1">
                                        <li>Backend: <code>uvicorn backend:app --reload</code></li>
                                        <li>Frontend: <code>npm run dev</code></li>
                                    </ul>
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>

                {/* 6. Future Roadmap */}
                <section id="roadmap" className="space-y-3">
                    <h2 className="text-2xl font-semibold border-b pb-2">6. Future Roadmap</h2>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                        <li><strong>Multi-Provider Support</strong>: Integrate AWS Braket and Azure Quantum.</li>
                        <li><strong>Mobile Application</strong>: A native React Native app for monitoring on the go.</li>
                        <li><strong>Advanced Error Mitigation</strong>: Auto-corrective circuit optimization suggestions.</li>
                        <li><strong>Team Collaboration</strong>: Shared workspaces for research teams.</li>
                    </ul>
                </section>
            </div>
        </div>
    )
}
