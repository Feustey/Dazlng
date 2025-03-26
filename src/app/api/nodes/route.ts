import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Node from '@/models/Node';

export async function GET() {
  try {
    await connectToDatabase();
    const nodes = await Node.find({});
    return NextResponse.json(nodes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch nodes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const node = new Node(body);
    await node.save();
    return NextResponse.json(node);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create node' }, { status: 500 });
  }
} 