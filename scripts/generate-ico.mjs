import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, "../public/logo.png");
const outputPath = path.join(__dirname, "../public/favicon.ico");

const sizes = [16, 32, 48];

async function generateIco() {
  try {
    const inputBuffer = await fs.promises.readFile(inputPath);
    const resizedImages = await Promise.all(
      sizes.map((size) => sharp(inputBuffer).resize(size, size).toBuffer())
    );

    await sharp(resizedImages[0]).toFile(outputPath);

    console.log("Favicon.ico généré avec succès !");
  } catch (error) {
    console.error("Erreur lors de la génération du favicon.ico:", error);
  }
}

generateIco();
