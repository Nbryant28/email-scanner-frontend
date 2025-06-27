"use client";

import { useState, useRef, useEffect } from "react";
import { Mailbox, Paperclip, Send, X } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AIPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleQuery = async () => {
    if (!query && !file) return;

    const formData = new FormData();
    formData.append("query", query);
    if (file) formData.append("file", file);

    setResponse((prev) => [...prev, `🧠 You: ${query}`]);
    setQuery("");
    setFile(null);

    const res = await fetch("/api/ai", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResponse((prev) => [...prev, `🤖 InboxIQ: ${data?.text || "No response"}`]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [response]);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-4">
      <motion.div
        className="w-full max-w-3xl flex flex-col bg-white rounded-2xl shadow-xl border overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b bg-white">
          <Mailbox className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-800">
            InboxIQ <span className="text-sm text-blue-500">AI Assistant</span>
          </h1>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
          {response.map((r, i) => (
            <div
              key={i}
              className={`text-sm whitespace-pre-wrap p-3 rounded-lg ${
                r.startsWith("🧠")
                  ? "bg-blue-50 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {r}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Section */}
        <div className="border-t p-4 bg-white space-y-3">
          <textarea
            ref={inputRef}
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full resize-none rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask something like: 'Improve my resume' or 'Summarize rejection emails'"
          />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="file-upload"
                className="flex items-center text-sm text-gray-600 cursor-pointer"
              >
                <Paperclip className="w-4 h-4 mr-1" />
                Choose File
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              {file && (
                <div className="flex items-center text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {file.name}
                  <X
                    className="ml-1 w-4 h-4 text-gray-600 cursor-pointer"
                    onClick={() => setFile(null)}
                  />
                </div>
              )}
            </div>

            <Button onClick={handleQuery} className="bg-black hover:bg-gray-900">
              <Send className="w-4 h-4 mr-1" /> Ask InboxIQ
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
