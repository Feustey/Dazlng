import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface AuthEmailTemplateProps {
  type: "verification" | "reset";
  code?: string;
  resetUrl?: string;
}

export const AuthEmailTemplate: React.FC<AuthEmailTemplateProps> = ({
  type,
  code,
  resetUrl,
}) => {
  const isVerification = type === "verification";

  return (
    <Html>
      <Head />
      <Preview>
        {isVerification
          ? "Vérifiez votre adresse email"
          : "Réinitialisation de votre mot de passe"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isVerification
              ? "Vérification de votre email"
              : "Réinitialisation de mot de passe"}
          </Heading>
          <Section style={section}>
            {isVerification ? (
              <>
                <Text style={text}>
                  Pour vérifier votre adresse email, veuillez utiliser le code
                  suivant :
                </Text>
                <Text style={codeStyle}>{code}</Text>
                <Text style={text}>Ce code expirera dans 10 minutes.</Text>
              </>
            ) : (
              <>
                <Text style={text}>
                  Vous avez demandé la réinitialisation de votre mot de passe.
                  Cliquez sur le bouton ci-dessous pour procéder :
                </Text>
                <Button style={button} href={resetUrl}>
                  Réinitialiser le mot de passe
                </Button>
                <Text style={text}>
                  Si vous n'avez pas demandé cette réinitialisation, vous pouvez
                  ignorer cet email.
                </Text>
              </>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const section = {
  padding: "24px",
  backgroundColor: "#f7f7f7",
  borderRadius: "4px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  margin: "16px 0",
};

const text = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const codeStyle = {
  ...text,
  fontSize: "24px",
  fontWeight: "600",
  textAlign: "center" as const,
  letterSpacing: "0.5em",
  padding: "16px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
  margin: "24px 0",
};
