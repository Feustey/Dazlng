import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactEmailTemplateProps {
  type: "admin" | "user";
  firstName: string;
  lastName: string;
  email: string;
  interest: string;
  message?: string;
}

export const ContactEmailTemplate: React.FC<ContactEmailTemplateProps> = ({
  type,
  firstName,
  lastName,
  email,
  interest,
  message,
}) => {
  const isAdmin = type === "admin";

  return (
    <Html>
      <Head />
      <Preview>
        {isAdmin
          ? `Nouveau message de contact de ${firstName} ${lastName}`
          : "Confirmation de votre message - DazNode"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isAdmin
              ? "Nouveau message de contact"
              : "Confirmation de votre message"}
          </Heading>
          <Section style={section}>
            {isAdmin ? (
              <>
                <Text style={text}>
                  De: {firstName} {lastName}
                </Text>
                <Text style={text}>Email: {email}</Text>
                <Text style={text}>Intérêt: {interest}</Text>
                {message && (
                  <>
                    <Text style={text}>Message:</Text>
                    <Text style={text}>{message}</Text>
                  </>
                )}
              </>
            ) : (
              <>
                <Text style={text}>Bonjour {firstName},</Text>
                <Text style={text}>
                  Nous avons bien reçu votre message concernant {interest}.
                  Notre équipe vous répondra dans les plus brefs délais.
                </Text>
                <Text style={text}>Merci de votre intérêt pour DazNode !</Text>
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
