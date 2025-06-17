import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

// Charger les variables d'environnement
config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET non configuré dans .env.local');
  process.exit(1);
}

/**
 * Génère un token JWT pour dazno.de
 */
function generateJWT(tenant_id: string, permissions: string[] = ['read']): string {
  const payload = {
    iss: 'dazno.de',
    aud: 'daznode',
    sub: tenant_id,
    tenant_id,
    permissions,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 heures
  };

  return jwt.sign(payload, JWT_SECRET);
}

// Exemple d'utilisation
if (require.main === module) {
  const tenant_id = process.argv[2];
  const permissions = process.argv[3]?.split(',') || ['read'];

  if (!tenant_id) {
    console.error('❌ Usage: npm run generate-jwt <tenant_id> [permissions]');
    console.error('   Exemple: npm run generate-jwt dazno-de read,write');
    process.exit(1);
  }

  try {
    const token = generateJWT(tenant_id, permissions);
    console.log('\n🔑 Token JWT généré pour dazno.de:');
    console.log('====================================');
    console.log(token);
    console.log('\n📝 Pour utiliser ce token:');
    console.log('1. Ajoutez-le dans l\'en-tête Authorization:');
    console.log('   Authorization: Bearer ' + token);
    console.log('2. Le token expire dans 24 heures');
    console.log('3. Permissions:', permissions.join(', '));
    console.log('====================================\n');
  } catch (error) {
    console.error('❌ Erreur lors de la génération du token:', error);
    process.exit(1);
  }
}

export { generateJWT }; 