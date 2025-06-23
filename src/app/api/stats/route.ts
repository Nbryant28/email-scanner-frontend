import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient();

export async function GET() {
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
  };

  try {
    const data = await dynamo.scan(params).promise();
    const items = data.Items || [];

    const keywordCounts: Record<string, number> = {};

    items.forEach((item) => {
      const keywords: string[] = item.keywordsMatched || [];
      keywords.forEach((kw) => {
        keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
      });
    });

    const stats = Object.entries(keywordCounts).map(([keyword, count]) => ({
      keyword,
      count,
    }));

    return NextResponse.json({ stats });
  } catch (err) {
    console.error('❌ Failed to get stats:', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
