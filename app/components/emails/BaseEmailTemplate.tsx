import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BaseEmailTemplateProps {
  children: React.ReactNode;
  previewText: string;
  logoUrl?: string;
}

export default function BaseEmailTemplate({
  children,
  previewText,
  logoUrl = "https://daznode.com/images/brand/logo.png",
}: BaseEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src={logoUrl}
              width="150"
              height="50"
              alt="DazNode"
              style={logo}
            />
          </Section>

          {children}

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} DazNode. Tous droits réservés.
            </Text>
            <Text style={footerLinks}>
              <Link href="https://twitter.com/daznode" style={link}>
                Twitter
              </Link>
              {" • "}
              <Link href="https://t.me/daznode" style={link}>
                Telegram
              </Link>
              {" • "}
              <Link href="https://github.com/daznode" style={link}>
                GitHub
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const logoContainer = {
  padding: "20px 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const footer = {
  borderTop: "1px solid #eaeaea",
  marginTop: "32px",
  paddingTop: "32px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const footerLinks = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0",
};

const link = {
  color: "#4f46e5",
  textDecoration: "underline",
};
