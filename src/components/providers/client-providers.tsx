"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { Suspense } from "react";
import { Loader } from "../ui/loader";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader /></div>}>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </Suspense>
    </ThemeProvider>
  );
}
