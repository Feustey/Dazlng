import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Initialisation du client Prisma avec gestion des connexions multiples
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Vérification des variables d'environnement
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

const openaiConfig: { apiKey: string; organization?: string } = {
  apiKey: process.env.OPENAI_API_KEY,
};

if (process.env.OPENAI_ORG_ID) {
  openaiConfig.organization = process.env.OPENAI_ORG_ID;
}

const openai = new OpenAI(openaiConfig);

export async function GET() {
  try {
    // Récupérer les données du nœud depuis MongoDB
    const nodeData = await prisma.node.findFirst();
    if (!nodeData) {
      return NextResponse.json(
        { error: 'Aucune donnée de nœud trouvée' },
        { status: 404 }
      );
    }

    // Lire le contenu du fichier Prompt.md
    const promptPath = path.join(process.cwd(), 'Prompt.md');
    let promptTemplate: string;
    
    try {
      promptTemplate = fs.readFileSync(promptPath, 'utf-8');
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier Prompt.md:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la lecture du template de prompt' },
        { status: 500 }
      );
    }

    // Remplacer les variables dans le template
    const prompt = promptTemplate
      .replace('{total_capacity}', nodeData.total_capacity.toString())
      .replace('{channel_count}', nodeData.active_channels.toString())
      .replace('{connectivity_score}', '0')
      .replace('{betweenness_centrality}', '0')
      .replace('{node_alias}', nodeData.alias)
      .replace('{node_country}', 'Unknown')
      .replace('{avg_base_fee}', '0')
      .replace('{avg_fee_rate}', nodeData.avg_fee_rate_ppm.toString())
      .replace('{activity_history}', '[]');

    // Appeler l'API OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en analyse des performances des nœuds Lightning Network et en optimisation de la rentabilité des canaux."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parser la réponse d'OpenAI pour extraire les recommandations
    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('La réponse d\'OpenAI est vide');
    }
    const recommendations = parseRecommendations(response);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Erreur lors de la génération des recommandations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des recommandations' },
      { status: 500 }
    );
  }
}

function parseRecommendations(response: string): Array<{ text: string; impact: 'faible' | 'moyen' | 'élevé' }> {
  const recommendations: Array<{ text: string; impact: 'faible' | 'moyen' | 'élevé' }> = [];
  
  // Diviser la réponse en lignes
  const lines = response.split('\n');
  
  for (const line of lines) {
    // Vérifier si la ligne contient une recommandation
    if (line.startsWith('-')) {
      const text = line.substring(1).trim();
      // Extraire l'impact si présent
      const impactMatch = text.match(/\((impact: (faible|moyen|élevé))\)/i);
      
      if (impactMatch) {
        const impact = impactMatch[2].toLowerCase() as 'faible' | 'moyen' | 'élevé';
        const cleanText = text.replace(/\(impact: (faible|moyen|élevé)\)/i, '').trim();
        recommendations.push({ text: cleanText, impact });
      } else {
        // Si pas d'impact spécifié, considérer comme impact moyen
        recommendations.push({ text, impact: 'moyen' });
      }
    }
  }

  return recommendations;
} 