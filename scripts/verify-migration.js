// Script de vérification de la conformité après migration
const fs = require("fs");
const path = require("path");
const glob = require("glob");

console.log("Vérification de la conformité de la structure...");

// Structure attendue selon l'architecture
const expectedStructure = {
  // Vérifier que les routes API sont dans app/api
  apiRoutes: {
    path: "app/api",
    required: true,
  },

  // Vérifier que les composants sont dans app/components
  components: {
    path: "app/components",
    required: true,
    children: [
      "ui",
      "layout",
      "providers",
      "transactions",
      "auth",
      "network",
      "node",
      "payment",
      "checkout",
    ],
  },

  // Vérifier les groupes de routes internationalisées
  i18nRoutes: {
    path: "app/[locale]",
    required: true,
    children: ["@app", "@auth", "@modal", "@dashboard", "@static"],
  },
};

// Fonction pour vérifier l'existence d'un chemin
function checkPath(pathToCheck) {
  try {
    return fs.existsSync(pathToCheck);
  } catch (err) {
    console.error(`Erreur lors de la vérification de ${pathToCheck}:`, err);
    return false;
  }
}

// Vérifier la structure attendue
function verifyStructure() {
  const issues = [];

  // Vérifier les routes API
  if (!checkPath(expectedStructure.apiRoutes.path)) {
    issues.push(`Le chemin ${expectedStructure.apiRoutes.path} n'existe pas.`);
  } else {
    console.log(`✓ ${expectedStructure.apiRoutes.path} existe.`);
  }

  // Vérifier les composants
  if (!checkPath(expectedStructure.components.path)) {
    issues.push(`Le chemin ${expectedStructure.components.path} n'existe pas.`);
  } else {
    console.log(`✓ ${expectedStructure.components.path} existe.`);

    // Vérifier les sous-dossiers de composants
    expectedStructure.components.children.forEach((child) => {
      const childPath = path.join(expectedStructure.components.path, child);
      if (!checkPath(childPath)) {
        issues.push(`Le dossier de composants ${childPath} n'existe pas.`);
      } else {
        console.log(`  ✓ ${childPath} existe.`);
      }
    });
  }

  // Vérifier les routes internationalisées
  if (!checkPath(expectedStructure.i18nRoutes.path)) {
    issues.push(`Le chemin ${expectedStructure.i18nRoutes.path} n'existe pas.`);
  } else {
    console.log(`✓ ${expectedStructure.i18nRoutes.path} existe.`);

    // Vérifier les groupes de routes
    expectedStructure.i18nRoutes.children.forEach((child) => {
      const childPath = path.join(expectedStructure.i18nRoutes.path, child);
      if (!checkPath(childPath)) {
        issues.push(`Le groupe de routes ${childPath} n'existe pas.`);
      } else {
        console.log(`  ✓ ${childPath} existe.`);
      }
    });
  }

  // Vérifier s'il reste des fichiers dans les anciens emplacements
  const oldPaths = [
    {
      path: "/api",
      pattern: "/api/**/*.{ts,tsx,js,jsx}",
      message: "Fichiers trouvés dans /api - à déplacer vers app/api",
    },
    {
      path: "/[locale]",
      pattern: "/[locale]/**/*.{ts,tsx,js,jsx}",
      message: "Fichiers trouvés dans /[locale] - à déplacer vers app/[locale]",
    },
    {
      path: "/components",
      pattern: "/components/**/*.{ts,tsx,js,jsx}",
      message:
        "Fichiers trouvés dans /components - à déplacer vers app/components",
    },
  ];

  oldPaths.forEach((item) => {
    try {
      if (checkPath(item.path)) {
        const files = glob.sync(item.pattern, {
          ignore: ["node_modules/**", ".next/**"],
        });
        if (files.length > 0) {
          issues.push(`${item.message} (${files.length} fichiers trouvés)`);
          // Afficher les 5 premiers fichiers pour exemple
          files.slice(0, 5).forEach((file) => {
            issues.push(`  → ${file}`);
          });
          if (files.length > 5) {
            issues.push(`  → ... et ${files.length - 5} autres fichiers`);
          }
        }
      }
    } catch (err) {
      console.error(`Erreur lors de la vérification de ${item.path}:`, err);
    }
  });

  // Rechercher des imports incorrects
  try {
    const files = glob.sync("app/**/*.{ts,tsx,js,jsx}", {
      ignore: ["node_modules/**", ".next/**", "scripts/**"],
    });

    const patterns = [
      {
        regex: /from ['"]\/api\//,
        message: "Import direct depuis /api/ trouvé",
      },
      {
        regex: /from ['"]\/\[locale\]\//,
        message: "Import direct depuis /[locale]/ trouvé",
      },
      {
        regex: /from ['"]\/components\//,
        message: "Import direct depuis /components/ trouvé",
      },
    ];

    files.forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      patterns.forEach((pattern) => {
        if (pattern.regex.test(content)) {
          issues.push(`${pattern.message} dans ${file}`);
        }
      });
    });
  } catch (err) {
    console.error("Erreur lors de la recherche des imports incorrects:", err);
  }

  // Afficher le résultat
  if (issues.length === 0) {
    console.log(
      "\n✅ Aucun problème détecté. La structure est conforme à l'architecture documentée."
    );
  } else {
    console.log("\n⚠️ Problèmes détectés:");
    issues.forEach((issue) => {
      console.log(`  - ${issue}`);
    });
    console.log(`\nTotal: ${issues.length} problèmes à résoudre.`);
  }
}

// Exécuter la vérification
verifyStructure();
