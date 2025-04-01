import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 32, 48, 64, 96, 128, 192, 256];
const inputPath = path.join(__dirname, "../public/logo.png");
const outputDir = path.join(__dirname, "../public");

async function generateFavicons() {
  try {
    const inputBuffer = await fs.promises.readFile(inputPath);

    await Promise.all(
      sizes.map(async (size) => {
        const outputPath = path.join(outputDir, `favicon-${size}x${size}.png`);
        await sharp(inputBuffer).resize(size, size).toFile(outputPath);
      })
    );

    console.log("Favicons générés avec succès !");
  } catch (error) {
    console.error("Erreur lors de la génération des favicons:", error);
  }
}

generateFavicons();
