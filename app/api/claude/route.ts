import { NextRequest, NextResponse } from 'next/server';

// Installez le SDK avec : npm install anthropic
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    // history: tableau [{role: 'user'|'assistant', content: string}]
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [
        ...(Array.isArray(history) ? history : []),
        { role: 'user', content: message },
      ],
    });
    return NextResponse.json({
      text: (response.content[0] as any)?.text || '',
      raw: response,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur Claude' }, { status: 500 });
  }
}
