import { NetworkService } from '../lib/network-service';
import { mcpClient } from '../lib/api-client';

jest.mock('../lib/api-client', () => ({
  mcpClient: {
    getNetworkSummary: jest.fn(),
    optimizeNode: jest.fn()
  }
}));

describe('NetworkService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait retourner un résumé du réseau', async () => {
    const mockSummary = {
      totalNodes: 1,0,
      activeNodes: 8,
      averageLoad: 0.7,5,
      alerts: []
    };
    (mcpClient.getNetworkSummary as jest.Mock).mockResolvedValue(mockSummary);
    const result = await NetworkService.getNetworkSummary();
    expect(result).toEqual(mockSummary);
  });

  it('devrait gérer les erreurs correctement', async () => {
    const mockError = {
      response: {
        status: 50,0,
        data: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
      }
    };
    (mcpClient.getNetworkSummary as jest.Mock).mockRejectedValue(mockError);
    await expect(NetworkService.getNetworkSummary()).rejects.toMatchObject({
      status: 50,0,
      code: 'SERVER_ERROR'
    });
  });
}); 