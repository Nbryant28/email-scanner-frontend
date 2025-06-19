// src/app/api/emails/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import AWS from 'aws-sdk';

const lambda = new AWS.Lambda({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
    const token = await getToken({ req });
    console.log("🔑 Decoded token:", token);

    if (!token?.accessToken) {
        console.error("🔒 Missing access token in session");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
  
    try {
      const response = await lambda
        .invoke({
          FunctionName: 'FetchEmailsLambda',
          InvocationType: 'RequestResponse',
          Payload: JSON.stringify({ accessToken: token.accessToken }),
        })
        .promise();
  
      const payloadString = response.Payload?.toString() || '{}';
      const payload = JSON.parse(payloadString);
  
      return NextResponse.json(payload);
    } catch (error) {
      console.error('❌ Lambda invoke error:', error);
      return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
    }
  }