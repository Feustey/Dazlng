import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Fonction pour récupérer le contenu markdown d'une page
async function getPageContent(
  pageId: string,
  locale: string
): Promise<string | null> {
  const localeDir = path.join(process.cwd(), "public", "locale");

  // Vérifier si la page existe directement
  let filePath = path.join(localeDir, pageId, `${locale}.md`);

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf-8");
  }

  // Si page pas trouvée directement, chercher dans la hiérarchie des dossiers
  const segments = pageId.split("/").filter(Boolean);

  // Parcourir la structure de dossiers
  for (let i = segments.length; i > 0; i--) {
    const basePath = segments.slice(0, i).join("/");
    const checkPath = path.join(localeDir, basePath, `${locale}.md`);

    if (fs.existsSync(checkPath)) {
      return fs.readFileSync(checkPath, "utf-8");
    }
  }

  // Chercher la page dans le dossier racine
  const rootFilePath = path.join(localeDir, `${pageId}.${locale}.md`);
  if (fs.existsSync(rootFilePath)) {
    return fs.readFileSync(rootFilePath, "utf-8");
  }

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string; locale: string } }
) {
  try {
    const { pageId, locale } = params;

    // Valider les entrées pour éviter les attaques de traversée de chemin
    if (
      pageId.includes("..") ||
      locale.includes("..") ||
      !["en", "fr", "es", "de", "it"].includes(locale)
    ) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    const content = await getPageContent(pageId, locale);

    if (!content) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Parse des métadonnées (frontmatter) si nécessaire
    const metaMatch = content.match(/---\n([\s\S]*?)\n---/);
    const metadata = metaMatch
      ? metaMatch[1].split("\n").reduce(
          (meta, line) => {
            const [key, value] = line.split(": ");
            if (key && value) {
              meta[key.trim()] = value.trim();
            }
            return meta;
          },
          {} as Record<string, string>
        )
      : {};

    // Contenu sans le frontmatter
    const contentWithoutMeta = metaMatch
      ? content.replace(metaMatch[0], "").trim()
      : content;

    return NextResponse.json({
      pageId,
      locale,
      metadata,
      content: contentWithoutMeta,
    });
  } catch (error) {
    console.error("Error fetching page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch page content" },
      { status: 500 }
    );
  }
}
