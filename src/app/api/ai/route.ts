

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const assistantName = 'InboxIQ';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const query = formData.get('query') as string;
    const file = formData.get('file') as File | null;

    let fileText = '';
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      fileText = new TextDecoder().decode(arrayBuffer);
    }

    // ✅ Fetch emails here inside the POST handler
    const resEmails = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/emails`);
    const { emails } = await resEmails.json();

    const emailData = emails
      .map((email: any) => `Subject: ${email.subject}\nBody: ${email.body}`)
      .join('\n\n');

    const systemPrompt = `
You are ${assistantName}, the AI assistant in an app called Email Tracker, built to help users track job-related emails, analyze rejections, and improve resumes.
You can review resume files, summarize inbox insights, and give tips for job hunting.
Always keep your responses focused on helping the user improve their job application process.
`;

    const fullPrompt = `
${query ? `User query: ${query}` : ''}
${fileText ? `\nResume contents:\n${fileText}` : ''}
${emailData ? `\nInbox Emails:\n${emailData}` : ''}
`.trim();

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: fullPrompt },
      ],
      temperature: 0.7,
    });

    const result = chatResponse.choices[0].message.content;
    return NextResponse.json({ text: result });
  } catch (err: any) {
    console.error('❌ OpenAI Error:', err.message);
    return NextResponse.json({ error: 'Failed to fetch AI response' }, { status: 500 });
  }
}
