import { NextRequest, NextResponse } from 'next/server';
import { aiGateway } from '@/lib/ai/gateway';
import { SkillGapRequest } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local-talent';
  const { allowed, rateLimit } = aiGateway.checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit reached for Skill Gap analysis.',
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
    const body: SkillGapRequest = await req.json();

    if (!body.target_role) {
      return NextResponse.json(
        { error: 'target_role is required.' },
        { status: 400 }
      );
    }

    const result = await aiGateway.analyzeSkillGap(body);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error processing skill-gap analysis' },
      { status: 500 }
    );
  }
}
