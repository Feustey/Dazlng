import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const API_BASE_URL = 'https://api.dazno.de/api/v1';
const JWT_SECRET = process.env.JWT_SECRET ?? "" || 'gww2ZhqbmABxnX3k0qVWx0nib7-eNiqIP33ED2-rCuc';

async function generateJWT() {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);
  return jwt;
}

export async function GET(
  request: Request,
  { params }: { params: { pubkey: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'info';
    
    const jwt = await generateJWT();
    
    const response = await fetch(`${API_BASE_URL}/node/${params.pubkey}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Erreur proxy API:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'PROXY_ERROR',
        message: error instanceof Error ? error.message : 'Erreur proxy API'
      }
    }, { status: 500 });
  }
}
