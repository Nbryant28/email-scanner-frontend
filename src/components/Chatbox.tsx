'use client';

import { useState } from 'react';
import { MessageSquare, X, Loader2 } from 'lucide-react';

export default function Chatbox() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input) return;
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setResponse(data.result || 'No response received.');
    } catch (error) {
      setResponse('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[90vw] shadow-lg bg-white rounded-xl p-4 border z-50">
      {open ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-gray-800">InboxIQ Assistant</h3>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something like 'how to improve my resume'..."
            className="w-full p-2 border rounded mb-2 text-sm"
            rows={3}
          />

          <button
            onClick={handleAsk}
            className="bg-blue-600 text-white px-4 py-1 text-sm rounded hover:bg-blue-700 w-full flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Thinking...</> : 'Ask InboxIQ'}
          </button>

          {response && (
            <div className="mt-3 p-3 text-sm bg-gray-50 border rounded text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
              {response}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2 hover:bg-blue-700"
        >
          <MessageSquare className="w-4 h-4" /> Ask InboxIQ
        </button>
      )}
    </div>
  );
}
