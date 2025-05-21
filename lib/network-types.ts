export interface NetworkNode {
  id: string;
  status: 'online' | 'offline' | 'maintenance';
  lastSeen: string;
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

export interface NetworkSummary {
  totalNodes: number;
  activeNodes: number;
  averageLoad: number;
  alerts: NetworkAlert[];
}

export interface NetworkAlert {
  severity: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export interface OptimizationResult {
  success: boolean;
  optimizationId: string;
  estimatedDuration: number;
} 