import { Resend } from 'resend';
import { JWTManager } from '../utils/jwt-manager';

export async function checkTokenExpiry(): Promise<void> {
  const token = process.env.MCP_JWT_TOKEN;
  const secretKey = process.env.MCP_JWT_SECRET;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!token || !secretKey) {
    console.error('Configuration MCP manquante');
    return;
  }
  if (!resendApiKey) {
    console.error('Clé API Resend manquante');
    return;
  }

  try {
    const payload = JWTManager.verifyToken(token, secretKey);
    const expiryDate = new Date(payload.exp * 1000);
    const daysRemaining = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 7) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
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