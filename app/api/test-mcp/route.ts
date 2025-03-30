import { NextResponse } from 'next/server';
import mcpServiceInstance from '@/lib/mcpService';

export async function GET() {
  try {
    // Test de connexion de base à l'API MCP
    const connectionTest = await mcpServiceInstance.testConnection();
    
    let endpoints = [];
    let errors = [];
    
    // Si la connexion de base fonctionne, tester d'autres endpoints essentiels
    if (connectionTest.isConnected) {
      // Tableau des tests à effectuer
      const tests = [
        { name: 'getAllNodes', execute: async () => await mcpServiceInstance.getAllNodes() },
        { name: 'getCurrentStats', execute: async () => await mcpServiceInstance.getCurrentStats() },
        { name: 'getHistoricalData', execute: async () => await mcpServiceInstance.getHistoricalData() },
      ];
      
      // Exécution des tests
      for (const test of tests) {
        try {
          const result = await test.execute();
          const success = Array.isArray(result) ? result.length > 0 : !!result;
          endpoints.push({
            name: test.name,
            status: success ? 'success' : 'empty',
            data: success ? (Array.isArray(result) ? `Array(${result.length})` : 'Object') : null
          });
        } catch (error) {
          endpoints.push({
            name: test.name,
            status: 'error',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
          });
          errors.push(`${test.name}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
      }
    }
    
    return NextResponse.json({
      connection: connectionTest,
      endpoints,
      errors: errors.length > 0 ? errors : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du test MCP:', error);
    return NextResponse.json(
      { error: 'Erreur lors du test de connexion à l\'API MCP' },
      { status: 500 }
    );
  }
}
