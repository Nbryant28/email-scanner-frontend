'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';
import { Bot, Loader2, FileText, X } from 'lucide-react';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export default function AIAssistantPage() {
  const [input, setInput] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

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

  const handleClearFile = () => {
    setFileName(null);
    setResumeText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">InboxIQ</h2>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          AI Assistant
        </span>
      </div>

      {/* AI Response */}
      {response && (
        <div className="bg-gray-50 border p-4 rounded-lg shadow-inner whitespace-pre-wrap text-sm text-gray-800">
          {response}
        </div>
      )}

      {/* Prompt & Upload */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4 border">
        <Textarea
          placeholder="Ask something like: 'Improve my resume' or 'Summarize my rejection emails'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
        />

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <FileText className="w-4 h-4 text-gray-500" />
          <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} />

          {fileName && (
            <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
              <span className="mr-2">{fileName}</span>
              <button
                onClick={handleClearFile}
                className="hover:text-red-500 text-gray-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </span>
          ) : (
            'Ask InboxIQ'
          )}
        </Button>
      </div>
    </div>
  );
}
