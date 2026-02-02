
"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { RefreshCw, Monitor, Bell, Shield, Keyboard } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function SettingsDialog({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const handleReset = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Settings Reset",
                description: "All preference settings have been restored to defaults.",
            })
            onOpenChange(false);
        }, 1500)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px] gap-0 p-0 overflow-hidden">
                <div className="flex flex-row h-[450px]">
                    {/* Sidebar like Tabs */}
                    <Tabs defaultValue="general" orientation="vertical" className="flex-1 flex flex-row">
                        <TabsList className="flex flex-col h-full bg-muted/30 w-48 justify-start items-start p-4 space-y-2 rounded-none border-r">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ml-2">App Settings</div>
                            <TabsTrigger value="general" className="w-full justify-start gap-2">
                                <Monitor className="h-4 w-4" /> General
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="w-full justify-start gap-2">
                                <Bell className="h-4 w-4" /> Notifications
                            </TabsTrigger>
                            <TabsTrigger value="privacy" className="w-full justify-start gap-2">
                                <Shield className="h-4 w-4" /> Privacy & Key
                            </TabsTrigger>
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4 ml-2">System</div>
                            <TabsTrigger value="shortcuts" className="w-full justify-start gap-2">
                                <Keyboard className="h-4 w-4" /> Shortcuts
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex-1 p-6 overflow-y-auto bg-background">
                            <DialogHeader className="mb-6">
                                <DialogTitle>Settings</DialogTitle>
                                <DialogDescription>
                                    Configure your dashboard preferences.
                                </DialogDescription>
                            </DialogHeader>

                            <TabsContent value="general" className="space-y-6 mt-0">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Appearance</h3>
                                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Dark Mode</Label>
                                            <div className="text-[0.8rem] text-muted-foreground">
                                                Use system preference
                                            </div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Compact View</Label>
                                            <div className="text-[0.8rem] text-muted-foreground">
                                                Reduce spacing in lists
                                            </div>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="notifications" className="space-y-6 mt-0">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Alerts</h3>
                                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Job Failures</Label>
                                            <div className="text-[0.8rem] text-muted-foreground">
                                                Notify when a job fails
                                            </div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Long Queue Warning</Label>
                                            <div className="text-[0.8rem] text-muted-foreground">
                                        Alert if >1 hour wait
                                            </div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="privacy" className="space-y-6 mt-0">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>IBM Quantum Token</Label>
                                        <Input value="••••••••••••••••" readOnly />
                                        <p className="text-xs text-muted-foreground">stored locally via encryption</p>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
                                        <div className="space-y-0.5">
                                            <Label className="text-base text-red-600 dark:text-red-400">Reset All Settings</Label>
                                            <div className="text-[0.8rem] text-muted-foreground">
                                                Restore default configuration
                                            </div>
                                        </div>
                                        <Button size="sm" variant="destructive" onClick={handleReset} disabled={isLoading}>
                                            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Reset"}
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}
