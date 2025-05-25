import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ message: 'Auth check endpoint placeholder' });
}

export async function POST(_request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ message: 'Auth check endpoint placeholder' });
}
