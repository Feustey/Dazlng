import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: 'org-T9y9m0PDO2eykV89siIoiTkz'
});

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
    const promptTemplate = fs.readFileSync(promptPath, 'utf-8');

    // Remplacer les variables dans le template
    const prompt = promptTemplate
      .replace('{total_capacity}', nodeData.totalCapacity.toString())
      .replace('{channel_count}', nodeData.channelCount.toString())
      .replace('{connectivity_score}', nodeData.connectivityScore.toString())
      .replace('{betweenness_centrality}', nodeData.betweennessCentrality.toString())
      .replace('{node_alias}', nodeData.alias)
      .replace('{node_country}', nodeData.country)
      .replace('{avg_base_fee}', nodeData.avgBaseFee.toString())
      .replace('{avg_fee_rate}', nodeData.avgFeeRate.toString())
      .replace('{activity_history}', JSON.stringify(nodeData.activityHistory));

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