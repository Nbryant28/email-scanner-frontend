'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';
import { Bot, Loader2, FileText } from 'lucide-react';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export default function AIAssistantPage() {
  const [input, setInput] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleSubmit = async () => {
    if (!input && !resumeText) return;
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${input}\n\nResume:\n${resumeText}`,
        }),
      });
      const data = await res.json();
      setResponse(data.result || 'No response received.');
      setInput(''); // clear input after submit
    } catch (error) {
      setResponse('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map((item: any) => item.str).join(' ') + '\n';
      }

      setResumeText(fullText);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result?.toString();
        if (text) setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-2xl w-full p-6 rounded-xl shadow-lg space-y-6">
        <div className="flex items-center gap-2">
          <Bot className="text-blue-600 w-5 h-5" />
          <h1 className="text-xl font-bold">InboxIQ</h1>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">AI Assistant</span>
        </div>

        {response && (
          <div className="bg-gray-50 border p-4 rounded-md text-sm max-h-64 overflow-auto whitespace-pre-wrap">
            {response}
          </div>
        )}

        <div className="space-y-4">
          <Textarea
            placeholder="Ask something like: 'Improve my resume' or 'Summarize rejection emails'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="w-full"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4 text-gray-500" />
              <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} />
              {resumeText && (
                <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {fileName} <button onClick={() => setResumeText('')}>✖</button>
                </span>
              )}
            </div>
            <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask InboxIQ'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
