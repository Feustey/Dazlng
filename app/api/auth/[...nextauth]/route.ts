import NextAuth from 'next-auth'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import EmailProvider from 'next-auth/providers/email'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest): Promise<Response> {
  const authOptions = {
    providers: [
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
      }),
      // ...autres providers
    ],
    adapter: SupabaseAdapter({
      url: process.env.SUPABASE_URL!,
      secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),
    // ...autres options NextAuth
  }
  return NextAuth(authOptions).auth(request)
}

export async function GET(request: NextRequest): Promise<Response> {
  const authOptions = {
    providers: [
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
      }),
      // ...autres providers
    ],
    adapter: SupabaseAdapter({
      url: process.env.SUPABASE_URL!,
      secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),
    // ...autres options NextAuth
  }
  return NextAuth(authOptions).auth(request)
}
