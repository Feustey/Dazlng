import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Recommendation from '@/../../models/Recommendation';
import mcpService from '@/lib/mcpService';
import { McpNode, BaseNode } from '@/types/node';

export async function GET() {
  try {
    await connectToDatabase();

    // Récupérer les nœuds via l'API MCP
    const nodes = await mcpService.getAllNodes();
    
    // Générer les recommandations basées sur les données des nœuds
    let recommendations = '';
    
    // Analyse des frais (nous supposons que les nœuds sont de type BaseNode qui contient avg_fee_rate_ppm)
    const highFeeNodes = nodes.filter((node: any) => node.avg_fee_rate_ppm > 1000);
    if (highFeeNodes.length > 0) {
      recommendations += `⚠️ Attention : ${highFeeNodes.length} nœud(s) ont des frais élevés (>1000 ppm)\n`;
    }

    // Analyse de la capacité
    const lowCapacityNodes = nodes.filter((node: any) => node.capacity && node.capacity < 1000000);
    if (lowCapacityNodes.length > 0) {
      recommendations += `💡 ${lowCapacityNodes.length} nœud(s) ont une faible capacité (<1M sats)\n`;
    }

    // Analyse de l'uptime
    const lowUptimeNodes = nodes.filter((node: any) => node.uptime && node.uptime < 95);
    if (lowUptimeNodes.length > 0) {
      recommendations += `⚠️ ${lowUptimeNodes.length} nœud(s) ont un uptime faible (<95%)\n`;
    }

    // Si aucune recommandation spécifique, message par défaut
    if (!recommendations) {
      recommendations = '✅ Tous vos nœuds semblent bien configurés !';
    }

    // Sauvegarder les recommandations dans la base de données
    const latestRecommendation = await Recommendation.findOne().sort({ createdAt: -1 });
    if (!latestRecommendation || latestRecommendation.content !== recommendations) {
      await Recommendation.create({
        content: recommendations,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Erreur lors de la génération des recommandations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des recommandations' },
      { status: 500 }
    );
  }
} 