import { JWTManager } from '../utils/jwt-manager';
import fs from 'fs';

const { token, secretKey, expiresAt } = JWTManager.generateToken('daznode_prod_01');

console.log('Token JWT généré :\n', token);
console.log('Secret associé :\n', secretKey);
console.log('Expiration :', expiresAt.toISOString());

// Optionnel : écrire dans un fichier temporaire (à sécuriser !)
fs.writeFileSync('mcp-token.txt', `MCP_JWT_TOKEN=${token}\nMCP_JWT_SECRET=${secretKey}\nMCP_JWT_EXPIRES_AT=${expiresAt.toISOString()}\n`); 