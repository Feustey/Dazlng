import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
  id: string;
  customerName: string;
  deliveryAddress: {
    address: string;
    city: string;
    zipCode: string;
    country: string;
    email: string;
  };
  deliveryOption: {
    name: string;
    estimatedDays: string;
    price: number;
  };
  total: number;
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

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const button = {
  backgroundColor: "#ff6b00",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  id,
  customerName,
  deliveryAddress,
  deliveryOption,
  total,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Confirmation de votre commande DazNode #{id}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src="https://daznode.com/logo.png"
              width="120"
              height="40"
              alt="DazNode"
              style={{ margin: "0 auto" }}
            />
            <Heading
              style={{
                color: "#333",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
                margin: "30px 0",
              }}
            >
              Merci pour votre commande !
            </Heading>

            <Text style={paragraph}>Bonjour {customerName},</Text>

            <Text style={paragraph}>
              Nous avons bien reçu votre commande #{id} et nous la traitons
              actuellement. Voici un récapitulatif de votre commande :
            </Text>

            <Section
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "5px",
                margin: "20px 0",
              }}
            >
              <Text style={{ ...paragraph, fontWeight: "bold" }}>
                Détails de la livraison
              </Text>
              <Text style={paragraph}>
                {deliveryAddress.address}
                <br />
                {deliveryAddress.zipCode} {deliveryAddress.city}
                <br />
                {deliveryAddress.country}
              </Text>

              <Text
                style={{ ...paragraph, fontWeight: "bold", marginTop: "20px" }}
              >
                Mode de livraison
              </Text>
              <Text style={paragraph}>
                {deliveryOption.name} - Livraison estimée :{" "}
                {deliveryOption.estimatedDays}
              </Text>

              <Text
                style={{ ...paragraph, fontWeight: "bold", marginTop: "20px" }}
              >
                Montant total
              </Text>
              <Text style={paragraph}>{total.toFixed(2)} €</Text>
            </Section>

            <Text style={paragraph}>
              Vous recevrez un email de confirmation dès que votre commande sera
              expédiée. Si vous avez des questions, n'hésitez pas à nous
              contacter à{" "}
              <Link href="mailto:support@daznode.com">support@daznode.com</Link>
              .
            </Text>

            <Button style={button} href={`https://daznode.com/orders/${id}`}>
              Suivre ma commande
            </Button>

            <hr style={hr} />

            <Text style={footer}>
              © {new Date().getFullYear()} DazNode. Tous droits réservés.
              <br />
              <Link href="https://daznode.com/terms">
                Conditions générales
              </Link>{" "}
              •{" "}
              <Link href="https://daznode.com/privacy">
                Politique de confidentialité
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;
