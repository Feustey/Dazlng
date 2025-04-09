import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  id: string;
  customerName: string;
  deliveryAddress: {
    name: string;
    street: string;
    city: string;
    country: string;
  };
  deliveryOption: {
    name: string;
    estimatedDays: string;
    price: number;
  };
  total: number;
}

export default function OrderConfirmationEmail({
  id,
  customerName,
  deliveryAddress,
  deliveryOption,
  total,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirmation de votre commande DazNode #{id}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Merci pour votre commande !</Heading>
          <Text style={text}>
            Bonjour {customerName},
            <br />
            Nous avons bien reçu votre commande.
          </Text>

          <Text style={orderNumberStyle}>Commande #{id}</Text>

          <Text style={text}>
            <strong>Adresse de livraison :</strong>
            <br />
            {deliveryAddress.name}
            <br />
            {deliveryAddress.street}
            <br />
            {deliveryAddress.city}
            <br />
            {deliveryAddress.country}
          </Text>

          <Text style={text}>
            <strong>Mode de livraison :</strong>
            <br />
            {deliveryOption.name} ({deliveryOption.estimatedDays})
            <br />
            Prix : {deliveryOption.price} €
          </Text>

          <Text style={text}>
            <strong>Total :</strong> {total} €
          </Text>

          <Text style={text}>
            Nous vous tiendrons informé de l&apos;avancement de votre commande.
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

const orderNumberStyle = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  lineHeight: "1.4",
  margin: "24px 0",
  textAlign: "center" as const,
};

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "24px",
  margin: "48px 0 24px",
  textAlign: "center" as const,
};
