import { Button, Heading, Text } from "@react-email/components";
import BaseEmailTemplate from "./BaseEmailTemplate";

interface AuthEmailTemplateProps {
  type: "verification" | "reset";
  code?: string;
  resetUrl?: string;
}

export default function AuthEmailTemplate({
  type,
  code,
  resetUrl,
}: AuthEmailTemplateProps) {
  const isVerification = type === "verification";

  return (
    <BaseEmailTemplate
      previewText={
        isVerification
          ? "Vérification de votre email"
          : "Réinitialisation de mot de passe"
      }
    >
      <Heading style={h1}>
        {isVerification
          ? "Vérification de votre email"
          : "Réinitialisation de mot de passe"}
      </Heading>

      {isVerification ? (
        <>
          <Text style={text}>
            Voici votre code de vérification : <strong>{code}</strong>
          </Text>
          <Text style={text}>Ce code expirera dans 10 minutes.</Text>
        </>
      ) : (
        <>
          <Text style={text}>
            Vous avez demandé la réinitialisation de votre mot de passe.
          </Text>
          <Text style={text}>
            Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de
            passe :
          </Text>
          <Button href={resetUrl} style={button}>
            Réinitialiser mon mot de passe
          </Button>
          <Text style={text}>
            Ce lien expirera dans 1 heure. Si vous n'avez pas demandé cette
            réinitialisation, veuillez ignorer cet email.
          </Text>
        </>
      )}

      <Text style={signature}>
        Cordialement,
        <br />
        L'équipe DazNode
      </Text>
    </BaseEmailTemplate>
  );
}

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  marginBottom: "24px",
};

const text = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "16px",
};

const button = {
  backgroundColor: "#4f46e5",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  marginTop: "16px",
  marginBottom: "16px",
};

const signature = {
  color: "#4a4a4a",
  fontSize: "14px",
  lineHeight: "20px",
  marginTop: "32px",
};
