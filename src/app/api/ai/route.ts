// For App Router: src/app/api/ai/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
const assistantName = 'InboxIQ';
export async function POST(req: Request) {
  try {
    
    const systemPrompt = `
You are ${assistantName}, the AI assistant in an app called Email Tracker, built to help users track job-related emails, analyze rejections, and improve resumes.
You can review resume files, summarize inbox insights, and give tips for job hunting.
Always keep your responses focused on helping the user improve their job application process.
`;
    const { prompt } = await req.json();

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt  },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const result = chatResponse.choices[0].message.content;

    return NextResponse.json({ result });
  } catch (err: any) {
    console.error('❌ OpenAI Error:', err.message);
    return NextResponse.json({ error: 'Failed to fetch AI response' }, { status: 500 });
  }
}
