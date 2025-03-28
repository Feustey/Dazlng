const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

const inputFile = path.join(__dirname, '../public/favicon.svg');
const outputDir = path.join(__dirname, '../public');

// Assurez-vous que le répertoire de sortie existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Générer chaque taille de favicon
sizes.forEach(({ size, name }) => {
  sharp(inputFile)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, name))
    .then(() => console.log(`Généré ${name}`))
    .catch(err => console.error(`Erreur lors de la génération de ${name}:`, err));
}); 