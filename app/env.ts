import getConfig from "next/config";

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

// Vérification des variables d'environnement requises
const requiredEnvVars = [
  "NEXT_PUBLIC_ALBY_PUBLIC_KEY",
  "ALBY_SECRET",
  "ALBY_RELAY_URL",
  "ALBY_LUD16",
  "ALBY_WEBHOOK_SECRET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_API_URL",
  "MCP_API_URL",
  "MCP_API_KEY",
  "MCP_WEBHOOK_SECRET",
  "NODE_PUBKEY",
  "NEXT_PUBLIC_WEBHOOK_URL",
];

const getEnvVar = (key: string): string => {
  if (key.startsWith("NEXT_PUBLIC_")) {
    return publicRuntimeConfig[key] || process.env[key] || "";
  }
  return serverRuntimeConfig[key] || process.env[key] || "";
};

for (const envVar of requiredEnvVars) {
  if (!getEnvVar(envVar)) {
    throw new Error(`La variable d'environnement ${envVar} est requise`);
  }
}

export const envVars = {
  ALBY_PUBLIC_KEY: getEnvVar("NEXT_PUBLIC_ALBY_PUBLIC_KEY"),
  ALBY_SECRET: getEnvVar("ALBY_SECRET"),
  ALBY_RELAY_URL: getEnvVar("ALBY_RELAY_URL"),
  ALBY_LUD16: getEnvVar("ALBY_LUD16"),
  ALBY_WEBHOOK_SECRET: getEnvVar("ALBY_WEBHOOK_SECRET"),
  SUPABASE_URL: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
  SUPABASE_ANON_KEY: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  API_URL: getEnvVar("NEXT_PUBLIC_API_URL"),
  MCP_API_URL: process.env.MCP_API_URL!,
  MCP_API_KEY: process.env.MCP_API_KEY!,
  MCP_WEBHOOK_SECRET: process.env.MCP_WEBHOOK_SECRET!,
  NODE_PUBKEY: process.env.NODE_PUBKEY!,
  WEBHOOK_URL: getEnvVar("NEXT_PUBLIC_WEBHOOK_URL"),
};
