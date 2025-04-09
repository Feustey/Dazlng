import { Button, Heading, Section, Text } from "@react-email/components";
import BaseEmailTemplate from "./BaseEmailTemplate";

interface WelcomeEmailTemplateProps {
  firstName: string;
  dashboardUrl: string;
}

export default function WelcomeEmailTemplate({
  firstName,
  dashboardUrl,
}: WelcomeEmailTemplateProps) {
  return (
    <BaseEmailTemplate previewText="Bienvenue sur DazNode !">
      <Heading style={h1}>Bienvenue sur DazNode !</Heading>

      <Text style={text}>Bonjour {firstName},</Text>

      <Text style={text}>
        Nous sommes ravis de vous accueillir sur DazNode. Notre plateforme vous
        permet d'optimiser votre nœud Lightning Network et de maximiser vos
        revenus.
      </Text>

      <Section style={featuresSection}>
        <Text style={featureTitle}>
          Ce que vous pouvez faire avec DazNode :
        </Text>

        <Text style={featureItem}>
          <strong>📊 Tableau de bord personnalisé</strong> - Suivez les
          performances de votre nœud en temps réel
        </Text>

        <Text style={featureItem}>
          <strong>🔍 Analyse avancée</strong> - Obtenez des insights détaillés
          sur vos canaux et vos transactions
        </Text>

        <Text style={featureItem}>
          <strong>💰 Optimisation des revenus</strong> - Maximisez vos gains
          grâce à nos recommandations personnalisées
        </Text>

        <Text style={featureItem}>
          <strong>🔔 Alertes intelligentes</strong> - Soyez informé des
          événements importants concernant votre nœud
        </Text>
      </Section>

      <Text style={text}>
        Commencez dès maintenant à explorer vos statistiques et à optimiser
        votre nœud !
      </Text>

      <Button href={dashboardUrl} style={button}>
        Accéder à mon tableau de bord
      </Button>

      <Text style={text}>
        Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous
        contacter à support@daznode.com
      </Text>

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

const featuresSection = {
  backgroundColor: "#f9f9f9",
  padding: "24px",
  borderRadius: "4px",
  marginBottom: "24px",
};

const featureTitle = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "16px",
};

const featureItem = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "12px",
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
  marginBottom: "16px",
};

const signature = {
  color: "#4a4a4a",
  fontSize: "14px",
  lineHeight: "20px",
  marginTop: "32px",
};
