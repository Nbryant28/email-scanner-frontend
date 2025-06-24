
"use client";

import { useState, useRef } from "react";
import { Mailbox } from "lucide-react"; // or Inbox if preferred
import { Paperclip, Send, X } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AIPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  

  const handleQuery = async () => {
    if (!query && !file) return;

    const formData = new FormData();
    formData.append("query", query);
    if (file) formData.append("file", file);

    setResponse("Thinking...");
    const res = await fetch("/api/ai", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResponse(data?.text || "No response");
    setQuery("");
    setFile(null);
  };

  
  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };
  

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <motion.div
        className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-xl border"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2 mb-4">
          <Mailbox className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-800">InboxIQ <span className="text-sm text-blue-500">AI Assistant</span></h1>
        </div>

        {response && (
          <motion.div
            className="bg-gray-50 text-sm text-gray-800 whitespace-pre-wrap p-4 rounded-xl border border-gray-200 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {response}
          </motion.div>
        )}

        <div className="space-y-4">
          <textarea
            ref={inputRef}
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full resize-none rounded-xl border p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask something like: 'Improve my resume' or 'Summarize rejection emails'"
          />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="file-upload" className="flex items-center text-sm text-gray-600 cursor-pointer">
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
