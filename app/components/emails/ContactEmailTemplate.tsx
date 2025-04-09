import { Heading, Section, Text } from "@react-email/components";
import BaseEmailTemplate from "./BaseEmailTemplate";

interface ContactEmailTemplateProps {
  type: "admin" | "user";
  firstName: string;
  lastName: string;
  email: string;
  interest: string;
  message?: string;
}

export default function ContactEmailTemplate({
  type,
  firstName,
  lastName,
  email,
  interest,
  message,
}: ContactEmailTemplateProps) {
  const isAdmin = type === "admin";

  return (
    <BaseEmailTemplate
      previewText={
        isAdmin
          ? `[Contact DazNode] ${interest} - ${firstName} ${lastName}`
          : "Confirmation de votre message - DazNode"
      }
    >
      <Heading style={h1}>
        {isAdmin
          ? "Nouveau message de contact"
          : "Merci de nous avoir contacté !"}
      </Heading>

      {isAdmin ? (
        <>
          <Section style={contactDetails}>
            <Text style={text}>
              <strong>Nom :</strong> {firstName} {lastName}
            </Text>
            <Text style={text}>
              <strong>Email :</strong> {email}
            </Text>
            <Text style={text}>
              <strong>Intérêt :</strong> {interest}
            </Text>
            {message && (
              <>
                <Text style={text}>
                  <strong>Message :</strong>
                </Text>
                <Text style={messageText}>{message}</Text>
              </>
            )}
          </Section>
        </>
      ) : (
        <>
          <Text style={text}>Cher/Chère {firstName},</Text>
          <Text style={text}>
            Nous avons bien reçu votre message et nous vous répondrons dans les
            plus brefs délais.
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

const contactDetails = {
  backgroundColor: "#f9f9f9",
  padding: "24px",
  borderRadius: "4px",
  marginBottom: "24px",
};

const messageText = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "16px",
  whiteSpace: "pre-wrap" as const,
};

const signature = {
  color: "#4a4a4a",
  fontSize: "14px",
  lineHeight: "20px",
  marginTop: "32px",
};
