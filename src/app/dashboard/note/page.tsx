'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function NotePage() {
  const [note, setNote] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const savedNote = localStorage.getItem('dashboard-note');
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('dashboard-note', note);
    toast({
      title: 'Note Saved',
      description: 'Your note has been successfully saved.',
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
            </Button>
            <div>
                <h1 className="text-2xl font-semibold">Scratchpad</h1>
                <p className="text-muted-foreground">A simple place to jot down notes.</p>
            </div>
        </div>
      <Card>
        <CardContent className="pt-6">
          <Textarea
            placeholder="Type your notes here... They will be saved locally in your browser."
            className="min-h-[400px] text-base"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </CardContent>
      </Card>
      <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Note
          </Button>
        </div>
    </div>
  );
}
