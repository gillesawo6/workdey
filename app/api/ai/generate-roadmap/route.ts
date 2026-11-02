import { NextRequest, NextResponse } from 'next/server';
import { aiGateway } from '@/lib/ai/gateway';
import { RoadmapGenerateRequest } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local-talent';
  const { allowed, rateLimit } = aiGateway.checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit reached for Career Roadmap generation.',
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
    const body: RoadmapGenerateRequest = await req.json();

    if (!body.target_role) {
      return NextResponse.json(
        { error: 'target_role is required to generate a career roadmap.' },
        { status: 400 }
      );
    }

    const result = await aiGateway.generateRoadmap(body);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error generating career roadmap' },
      { status: 500 }
    );
  }
}
