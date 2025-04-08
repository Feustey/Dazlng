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

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  deliveryAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    email: string;
  };
  deliveryOption: {
    name: string;
    estimatedDays: string;
  };
  total: number;
}

export default function OrderConfirmationEmail({
  orderNumber,
  customerName,
  deliveryAddress,
  deliveryOption,
  total,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirmation de votre commande DazNode #{orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Confirmation de commande</Heading>

          <Text style={text}>Bonjour {customerName},</Text>

          <Text style={text}>
            Nous vous remercions pour votre commande de DazNode. Voici un
            récapitulatif de votre commande :
          </Text>

          <Section style={orderDetails}>
            <Text style={orderNumberStyle}>Commande #{orderNumber}</Text>

            <Text style={text}>
              <strong>Adresse de livraison :</strong>
              <br />
              {deliveryAddress.firstName} {deliveryAddress.lastName}
              <br />
              {deliveryAddress.address}
              <br />
              {deliveryAddress.postalCode} {deliveryAddress.city}
              <br />
              {deliveryAddress.country}
            </Text>

            <Text style={text}>
              <strong>Option de livraison :</strong>
              <br />
              {deliveryOption.name}
              <br />
              Délai estimé : {deliveryOption.estimatedDays}
            </Text>

            <Text style={totalStyle}>
              <strong>Total :</strong> {total.toFixed(2)} €
            </Text>
          </Section>

          <Text style={text}>
            Votre commande sera préparée et expédiée dans un délai de{" "}
            {deliveryOption.estimatedDays}. Vous recevrez un email dès que votre
            DazNode sera expédié, avec le numéro de suivi de votre colis.
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

const orderDetails = {
  backgroundColor: "#f9f9f9",
  padding: "24px",
  borderRadius: "4px",
  marginBottom: "24px",
};

const orderNumberStyle = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "16px",
};

const totalStyle = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  marginTop: "16px",
};

const footer = {
  color: "#4a4a4a",
  fontSize: "14px",
  lineHeight: "20px",
  marginTop: "32px",
};
