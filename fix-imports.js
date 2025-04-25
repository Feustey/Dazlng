const fs = require("fs");
const path = require("path");

// Fonction pour corriger les imports dans un fichier
function fixImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Calculer le chemin relatif vers app selon la profondeur du fichier
    const relativeDepth =
      filePath
        .split(path.sep)
        .slice(__dirname.split(path.sep).length)
        .filter((p) => p !== "").length - 1;
    const relativePath = Array(relativeDepth).fill("..").join("/");

    // Remplacer les imports problématiques
    let fixedContent = content
      .replace(
        /from ["']\.\.\/\.\.\/\.\.\/lib\//g,
        `from "${relativePath}/app/lib/`
      )
      .replace(/from ["']\.\.\/\.\.\/lib\//g, `from "${relativePath}/app/lib/`)
      .replace(/from ["']\.\.\/lib\//g, `from "${relativePath}/app/lib/`)
      .replace(/from ["']@\/lib\//g, `from "${relativePath}/app/lib/`)
      .replace(/from ["']@\/app\/lib\//g, `from "${relativePath}/app/lib/`)
      .replace(
        /from ["']\.\.\/\.\.\/\.\.\/services\//g,
        `from "${relativePath}/app/services/`
      )
      .replace(
        /from ["']\.\.\/\.\.\/services\//g,
        `from "${relativePath}/app/services/`
      )
      .replace(
        /from ["']\.\.\/services\//g,
        `from "${relativePath}/app/services/`
      )
      .replace(/from ["']@\/services\//g, `from "${relativePath}/app/services/`)
      .replace(
        /from ["']@\/app\/services\//g,
        `from "${relativePath}/app/services/`
      );

    // Si des modifications ont été apportées, écrire le fichier
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, "utf8");
      console.log(`Fixed imports in ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Fonction pour parcourir récursivement un répertoire
function scanDirectory(directory) {
  let fixedFiles = 0;
  const items = fs.readdirSync(directory);

  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      // Récursion pour les sous-répertoires
      fixedFiles += scanDirectory(itemPath);
    } else if (
      stats.isFile() &&
      (itemPath.endsWith(".ts") || itemPath.endsWith(".tsx"))
    ) {
      // Traiter les fichiers .ts et .tsx
      if (fixImports(itemPath)) {
        fixedFiles++;
      }
    }
  }

  return fixedFiles;
}

// Point d'entrée principal
function main() {
  console.log("Starting to fix imports...");
  const apiDir = path.join(__dirname, "api");

  // Vérifier si le répertoire api existe
  if (!fs.existsSync(apiDir)) {
    console.error("API directory not found!");
    process.exit(1);
  }

  const fixedFiles = scanDirectory(apiDir);
  console.log(`Fixed imports in ${fixedFiles} files.`);
}

main();
