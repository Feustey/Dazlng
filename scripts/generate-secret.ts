import crypto from 'crypto';

// Générer un secret aléatoire de 64 caractères
const secret = crypto.randomBytes(32).toString('hex');

console.log('Votre WEBHOOK_SECRET est :');
console.log(secret);
console.log('\nCopiez cette valeur et ajoutez-la dans :');
console.log('1. Les variables d\'environnement Netlify');
console.log('2. Le fichier .env.local pour le développement local'); 