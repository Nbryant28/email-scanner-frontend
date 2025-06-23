'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

type DashboardData = {
  totalEmails: number;
  topKeywords: { keyword: string; count: number }[];
};

export default function DashboardStats() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const json = await res.json();

        const topKeywords = (json.stats || [])
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 3);

        setData({
          totalEmails: (json.stats || []).reduce(
            (sum: number, k: any) => sum + k.count,
            0
          ),
          topKeywords,
        });
      } catch (err) {
        console.error('📉 Failed to load stats:', err);
      }
    };

    fetchStats();
  }, []);

  if (!data) return <p className="text-gray-500">Loading your job stats...</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-6">
        <h3 className="text-lg font-semibold">📬 Job-related Emails</h3>
        <p className="text-3xl font-bold mt-2">{data.totalEmails}</p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold">🔥 Top Keywords</h3>
        <ul className="mt-2 text-sm text-gray-600 space-y-1">
          {data.topKeywords.map((kw) => (
            <li key={kw.keyword}>
              {kw.keyword} — <span className="font-semibold">{kw.count}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
