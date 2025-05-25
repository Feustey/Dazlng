import { NextRequest, NextResponse } from 'next/server';

// Placeholder pour NextAuth
export async function GET(_request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ message: 'NextAuth endpoint placeholder' });
}

export async function POST(_request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ message: 'NextAuth endpoint placeholder' });
}
