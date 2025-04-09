import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Link,
} from "@react-email/components";

interface OrderShippedEmailProps {
  id: string;
  customerName: string;
  trackingNumber: string;
  trackingUrl: string;
}

export default function OrderShippedEmail({
  id,
  customerName,
  trackingNumber,
  trackingUrl,
}: OrderShippedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Votre commande DazNode #{id} a été expédiée</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Votre commande a été expédiée !</Heading>
          <Text style={text}>
            Bonjour {customerName},
            <br />
            Votre commande #{id} a été expédiée.
          </Text>

          <Text style={text}>
            <strong>Numéro de suivi :</strong> {trackingNumber}
            <br />
            <Link href={trackingUrl} style={link}>
              Suivre votre colis
            </Link>
          </Text>

          <Text style={text}>
            Si vous avez des questions, n&apos;hésitez pas à nous contacter.
          </Text>

          <Text style={footer}>
            Merci de votre confiance,
            <br />
            L&apos;équipe DazNode
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.4",
  margin: "48px 0",
  textAlign: "center" as const,
};

const text = {
  color: "#1a1a1a",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "24px 0",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "24px",
  margin: "48px 0 24px",
  textAlign: "center" as const,
};
