
"use client"

import React, { useState } from "react"
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarSeparator,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {
  User,
  Bot,
  FileText,
  Calendar,
  CircleGauge,
  Home,
  Calculator,
  List,
  Settings,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileSheet } from "@/components/dashboard/profile-sheet"
import { SettingsDialog } from "@/components/dashboard/settings-dialog"
import { DashboardProvider } from "@/contexts/dashboard-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <DashboardProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  className="h-6 w-6 text-primary"
                >
                  <rect width="256" height="256" fill="none" />
                  <path d="M88,112a40,40,0,1,1,40,40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
                  <path d="M168,144a40,40,0,1,1-40-40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
                  <path d="M112,88a40,40,0,1,1-40-40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
                  <path d="M144,168a40,40,0,1,1,40-40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
                  <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="16" />
                </svg>
                <span className="font-semibold group-data-[collapsible=icon]:hidden">Quantum Sentinel</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard">
                      <Home />
                      Dashboard
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/jobs">
                      <List />
                      All Jobs
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/sessions">
                      <Calendar />
                      Sessions
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              <SidebarSeparator />
              <SidebarGroup className="p-2">
                <SidebarGroupLabel>Tools</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/ai-tools">
                      <Bot />
                      AI Tools
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/compressor">
                      <CircleGauge />
                      Compressor
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/calculator">
                      <Calculator />
                      Calculator
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              <SidebarSeparator />
              <SidebarGroup className="p-2">
                <SidebarGroupLabel>Other</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/note">
                      <FileText />
                      Note
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/export-history">
                      <Calendar />
                      Export's History
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setIsSettingsOpen(true)}>
                    <Settings />
                    Settings
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setIsProfileSheetOpen(true)}>
                    <User />
                    User Information
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <div className="flex flex-1 flex-col">
            <DashboardHeader onOpenProfile={() => setIsProfileSheetOpen(true)} />
            <main className="flex-1 bg-muted/30">{children}</main>
          </div>
        </div>
        <ProfileSheet
          isOpen={isProfileSheetOpen}
          onOpenChange={setIsProfileSheetOpen}
        />
        <SettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </SidebarProvider>
    </DashboardProvider>
  )
}
