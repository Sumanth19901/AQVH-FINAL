
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
  LayoutGrid,
  Monitor,
  Zap,
  GraduationCap,
  Compass,
  Settings,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileSheet } from "@/components/dashboard/profile-sheet"
import { SettingsDialog } from "@/components/dashboard/settings-dialog"
import { DashboardProvider } from "@/contexts/dashboard-context"
import { useTranslation } from "react-i18next"

// ... imports remain ...

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <DashboardProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar collapsible="icon">
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
                <span className="font-semibold group-data-[collapsible=icon]:hidden">IBM Quantum Observer</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard" tooltip={t('nav.dashboard')}>
                      <LayoutGrid />
                      <span>{t('nav.dashboard')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/jobs" tooltip={t('nav.jobs')}>
                      <Monitor />
                      <span>{t('nav.jobs')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/sessions" tooltip={t('nav.sessions')}>
                      <Zap />
                      <span>{t('nav.sessions')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/ai-tools" tooltip={t('nav.aiAssistant')}>
                      <Bot />
                      <span>{t('nav.aiAssistant')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/docs" tooltip={t('nav.documentation')}>
                      <GraduationCap />
                      <span>{t('nav.documentation')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/explore" tooltip={t('nav.explore')}>
                      <Compass />
                      <span>{t('nav.explore')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/dashboard/account" tooltip={t('nav.account')}>
                      <User />
                      <span>{t('nav.account')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setIsSettingsOpen(true)} tooltip={t('settings')}>
                    <Settings />
                    <span>{t('settings')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setIsProfileSheetOpen(true)} tooltip={t('nav.userInfo')}>
                    <User />
                    <span>{t('nav.userInfo')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <div className="flex flex-1 flex-col">
            <DashboardHeader onOpenProfile={() => setIsProfileSheetOpen(true)} />
            <main className="flex-1 bg-muted/30 p-4 md:p-6 lg:p-8">{children}</main>
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
    </DashboardProvider >
  )
}
