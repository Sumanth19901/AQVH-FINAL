import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/providers/client-providers";
import { Inter, Source_Code_Pro } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Quantum Sentinel",
  description: "A real-time monitoring dashboard for quantum computing jobs and backend systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceCodePro.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ClientProviders>
          {children}
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
