// app/inbox/page.tsx
import { getSessionOnServer } from '@/lib/auth';
import { fetchInboxEmails } from '@/lib/fetchEmails';
import InboxClient from './InboxClient';

export default async function InboxPage() {
  const session = await getSessionOnServer();
 console.log("🔐 Session in InboxPage:", session);
  if (!session?.accessToken) {
    return (
      <div className="text-center text-gray-500 py-10">
        You must be signed in to view your inbox.
      </div>
    );
  }

  const emails = await fetchInboxEmails(session.accessToken);

  return <InboxClient emails={emails} />;
}