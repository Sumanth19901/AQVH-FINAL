'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function SessionsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
       <div className="flex items-center gap-4 mb-4">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-lg font-semibold md:text-xl">Active Sessions</h1>
      </div>
        <main className="grid flex-1 items-start gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
               <CardDescription>A list of active user sessions will be displayed here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This page is under construction.</p>
            </CardContent>
          </Card>
        </main>
    </div>
  );
}
