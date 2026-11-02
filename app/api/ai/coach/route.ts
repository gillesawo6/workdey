import { NextRequest, NextResponse } from 'next/server';
import { aiGateway } from '@/lib/ai/gateway';
import { CoachMessageRequest } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local-talent';
  const { allowed, rateLimit } = aiGateway.checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded for Career Coach conversation.',
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
    const body: CoachMessageRequest = await req.json();

    if (!body.user_message) {
      return NextResponse.json(
        { error: 'user_message is required.' },
        { status: 400 }
      );
    }

    const result = await aiGateway.runCareerCoach(body);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error processing coach message' },
      { status: 500 }
    );
  }
}
