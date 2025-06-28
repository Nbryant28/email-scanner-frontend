// lib/fetchEmails.ts

export async function fetchInboxEmails(token: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/emails`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store', // ensures fresh data for SSR
      });
  
      if (!res.ok) {
        console.error('❌ fetchInboxEmails failed:', res.statusText);
        return [];
      }
  
      const { emails } = await res.json();
      return emails || [];
    } catch (error) {
      console.error('❌ Error in fetchInboxEmails:', error);
      return [];
    }
  }