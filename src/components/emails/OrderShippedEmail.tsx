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

interface OrderShippedEmailProps {
  orderNumber: string;
  customerName: string;
  trackingNumber: string;
  trackingUrl: string;
}

export default function OrderShippedEmail({
  orderNumber,
  customerName,
  trackingNumber,
  trackingUrl,
}: OrderShippedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Votre commande DazNode #{orderNumber} a été expédiée</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Votre commande a été expédiée</Heading>

          <Text style={text}>Bonjour {customerName},</Text>

          <Text style={text}>
            Nous sommes ravis de vous informer que votre commande DazNode #
            {orderNumber} a été expédiée.
          </Text>

          <Section style={trackingDetails}>
            <Text style={trackingNumberStyle}>
              Numéro de suivi : {trackingNumber}
            </Text>

            <Button href={trackingUrl} style={button}>
              Suivre mon colis
            </Button>
          </Section>

          <Text style={text}>
            Vous pouvez suivre l'état de votre livraison en utilisant le numéro
            de suivi ci-dessus. Le transporteur vous informera également des
            mises à jour importantes concernant votre livraison.
          </Text>

          <Text style={text}>
            Si vous avez des questions, n'hésitez pas à nous contacter à
            support@daznode.com
          </Text>

          <Text style={footer}>
            Cordialement,
            <br />
            L'équipe DazNode
          </Text>
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

const trackingDetails = {
  backgroundColor: "#f9f9f9",
  padding: "24px",
  borderRadius: "4px",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const trackingNumberStyle = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
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
};

const footer = {
  color: "#4a4a4a",
  fontSize: "14px",
  lineHeight: "20px",
  marginTop: "32px",
};
