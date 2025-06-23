'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type StatsData = {
  keyword: string;
  count: number;
};

export default function StatsPage() {
  const [data, setData] = useState<StatsData[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/stats');
      const json = await res.json();
      setData(json.stats || []);
      setTotal(json.stats.reduce((acc: number, item: any) => acc + item.count, 0));
    };
  
    fetchStats();
  }, []);
  

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Total Job-Related Emails</h2>
        <p className="text-3xl font-bold">{total}</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Keyword Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="keyword" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
