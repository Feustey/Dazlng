import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

interface TokenPayload {
  iss: string;
  sub: string;
  tenant_id: string;
  permissions: string[];
  iat: number;
  exp: number;
  jti: string;
}

export class JWTManager {
  private static generateSecretKey(): string {
    return randomBytes(32).toString('hex');
  }

  public static generateToken(tenantId: string): {
    token: string;
    secretKey: string;
    expiresAt: Date;
  } {
    const secretKey = this.generateSecretKey();
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 30 * 24 * 60 * 60; // 30 jours en secondes

    const payload: TokenPayload = {
      iss: 'mcp.dazlng.com',
      sub: 'dazno.de',
      tenant_id: tenantId,
      permissions: [
        'network:read',
        'network:stats',
        'network:history',
        'network:centralities'
      ],
      iat: now,
      exp: now + expiresIn,
      jti: randomBytes(16).toString('hex')
    };

    const token = jwt.sign(payload, secretKey, { algorithm: 'HS512' });

    return {
      token,
      secretKey,
      expiresAt: new Date((now + expiresIn) * 1000)
    };
  }

  public static verifyToken(token: string, secretKey: string): TokenPayload {
    return jwt.verify(token, secretKey, { algorithms: ['HS512'] }) as TokenPayload;
  }
} 