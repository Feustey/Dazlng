// Script pour mettre à jour les chemins d'importation suite à la restructuration
const fs = require("fs");
const path = require("path");
const glob = require("glob");

console.log("Début de la mise à jour des imports...");

// Patterns de remplacement pour les imports
const replacements = [
  // Routes API
  { from: /from ['"]\/api\/([^'"]+)['"]/g, to: 'from "app/api/$1"' },
  { from: /import ['"]\/api\/([^'"]+)['"]/g, to: 'import "app/api/$1"' },
  {
    from: /import \* as [a-zA-Z0-9_]+ from ['"]\/api\/([^'"]+)['"]/g,
    to: (match) => {
      const importName = match.match(/import \* as ([a-zA-Z0-9_]+) from/)[1];
      return `import * as ${importName} from "app/api/$1"`;
    },
  },
  {
    from: /import \{ [^}]+ \} from ['"]\/api\/([^'"]+)['"]/g,
    to: (match) => {
      const importPart = match.match(/import \{ ([^}]+) \} from/)[1];
      return `import { ${importPart} } from "app/api/$1"`;
    },
  },

  // Routes internationalisées
  {
    from: /from ['"]\/\[locale\]\/([^'"]+)['"]/g,
    to: 'from "app/[locale]/$1"',
  },
  {
    from: /import ['"]\/\[locale\]\/([^'"]+)['"]/g,
    to: 'import "app/[locale]/$1"',
  },
  {
    from: /import \* as [a-zA-Z0-9_]+ from ['"]\/\[locale\]\/([^'"]+)['"]/g,
    to: (match) => {
      const importName = match.match(/import \* as ([a-zA-Z0-9_]+) from/)[1];
      return `import * as ${importName} from "app/[locale]/$1"`;
    },
  },
  {
    from: /import \{ [^}]+ \} from ['"]\/\[locale\]\/([^'"]+)['"]/g,
    to: (match) => {
      const importPart = match.match(/import \{ ([^}]+) \} from/)[1];
      return `import { ${importPart} } from "app/[locale]/$1"`;
    },
  },

  // Composants
  {
    from: /from ['"]\/components\/([^'"]+)['"]/g,
    to: 'from "app/components/$1"',
  },
  {
    from: /import ['"]\/components\/([^'"]+)['"]/g,
    to: 'import "app/components/$1"',
  },
  {
    from: /import \* as [a-zA-Z0-9_]+ from ['"]\/components\/([^'"]+)['"]/g,
    to: (match) => {
      const importName = match.match(/import \* as ([a-zA-Z0-9_]+) from/)[1];
      return `import * as ${importName} from "app/components/$1"`;
    },
  },
  {
    from: /import \{ [^}]+ \} from ['"]\/components\/([^'"]+)['"]/g,
    to: (match) => {
      const importPart = match.match(/import \{ ([^}]+) \} from/)[1];
      return `import { ${importPart} } from "app/components/$1"`;
    },
  },

  // Ajuster les chemins pour les groupes de routes
  {
    from: /from ['"]app\/\[locale\]\/([^\/'"]+)\/([^'"]+)['"]/g,
    to: (match, p1, p2) => {
      if (["auth", "app", "modal", "dashboard", "static"].includes(p1)) {
        return `from "app/[locale]/@${p1}/${p2}"`;
      }
      return match;
    },
  },
  {
    from: /import ['"]app\/\[locale\]\/([^\/'"]+)\/([^'"]+)['"]/g,
    to: (match, p1, p2) => {
      if (["auth", "app", "modal", "dashboard", "static"].includes(p1)) {
        return `import "app/[locale]/@${p1}/${p2}"`;
      }
      return match;
    },
  },
];

// Fonction pour mettre à jour un fichier
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let updated = false;

    replacements.forEach(({ from, to }) => {
      const newContent = content.replace(from, to);
      if (newContent !== content) {
        content = newContent;
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`Mis à jour: ${filePath}`);
    }
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de ${filePath}:`, error);
  }
}

// Traiter tous les fichiers
try {
  const files = glob.sync("**/*.{ts,tsx,js,jsx}", {
    ignore: ["node_modules/**", ".next/**", "scripts/**"],
  });

  console.log(`${files.length} fichiers trouvés à examiner.`);

  files.forEach((file, index) => {
    if (index % 100 === 0) {
      console.log(`Progression: ${index}/${files.length} fichiers traités`);
    }
    updateFile(file);
  });

  console.log("Mise à jour des imports terminée.");
} catch (error) {
  console.error("Erreur lors de la recherche des fichiers:", error);
}
