'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MailX } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type Email = {
  id: string;
  subject: string;
  from: string;
  receivedAt: string;
  preview?: string;
  body?: string;
};

const fetchEmails = async (): Promise<Email[]> => {
  const res = await fetch('/api/emails');
  const data = await res.json();
  return data.emails || [];
};

export default function InboxPage() {
  const { data: session } = useSession();
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const {
    data: emails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['emails'],
    queryFn: fetchEmails,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !emails || emails.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <MailX className="mx-auto mb-2 h-10 w-10" />
        <p>No emails found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <Dialog key={email.id}>
          <DialogTrigger asChild>
            <Card
              className="p-4 hover:shadow-md transition cursor-pointer"
              onClick={() => setSelectedEmail(email)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{email.subject}</h3>
                <span className="text-xs text-gray-400">
                  {new Date(email.receivedAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                From: <span className="font-medium">{email.from}</span>
              </p>
            </Card>
          </DialogTrigger>

          <DialogContent className="max-w-xl">
            {selectedEmail && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedEmail.subject}</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">
                    From: {selectedEmail.from}
                    <br />
                    Received: {new Date(selectedEmail.receivedAt).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>

                {selectedEmail.preview ? (
                  <div className="mt-4 text-sm text-gray-800 whitespace-pre-wrap">
                    {selectedEmail.preview.trim()}
                  </div>
                ) : selectedEmail.body ? (
                  <div
                    className="mt-4 prose prose-sm max-w-none text-gray-800 dark:prose-invert overflow-x-auto"
                    dangerouslySetInnerHTML={{
                      __html: email.body
                        .replace(/style="[^"]*"/g, '')
                        .replace(/<table/g, '<table class="table-auto border border-gray-300"')
                        .replace(/<td/g, '<td class="border border-gray-200 px-2 py-1"')
                        .replace(/<tr/g, '<tr class="even:bg-gray-50"'),
                    }}
                  />
                ) : (
                  <p className="text-sm text-gray-500 mt-4">No content available.</p>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}