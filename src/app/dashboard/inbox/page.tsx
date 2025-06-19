'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MailX } from 'lucide-react';
import { useSession } from "next-auth/react";

type Email = {
  id: string;
  subject: string;
  from: string;
  receivedAt: string;
};

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  useEffect(() => {
    console.log('Session data:', session);}, [session]);
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch('/api/emails');
        const data = await res.json();
        setEmails(data.emails || []);
      } catch (error) {
        console.error('Failed to fetch emails', error);
        setEmails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" /> {/* Subject */}
            <Skeleton className="h-4 w-1/2" /> {/* From */}
            <Skeleton className="h-3 w-1/3" /> {/* Timestamp */}
          </Card>
        ))}
      </div>
    );
  }

  if (!emails || emails.length === 0) {
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
        <Card key={email.id} className="p-4 hover:shadow-md transition">
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
      ))}
    </div>
  );
}
