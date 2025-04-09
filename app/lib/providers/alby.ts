import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

interface AlbyProfile {
  id: string;
  name: string;
  email: string;
  lightning_address: string;
  nodes: Array<{
    pubkey: string;
  }>;
}

export default function AlbyProvider<P extends AlbyProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  const defaultOptions = {
    id: "alby",
    name: "Alby",
    type: "oauth" as const,
    wellKnown: "https://api.getalby.com/.well-known/openid-configuration",
    authorization: {
      params: {
        scope: "openid email profile",
      },
    },
    token: "https://api.getalby.com/oauth/token",
    userinfo: "https://api.getalby.com/oauth/userinfo",
    profile(profile: P) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        lightningAddress: profile.lightning_address,
        nodePubkey: profile.nodes?.[0]?.pubkey,
      };
    },
  };

  // Éviter que les checks n'incluent 'nonce'
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  // Assurez-vous que les checks sont limités aux valeurs autorisées
  if (mergedOptions.checks) {
    mergedOptions.checks = mergedOptions.checks.filter((check) =>
      ["state", "pkce", "none"].includes(check)
    ) as OAuthConfig<P>["checks"];
  }

  return mergedOptions as OAuthConfig<P>;
}
