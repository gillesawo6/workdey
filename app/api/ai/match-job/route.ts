import { NextRequest, NextResponse } from 'next/server';
import { aiGateway } from '@/lib/ai/gateway';
import { JobMatchRequest } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  // Rate limiting by client IP or forwarded header
  const ip = req.headers.get('x-forwarded-for') || 'local-client';
  const { allowed, rateLimit } = aiGateway.checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Too many AI match requests. Please wait a few seconds.',
        rate_limit: rateLimit,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.reset_seconds),
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  }

  try {
    const body: JobMatchRequest = await req.json();

    if (!body.job || !body.talent_profile) {
      return NextResponse.json(
        { error: 'Invalid payload: job and talent_profile are required.' },
        { status: 400 }
      );
    }

    const result = await aiGateway.matchJobForTalent(body);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error processing job match' },
      { status: 500 }
    );
  }
}
