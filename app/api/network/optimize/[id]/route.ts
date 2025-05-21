import { MCPClient } from '@/lib/mcp-client';
import { NextResponse } from 'next/server';

export async function POST(request, context): Promise<Response> {
  try {
    const client = MCPClient.getInstance();
    const result = await client.optimizeNode(context.params.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur d'optimisation:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'optimisation" },
      { status: 500 }
    );
  }
} 