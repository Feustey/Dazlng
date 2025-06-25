import { NextResponse } from 'next/server';

export async function GET(): Promise<Response> {
  return NextResponse.json({
    supabase_config: {
      url_exists: !!(process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""),
      key_exists: !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""),
      alt_url_exists: !!(process.env.SUPABASE_URL ?? ""),
      url_preview: (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")?.substring(0, 20) + '...',
      environment: process.env.NODE_ENV ?? "",
      vercel_env: (process.env.VERCEL_ENV ?? "") || 'not-vercel'
    }
  });
}
