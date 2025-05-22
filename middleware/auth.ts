import { NextApiRequest, NextApiResponse } from 'next';
import { JWTManager } from '../utils/jwt-manager';

// Définir une interface étendue pour NextApiRequest
interface NextApiRequestWithMCP extends NextApiRequest {
  mcpPayload?: unknown;
}

export function validateMCPToken(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    const secretKey = process.env.MCP_JWT_SECRET;

    if (!secretKey) {
      throw new Error('Configuration MCP manquante');
    }

    const payload = JWTManager.verifyToken(token, secretKey);

    // Ajouter le payload vérifié à la requête pour utilisation ultérieure
    (req as NextApiRequestWithMCP).mcpPayload = payload;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
} 