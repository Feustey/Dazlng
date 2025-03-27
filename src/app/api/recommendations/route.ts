import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Tu es un expert en streaming et films. Tu dois recommander 3 films ou séries en fonction des goûts de l'utilisateur."
        },
        {
          role: "user",
          content: "Suggère-moi 3 films ou séries populaires du moment"
        }
      ],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({ 
      recommendations: completion.choices[0].message.content 
    });
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des recommandations' },
      { status: 500 }
    );
  }
} 