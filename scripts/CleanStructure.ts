import fs from "fs";
import path from "path";

const ROOT_DIR = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT_DIR, "src");
const DUPLICATE_DIRS = ["constants", "navigation", "screens", "types", "utils"];

function mergeDirectories(dirName: string) {
  const srcPath = path.join(SRC_DIR, dirName);
  const rootPath = path.join(ROOT_DIR, dirName);

  if (!fs.existsSync(srcPath)) return;

  for (const file of fs.readdirSync(srcPath)) {
    const srcFile = path.join(srcPath, file);
    const rootFile = path.join(rootPath, file);

    if (fs.existsSync(rootFile)) {
      // Si c'est un dossier, fusion récursive
      if (fs.lstatSync(srcFile).isDirectory() && fs.lstatSync(rootFile).isDirectory()) {
        mergeDirectories(path.join(dirName, file));
      } else {
        // Fichier en conflit, à fusionner manuellement
        console.log(`⚠️  Conflit fichier: ${rootFile} existe déjà. À fusionner manuellement.`);
      }
    } else {
      fs.renameSync(srcFile, rootFile);
      console.log(`✅ Déplacé: ${srcFile} → ${rootFile}`);
    }
  }

  // Supprime le dossier src/[dirName] s'il est vide
  if (fs.readdirSync(srcPath).length === 0) {
    fs.rmdirSync(srcPath);
    console.log(`🗑️  Supprimé: ${srcPath}`);
  }
}

for (const dir of DUPLICATE_DIRS) {
  mergeDirectories(dir);
}

// Supprime src/ s'il est vide
if (fs.existsSync(SRC_DIR) && fs.readdirSync(SRC_DIR).length === 0) {
  fs.rmdirSync(SRC_DIR);
  console.log(`🗑️  Supprimé: ${SRC_DIR}`);
}

console.log("🎉 Fusion automatique terminée. Vérifie les conflits listés ci-dessus !");