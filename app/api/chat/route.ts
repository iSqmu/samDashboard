import { NextResponse } from 'next/server';
import { chatWithGemini } from '@/lib/gemini';
import { getUserApiKey } from '@/lib/actions/userSettings';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 },
      );
    }

    const userApiKey = await getUserApiKey();
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'GEMINI_API_KEY no está configurada. Por favor, agrega tu API key en la página de configuración.',
        },
        { status: 500 },
      );
    }

    const result = await chatWithGemini(messages, apiKey);

    return NextResponse.json({
      message: result.response,
      functionCalls: result.functionCalls,
    });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    const errorMessage =
      error.message || error.toString() || 'Failed to process chat request';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
