import nodemailer from 'nodemailer';
import { JWTManager } from '../utils/jwt-manager';

export async function checkTokenExpiry() {
  const token = process.env.MCP_JWT_TOKEN;
  const secretKey = process.env.MCP_JWT_SECRET;

  if (!token || !secretKey) {
    console.error('Configuration MCP manquante');
    return;
  }

  try {
    const payload = JWTManager.verifyToken(token, secretKey);
    const expiryDate = new Date(payload.exp * 1000);
    const daysRemaining = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 7) {
      // Configuration du transporteur d'email
      const transporter = nodemailer.createTransport({
        host: 'smtp.mcp.dazlng.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // Envoi de l'alerte
      await transporter.sendMail({
        from: 'monitoring@mcp.dazlng.com',
        to: 'admin@dazlng.com',
        subject: 'Alerte - Expiration Token dazno.de',
        text: `Le token JWT de dazno.de expire dans ${daysRemaining} jours.`
      });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
  }
}

// Exécuter la vérification si ce script est lancé directement
if (require.main === module) {
  checkTokenExpiry();
} 