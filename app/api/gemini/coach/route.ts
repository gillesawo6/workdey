import { NextRequest, NextResponse } from 'next/server';
import { aiGateway } from '@/lib/ai/gateway';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, context, userMessage } = body;

    const result = await aiGateway.runCareerCoach({
      mode: mode || 'career_strategy',
      user_message: userMessage || 'Hello WorkDey Coach',
      candidate_context: context,
    });

    return NextResponse.json({
      available: result.is_ai_powered,
      ai_status: result.ai_status,
      text: result.text,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        available: false,
        error: error?.message || 'Error communicating with AI service.',
      },
      { status: 500 }
    );
  }
}
