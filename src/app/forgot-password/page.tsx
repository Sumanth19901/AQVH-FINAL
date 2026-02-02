
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, KeyRound, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
            toast({
                title: "Reset link sent",
                description: "Check your email for instructions to reset your password.",
            });
        }, 1500);
    }

    return (
        <div className="container relative flex min-h-screen flex-col items-center justify-center bg-muted/30">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <KeyRound className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Forgot password?</CardTitle>
                    <CardDescription className="text-center">
                        No worries, we'll send you reset instructions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isSubmitted ? (
                        <form onSubmit={onSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <Button disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                    ) : (
                                        <Mail className="mr-2 h-4 w-4" />
                                    )}
                                    Send Reset Link
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-600 dark:text-green-400">
                                <p>We've sent a password reset link to your email.</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the email? Check your spam filter or{" "}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="underline hover:text-primary"
                                >
                                    try another email address
                                </button>.
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="link" className="text-sm text-muted-foreground" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to previous page
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
