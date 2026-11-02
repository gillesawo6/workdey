import { NextRequest, NextResponse } from 'next/server';
import { aiGateway } from '@/lib/ai/gateway';

export async function GET(req: NextRequest) {
  try {
    const health = aiGateway.getHealthStatus();
    return NextResponse.json(health, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to inspect AI Gateway health' },
      { status: 500 }
    );
  }
}
