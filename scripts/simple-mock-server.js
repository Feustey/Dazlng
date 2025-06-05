#!/usr/bin/env node

const http = require('http');
const url = require('url');

const PORT = 8080;

// Mock data
const mockNodeData = {
  "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f": {
    pubkey: "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
    alias: "ACINQ",
    capacity: 85430000,
    channels: 156,
    uptime: 99.95,
    health_score: 98,
    efficiency: 92,
    rank: 12,
    network_size: 18650
  },
  "026165850492521f4ac8abd9bd8088123446d126f648ca35e60f88177dc149ceb2d": {
    pubkey: "026165850492521f4ac8abd9bd8088123446d126f648ca35e60f88177dc149ceb2d",
    alias: "BitMEX",
    capacity: 42100000,
    channels: 89,
    uptime: 99.12,
    health_score: 87,
    efficiency: 78,
    rank: 45,
    network_size: 18650
  }
};

const mockRecommendations = [
  {
    id: "rec_001",
    title: "Ouvrir un canal avec LNBig",
    description: "Améliorer votre connectivité en vous connectant à un hub majeur du réseau",
    impact: "high",
    difficulty: "easy",
    priority: 1,
    estimated_gain: 8500,
    category: "liquidity",
    action_type: "open_channel",
    free: true
  },
  {
    id: "rec_002", 
    title: "Optimiser les frais de routage dynamiquement",
    description: "Ajuster automatiquement vos frais en fonction des conditions du marché en temps réel",
    impact: "high",
    difficulty: "medium",
    priority: 2,
    estimated_gain: 15000,
    category: "routing",
    action_type: "adjust_fees",
    free: false
  },
  {
    id: "rec_003",
    title: "Rééquilibrer les canaux via submarine swaps",
    description: "Optimiser la distribution de liquidité pour maximiser les revenus de routage",
    impact: "medium", 
    difficulty: "easy",
    priority: 3,
    estimated_gain: 6200,
    category: "efficiency",
    action_type: "rebalance",
    free: false
  },
  {
    id: "rec_004",
    title: "Implémenter une stratégie de backup multi-sites",
    description: "Sécuriser votre nœud avec des sauvegardes redondantes et automatisées",
    impact: "low",
    difficulty: "hard",
    priority: 4,
    estimated_gain: 0,
    category: "security", 
    action_type: "backup",
    free: true
  }
];

function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function isValidPubkey(pubkey) {
  return /^[0-9a-fA-F]{66}$/.test(pubkey);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  console.log(`${new Date().toISOString()} ${method} ${path}`);

  // Health endpoint
  if (path === '/health' && method === 'GET') {
    sendJSON(res, {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      uptime: process.uptime()
    });
    return;
  }

  // Node info endpoint
  const nodeInfoMatch = path.match(/^\/api\/v1\/node\/([^\/]+)\/info$/);
  if (nodeInfoMatch && method === 'GET') {
    const pubkey = nodeInfoMatch[1];
    
    if (!isValidPubkey(pubkey)) {
      sendJSON(res, {
        error: "Invalid pubkey format",
        message: "Pubkey must be 66 character hex string"
      }, 400);
      return;
    }

    const nodeData = mockNodeData[pubkey];
    if (!nodeData) {
      sendJSON(res, {
        error: "Node not found",
        message: `No data available for pubkey: ${pubkey}`
      }, 404);
      return;
    }

    sendJSON(res, nodeData);
    return;
  }

  // Recommendations endpoint
  const recsMatch = path.match(/^\/api\/v1\/node\/([^\/]+)\/recommendations$/);
  if (recsMatch && method === 'GET') {
    const pubkey = recsMatch[1];
    
    if (!isValidPubkey(pubkey)) {
      sendJSON(res, {
        error: "Invalid pubkey format",
        message: "Pubkey must be 66 character hex string"
      }, 400);
      return;
    }

    const nodeData = mockNodeData[pubkey];
    if (!nodeData) {
      sendJSON(res, {
        error: "Node not found",
        message: `No data available for pubkey: ${pubkey}`
      }, 404);
      return;
    }

    // Customize recommendations based on node performance
    let filteredRecs = [...mockRecommendations];
    
    if (nodeData.health_score > 90) {
      // High performing node - focus on advanced optimizations
      filteredRecs = filteredRecs.filter(r => r.category !== 'security');
    }
    
    if (nodeData.efficiency < 80) {
      // Low efficiency - prioritize efficiency improvements
      filteredRecs = filteredRecs.sort((a, b) => 
        a.category === 'efficiency' ? -1 : b.category === 'efficiency' ? 1 : 0
      );
    }

    sendJSON(res, filteredRecs);
    return;
  }

  // Priority actions endpoint
  const prioritiesMatch = path.match(/^\/api\/v1\/node\/([^\/]+)\/priorities$/);
  if (prioritiesMatch && method === 'POST') {
    const pubkey = prioritiesMatch[1];
    
    if (!isValidPubkey(pubkey)) {
      sendJSON(res, {
        error: "Invalid pubkey format",
        message: "Pubkey must be 66 character hex string"
      }, 400);
      return;
    }

    const nodeData = mockNodeData[pubkey];
    if (!nodeData) {
      sendJSON(res, {
        error: "Node not found",
        message: `No data available for pubkey: ${pubkey}`
      }, 404);
      return;
    }

    // Generate AI-prioritized actions
    const priorityActions = [
      {
        action: "increase_routing_fees",
        priority: 1,
        estimated_impact: 12000,
        reasoning: `Avec un health score de ${nodeData.health_score}%, vous pouvez augmenter vos frais de 15% sans perdre de trafic`
      },
      {
        action: "open_channel_lnbig", 
        priority: 2,
        estimated_impact: 8500,
        reasoning: "Connexion à LNBig améliorerait votre centralité dans le réseau de 23%"
      },
      {
        action: "rebalance_channels",
        priority: 3, 
        estimated_impact: 6200,
        reasoning: `Avec ${nodeData.channels} canaux, un rééquilibrage optimal pourrait augmenter votre capacité de routage de 18%`
      }
    ];

    sendJSON(res, priorityActions);
    return;
  }

  // 404 handler
  sendJSON(res, {
    error: "Endpoint not found",
    message: `${method} ${path} is not available`,
    available_endpoints: {
      health: "GET /health",
      node_info: "GET /api/v1/node/{pubkey}/info",
      recommendations: "GET /api/v1/node/{pubkey}/recommendations", 
      priorities: "POST /api/v1/node/{pubkey}/priorities"
    }
  }, 404);
});

server.listen(PORT, () => {
  console.log(`🚀 Mock DazNo API Server running on http://localhost:${PORT}`);
  console.log(`📡 Available endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /api/v1/node/{pubkey}/info`);
  console.log(`   GET  /api/v1/node/{pubkey}/recommendations`);
  console.log(`   POST /api/v1/node/{pubkey}/priorities`);
  console.log(`\n🧪 Test pubkeys available:`);
  Object.keys(mockNodeData).forEach(pubkey => {
    console.log(`   ${pubkey} (${mockNodeData[pubkey].alias})`);
  });
}); 