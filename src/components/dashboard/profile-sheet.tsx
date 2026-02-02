
"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  User,
  Mail,
  Building,
  Calendar,
  CreditCard,
  LogOut,
  Zap,
  Activity,
  CircuitBoard,
  Pencil,
  Check,
  X
} from "lucide-react"

interface ProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProfileSheet({ isOpen, onOpenChange }: ProfileSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Doe",
    role: "Quantum Lead",
    email: "alex.doe@example.com",
    org: "Quantum Innovations"
  });

  const handleSave = () => {
    // Here you would typically call an API to update the profile
    // For now we just exit edit mode
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset or just exit (in a real app we might revert changes)
    setIsEditing(false);
  };

  const handleSignOut = () => {
    // Simulate sign out process
    // In a real app we would clear cookies/tokens here
    window.location.href = "/";
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open) setIsEditing(false);
      onOpenChange(open);
    }}>
      <SheetContent className="sm:max-w-md flex flex-col h-full">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <SheetTitle>User Profile</SheetTitle>
            <SheetDescription>
              Manage your account settings.
            </SheetDescription>
          </div>
          {!isEditing && (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit Profile</span>
            </Button>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-8">
          {/* User Info Header */}
          <div className="flex flex-col items-center space-y-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-lg -z-10 h-32 w-full top-8" />
            <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
              <AvatarImage src="https://picsum.photos/seed/user/200/200" data-ai-hint="profile avatar" />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>

            {isEditing ? (
              <div className="space-y-2 w-full max-w-[200px] text-center">
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="text-center font-bold h-9 bg-background/50 backdrop-blur-sm"
                  aria-label="Name"
                />
                <Input
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="text-center text-xs h-7 bg-background/50 backdrop-blur-sm"
                  aria-label="Role"
                />
              </div>
            ) : (
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-muted-foreground">{profile.role}</span>
                  <Badge variant="secondary" className="text-xs font-mono">PRO</Badge>
                </div>
              </div>
            )}
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Account Details</h4>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50 transition-all hover:bg-card">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="font-medium">Email</span>
                </div>
                {isEditing ? (
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="h-8 w-[200px] bg-background"
                  />
                ) : (
                  <span className="text-muted-foreground">{profile.email}</span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50 transition-all hover:bg-card">
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-primary" />
                  <span className="font-medium">Organization</span>
                </div>
                {isEditing ? (
                  <Input
                    value={profile.org}
                    onChange={(e) => setProfile({ ...profile, org: e.target.value })}
                    className="h-8 w-[200px] bg-background"
                  />
                ) : (
                  <span className="text-muted-foreground">{profile.org}</span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50 transition-all hover:bg-card">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">Joined</span>
                </div>
                <span className="text-muted-foreground">January 2024</span>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className={`space-y-4 transition-opacity duration-300 ${isEditing ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Mobile Credits</h4>
              <span className="text-xs font-mono text-muted-foreground">Refreshes in 12 days</span>
            </div>

            <div className="space-y-3 p-4 border rounded-xl bg-card/30">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-yellow-500" /> QPU Usage
                  </span>
                  <span className="font-medium">450 / 1000s</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>

              <Separator className="my-2" />

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Activity className="h-3 w-3 text-blue-500" /> API Requests
                  </span>
                  <span className="font-medium">2.1k / 5k</span>
                </div>
                <Progress value={42} className="h-1.5 opacity-80" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`${isEditing ? 'hidden' : 'block'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Sessions</h4>
            <div className="space-y-2">
              {[
                { action: "Job Completed", target: "ibm_brisbane", time: "2 mins ago", icon: CircuitBoard, color: "text-green-500" },
                { action: "Anomaly Detected", target: "Job #8291", time: "4 hours ago", icon: Activity, color: "text-red-500" },
                { action: "Subscription Updated", target: "Pro Plan", time: "1 day ago", icon: CreditCard, color: "text-primary" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm p-2 hover:bg-muted/50 rounded-md transition-colors">
                  <div className={`p-2 rounded-full bg-background border shadow-sm ${item.color}`}>
                    <item.icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 grid gap-0.5">
                    <p className="font-medium leading-none">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.target}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="mt-auto border-t pt-4 flex-row gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" className="flex-1" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                <Check className="mr-2 h-4 w-4" /> Save
              </Button>
            </>
          ) : (
            <Button variant="outline" className="w-full text-muted-foreground hover:text-foreground" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
