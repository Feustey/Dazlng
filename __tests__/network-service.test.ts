import { NetworkService } from '../lib/network-service';
import apiClient from '../lib/api-client';

jest.mock('../lib/api-client');

describe('NetworkService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait retourner un résumé du réseau', async () => {
    const mockSummary = {
      totalNodes: 10,
      activeNodes: 8,
      averageLoad: 0.75,
      alerts: []
    };
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockSummary });
    const result = await NetworkService.getNetworkSummary();
    expect(result).toEqual(mockSummary);
  });

  it('devrait gérer les erreurs correctement', async () => {
    const mockError = {
      response: {
        status: 500,
        data: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
      }
    };
    (apiClient.get as jest.Mock).mockRejectedValue(mockError);
    await expect(NetworkService.getNetworkSummary()).rejects.toMatchObject({
      status: 500,
      code: 'SERVER_ERROR'
    });
  });
}); 