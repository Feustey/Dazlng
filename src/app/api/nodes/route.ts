import { NextResponse } from 'next/server';
import sparkseerService from '@/lib/sparkseerService';

export async function GET() {
  try {
    const data = await sparkseerService.getAllNodes();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Sparkseer data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 