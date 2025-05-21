import { MCPClient } from '@/lib/mcp-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, context: { params: { id: string } }): Promise<Response> {
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