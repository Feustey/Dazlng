# Migration NextAuth → Supabase Auth

## Routes NextAuth existantes
- app/api/auth/[...nextauth]/route.ts
- app/api/auth/route.ts
- app/api/auth/me/route.ts
- app/api/auth/login-node/
- app/api/auth/send-code/
- app/api/auth/verify-code/
- app/api/auth/verify-otp/
- app/api/auth/wallet/
- app/api/auth/verify-wallet/
- app/api/auth/check/
- app/api/auth/lightning/
- app/api/auth/lnurl-auth/

## Fichiers de configuration NextAuth
- nextauth.js
- lib/auth.ts
- types/next-auth.d.ts
- app/providers/SessionProvider.tsx
- middleware.ts (utilise NextAuth) 