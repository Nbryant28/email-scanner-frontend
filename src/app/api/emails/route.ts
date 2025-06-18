// src/app/api/emails/route.ts

import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

const lambda = new AWS.Lambda({
  region: 'us-east-1', // Change to your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const response = await lambda
      .invoke({
        FunctionName: 'fetchEmails', // or use full ARN
        InvocationType: 'RequestResponse',
      })
      .promise();

    const payload = JSON.parse(response.Payload as string);
    return NextResponse.json(payload);
  } catch (error) {
    console.error('Lambda invoke error:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}
