const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32];
const inputDir = path.join(__dirname, '../public');
const outputFile = path.join(__dirname, '../public/favicon.ico');

// Créer un buffer pour stocker les images
const images = sizes.map(size => {
  const inputFile = path.join(inputDir, `favicon-${size}x${size}.png`);
  return sharp(inputFile)
    .toBuffer();
});

// Combiner les images en un seul fichier ICO
Promise.all(images)
  .then(buffers => {
    // Créer un nouveau buffer pour le fichier ICO
    const icoBuffer = Buffer.concat(buffers);
    
    // Écrire le fichier ICO
    fs.writeFileSync(outputFile, icoBuffer);
    console.log('Fichier favicon.ico généré avec succès');
  })
  .catch(err => console.error('Erreur lors de la génération du favicon.ico:', err)); 