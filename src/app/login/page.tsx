
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, CircuitBoard, ArrowRight, Github, Mail, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Valid credentials for demo
    const VALID_EMAIL = "demo@quantum.observer";
    const VALID_PASSWORD = "password123";

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Validate credentials
        if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
            toast({
                variant: "destructive",
                title: "Invalid credentials",
                description: "Email or password is incorrect. Please try again.",
            });
            return;
        }

        // Valid credentials - instant redirect
        router.push("/dashboard");
    }

    const handleSocialLogin = (provider: string) => {
        // Social login always succeeds - instant redirect
        router.push("/dashboard");
    };

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Visual Side */}
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-background opacity-90" />
                <div className="absolute inset-0" style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=75&w=1920&auto=format&fit=crop')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.4,
                    mixBlendMode: "overlay"
                }} />

                <div className="relative z-20 flex items-center text-lg font-medium">
                    <CircuitBoard className="mr-2 h-6 w-6" />

                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;The next generation of quantum observation involves not just seeing the data, but understanding the entangled reality beneath it.&rdquo;
                        </p>
                        <footer className="text-sm">Dr. A. E. Quantum</footer>
                    </blockquote>
                </div>
            </div>

            {/* Form Side */}
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email to sign in to your account
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={onSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        defaultValue="demo@quantum.observer"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Forgot pwd?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoCapitalize="none"
                                            autoComplete="current-password"
                                            disabled={isLoading}
                                            defaultValue="password123"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="sr-only">
                                                {showPassword ? "Hide password" : "Show password"}
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                                    >
                                        Remember me for 30 days
                                    </label>
                                </div>

                                <Button disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25">
                                    {isLoading ? (
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                    ) : (
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                    )}
                                    Sign In with Email
                                </Button>
                            </div>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" disabled={isLoading} onClick={() => handleSocialLogin('GitHub')}>
                                <Github className="mr-2 h-4 w-4" />
                                GitHub
                            </Button>
                            <Button variant="outline" disabled={isLoading} onClick={() => handleSocialLogin('Google')}>
                                <Mail className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </div>
                    </div>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link
                            href="/signup"
                            className="hover:text-brand underline underline-offset-4"
                        >
                            Don&apos;t have an account? Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
