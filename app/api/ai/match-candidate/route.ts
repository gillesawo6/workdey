import { NextRequest, NextResponse } from 'next/server';
import { aiGateway } from '@/lib/ai/gateway';
import { CandidateMatchRequest } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local-employer';
  const { allowed, rateLimit } = aiGateway.checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded for candidate matching.',
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
    const body: CandidateMatchRequest = await req.json();

    if (!body.job || !body.candidate) {
      return NextResponse.json(
        { error: 'Invalid payload: job and candidate are required.' },
        { status: 400 }
      );
    }

    const result = await aiGateway.matchCandidateForEmployer(body);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error processing candidate match' },
      { status: 500 }
    );
  }
}
