
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CircuitBoard, ArrowRight, Github, Mail, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirm-password") as string;

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Passwords do not match",
                description: "Please make sure your passwords match.",
            });
            setIsLoading(false);
            return;
        }

        try {
            const { auth } = await import('@/lib/firebase');
            const { createUserWithEmailAndPassword } = await import('firebase/auth');

            if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
                throw new Error("Firebase configuration missing. Please check your .env file.");
            }

            await createUserWithEmailAndPassword(auth, email, password);

            toast({
                title: "Account created!",
                description: "Welcome to Quantum Sentinel.",
            });
            router.push("/dashboard");

        } catch (error: any) {
            console.error("Signup error:", error);
            let errorMessage = "Failed to create account. Please try again.";

            if (error.message.includes("Firebase configuration missing")) {
                errorMessage = "Firebase is not configured. Please add your credentials to .env file.";
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Email is already in use.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak.";
            }

            toast({
                variant: "destructive",
                title: "Signup Failed",
                description: errorMessage,
            });
            setIsLoading(false);
        }
    }

    const handleSocialLogin = async (providerName: string) => {
        setIsLoading(true);
        try {
            const { auth, googleProvider, githubProvider } = await import('@/lib/firebase');
            const { signInWithPopup } = await import('firebase/auth');

            const provider = providerName === 'Google' ? googleProvider : githubProvider;

            if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
                throw new Error("Firebase configuration missing. Please check your .env file.");
            }

            await signInWithPopup(auth, provider);
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Login error:", error);
            let errorMessage = "Failed to sign in. Please try again.";

            if (error.message.includes("Firebase configuration missing")) {
                errorMessage = "Firebase is not configured. Please add your credentials to .env file.";
            } else if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = "Sign in cancelled.";
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                errorMessage = "An account already exists with the same email address but different sign-in credentials.";
            }

            toast({
                variant: "destructive",
                title: "Login Failed",
                description: errorMessage,
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Form Side (Left this time for variety/mirroring) */}
            <div className="lg:p-8 order-2 lg:order-1">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email below to create your account
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
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoCapitalize="none"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        autoCapitalize="none"
                                        disabled={isLoading}
                                    />
                                </div>

                                <Button disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25">
                                    {isLoading ? (
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                    ) : (
                                        <UserPlus className="mr-2 h-4 w-4" />
                                    )}
                                    Create Account
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
                        By clicking continue, you agree to our{" "}
                        <Link
                            href="/terms"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link
                            href="/login"
                            className="hover:text-brand underline underline-offset-4"
                        >
                            Already have an account? Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {/* Visual Side */}
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-l order-1 lg:order-2">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900 via-purple-900 to-background opacity-90" />
                <div className="absolute inset-0" style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=75&w=1920&auto=format&fit=crop')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.4,
                    mixBlendMode: "overlay"
                }} />

                <div className="relative z-20 flex items-center text-lg font-medium">
                    <CircuitBoard className="mr-2 h-6 w-6" />
                    Quantum Sentinel
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Join the community of researchers and engineers pushing the boundaries of quantum computing.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>
        </div>
    )
}
