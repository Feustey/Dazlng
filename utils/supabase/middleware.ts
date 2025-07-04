import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export function createSupabaseMiddlewareClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          const response = NextResponse.next({
            request,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          const response = NextResponse.next({
            request,
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
}
