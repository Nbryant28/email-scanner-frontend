import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';
import AWS from 'aws-sdk';
import { getToken } from 'next-auth/jwt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const assistantName = 'InboxIQ';

async function fetchEmailsFromLambda(req:NextRequest): Promise<string> {
  const token = await getToken({ req });
  if (!token?.accessToken) {
    console.error("🔒 No access token found");
    return "No email data available (user not authenticated).";
  }

  const lambda = new AWS.Lambda({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  try {
    const lambdaRes = await lambda
      .invoke({
        FunctionName: 'FetchEmailsLambda',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({
          accessToken: token.accessToken,
          useeEmail: token.email,
        }),
      })
      .promise();

    const payloadString = lambdaRes.Payload?.toString() || '{}';
    const parsed = JSON.parse(payloadString);
    const body = typeof parsed.body === 'string' ? JSON.parse(parsed.body) : parsed;
    const emails = body.emails || [];

    if (!emails.length) return "No job-related emails found.";

    return emails
      .map((email: any) => `Subject: ${email.subject}\nBody: ${email.body}`)
      .join("\n\n");
  } catch (error) {
    console.error("❌ Lambda fetch failed:", error);
    return "Failed to retrieve emails from Lambda.";
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const query = formData.get('query') as string;
    const file = formData.get('file') as File | null;

    let fileText = '';
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      fileText = new TextDecoder().decode(arrayBuffer);
    }

    const emailData = await fetchEmailsFromLambda(req);

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
