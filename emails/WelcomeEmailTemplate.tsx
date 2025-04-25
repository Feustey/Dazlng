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
  Img,
} from "@react-email/components";

interface WelcomeEmailTemplateProps {
  firstName: string;
  dashboardUrl: string;
}

export const WelcomeEmailTemplate: React.FC<WelcomeEmailTemplateProps> = ({
  firstName,
  dashboardUrl,
}) => {
  return (
    <Html>
      <Head />
      <Preview>
        Bienvenue sur DazLng - Votre portail vers le Lightning Network
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://dazlng.com/logo.png"
              width="120"
              height="40"
              alt="DazLng"
              style={logo}
            />
          </Section>
          <Section style={content}>
            <Heading style={h1}>Bienvenue sur DazLng !</Heading>
            <Text style={text}>Bonjour {firstName},</Text>
            <Text style={text}>
              Nous sommes ravis de vous accueillir dans l'écosystème DazLng.
              Votre compte a été créé avec succès et vous êtes maintenant prêt à
              explorer le monde du Lightning Network.
            </Text>
            <Text style={text}>
              Pour commencer votre voyage, cliquez sur le bouton ci-dessous :
            </Text>
            <Button style={button} href={dashboardUrl}>
              Accéder au tableau de bord
            </Button>
            <Text style={text}>
              Voici ce que vous pouvez faire dès maintenant :
            </Text>
            <ul style={list}>
              <li style={listItem}>Configurer votre premier nœud Lightning</li>
              <li style={listItem}>Explorer les canaux de paiement</li>
              <li style={listItem}>Découvrir nos outils d'analyse</li>
            </ul>
            <Text style={text}>
              Besoin d'aide ? Notre équipe de support est là pour vous
              accompagner.
            </Text>
            <Text style={text}>À bientôt sur DazLng !</Text>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              © 2024 DazLng. Tous droits réservés.
            </Text>
            <Text style={footerText}>
              <a href="https://dazlng.com/about" style={link}>
                À propos
              </a>{" "}
              •
              <a href="https://dazlng.com/help" style={link}>
                Aide
              </a>{" "}
              •
              <a href="https://dazlng.com/privacy" style={link}>
                Confidentialité
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#0a0a0a",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
};

const header = {
  padding: "24px",
  backgroundColor: "#0a0a0a",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const content = {
  padding: "32px 24px",
  backgroundColor: "#ffffff",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const text = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 24px",
  margin: "24px 0",
  width: "100%",
  maxWidth: "280px",
  marginLeft: "auto",
  marginRight: "auto",
};

const list = {
  margin: "16px 0",
  paddingLeft: "24px",
};

const listItem = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "8px 0",
};

const footer = {
  padding: "24px",
  backgroundColor: "#f7f7f7",
  textAlign: "center" as const,
};

const footerText = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
};

const link = {
  color: "#000000",
  textDecoration: "none",
  margin: "0 8px",
};
