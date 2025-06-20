#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Variables d'environnement temporaires pour le build
const envContent = `# Configuration temporaire pour le build
# ⚠️ REMPLACEZ CES VALEURS PAR VOS VRAIES VARIABLES D'ENVIRONNEMENT

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_ANON_KEY=your-anon-key-here

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Email Configuration
RESEND_API_KEY=your-resend-api-key-here

# Lightning Network Configuration
LND_TLS_CERT=your-lnd-tls-cert-here
LND_ADMIN_MACAROON=your-lnd-admin-macaroon-here
LND_SOCKET=localhost:10009

# DazNode Wallet Configuration
DAZNODE_WALLET_SECRET=your-daznode-wallet-secret-here

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Umami Analytics
UMAMI_WEBSITE_ID=your-umami-website-id-here
UMAMI_API_KEY=your-umami-api-key-here

# JWT Secret
JWT_SECRET=your-jwt-secret-here

# Alby Configuration
ALBY_API_TOKEN=your-alby-api-token-here

# ⚠️ ATTENTION: Ce fichier contient des valeurs temporaires
# Veuillez les remplacer par vos vraies variables d'environnement
`;

const envPath = path.join(__dirname, '..', '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env.local créé avec succès');
  console.log('⚠️  Veuillez remplacer les valeurs temporaires par vos vraies variables d\'environnement');
  console.log(`📁 Fichier créé: ${envPath}`);
} catch (error) {
  console.error('❌ Erreur lors de la création du fichier .env.local:', error.message);
  process.exit(1);
} 