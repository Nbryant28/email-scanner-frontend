// pages/api/emails/route.ts
import { NextResponse, NextRequest } from 'next/server';
import AWS from 'aws-sdk';

const lambda = new AWS.Lambda({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    console.error("❌ Missing or invalid Authorization header");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const response = await lambda
      .invoke({
        FunctionName: 'FetchEmailsLambda',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({ accessToken }),
      })
      .promise();

    const payloadString = response.Payload?.toString() || '{}';
    const parsed = JSON.parse(payloadString);
    const body = typeof parsed.body === 'string' ? JSON.parse(parsed.body) : parsed;

    const rawEmails = body.emails || [];
    const mappedEmails = rawEmails.map((msg: any) => ({
      id: msg.id,
      subject: msg.subject,
      from: msg.from,
      receivedAt: msg.receivedAt,
      body: msg.body,
      preview: msg.preview,
      keywordsMatched: msg.keywordsMatched,
    }));

    return NextResponse.json({ emails: mappedEmails });
  } catch (error) {
    console.error('❌ Lambda invoke error:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}
