import { NextRequest, NextResponse } from 'next/server';
import { aiGateway } from '@/lib/ai/gateway';
import { CVAssistRequest } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local-talent';
  const { allowed, rateLimit } = aiGateway.checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit reached for CV and cover letter assistance.',
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
    const body: CVAssistRequest = await req.json();

    if (!body.cv_text) {
      return NextResponse.json(
        { error: 'cv_text is required for analysis.' },
        { status: 400 }
      );
    }

    const result = await aiGateway.assistCV(body);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error processing CV assistance' },
      { status: 500 }
    );
  }
}
