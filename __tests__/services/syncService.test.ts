import { SyncService } from '@/lib/services/syncService';
import { connectToDatabase } from '@/lib/mongodb';
import Node from '@/models/Node';
import PeerOfPeer from '@/models/PeerOfPeer';
import mcpService from '@/lib/mcpService';

// Mock des dépendances
jest.mock('@/lib/mongodb');
jest.mock('@/models/Node');
jest.mock('@/models/PeerOfPeer');
jest.mock('@/lib/mcpService');

describe('SyncService', () => {
  let syncService: SyncService;
  const mockNode = {
    pubkey: 'test-pubkey',
    alias: 'Test Node',
    platform: 'test-platform',
    version: '1.0.0',
    total_fees: 1000,
    avg_fee_rate_ppm: 100,
    total_capacity: 1000000,
    active_channel_count: 10,
    total_volume: 500000,
    total_peers: 5,
    uptime: 99.9,
    opened_channel_count: 15,
    color: '#000000',
    address: 'test-address',
    closed_channel_count: 2,
    pending_channel_count: 1,
    avg_capacity: 100000,
    avg_fee_rate: 100,
    avg_base_fee_rate: 10,
    betweenness_rank: 1,
    eigenvector_rank: 1,
    closeness_rank: 1,
    weighted_betweenness_rank: 1,
    weighted_closeness_rank: 1,
    weighted_eigenvector_rank: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
    syncService = SyncService.getInstance();

    // Configuration des mocks Mongoose
    (Node.findOneAndUpdate as jest.Mock).mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockNode)
    }));

    (Node.find as jest.Mock).mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue([mockNode])
    }));

    (PeerOfPeer.deleteMany as jest.Mock).mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue({ deletedCount: 1 })
    }));

    (PeerOfPeer.insertMany as jest.Mock).mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue([mockNode])
    }));
  });

  describe('getInstance', () => {
    it('devrait retourner la même instance', () => {
      const instance1 = SyncService.getInstance();
      const instance2 = SyncService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('syncNodes', () => {
    it('devrait synchroniser les nœuds avec succès', async () => {
      (mcpService.getAllNodes as jest.Mock).mockResolvedValue([mockNode]);

      await syncService.syncNodes();

      expect(connectToDatabase).toHaveBeenCalled();
      expect(mcpService.getAllNodes).toHaveBeenCalled();
      expect(Node.findOneAndUpdate).toHaveBeenCalledWith(
        { pubkey: mockNode.pubkey },
        expect.objectContaining(mockNode),
        { upsert: true, new: true }
      );
    });

    it('devrait gérer les erreurs de synchronisation', async () => {
      (mcpService.getAllNodes as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(syncService.syncNodes()).rejects.toThrow('API Error');
    });
  });

  describe('syncPeersOfPeers', () => {
    const mockPeers = {
      peers_of_peers: [mockNode]
    };

    it('devrait synchroniser les pairs avec succès', async () => {
      (Node.find as jest.Mock).mockResolvedValue([mockNode]);
      (mcpService.getPeersOfPeers as jest.Mock).mockResolvedValue(mockPeers);

      await syncService.syncPeersOfPeers();

      expect(connectToDatabase).toHaveBeenCalled();
      expect(Node.find).toHaveBeenCalled();
      expect(mcpService.getPeersOfPeers).toHaveBeenCalledWith(mockNode.pubkey);
      expect(PeerOfPeer.deleteMany).toHaveBeenCalledWith({ nodePubkey: mockNode.pubkey });
      expect(PeerOfPeer.insertMany).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs de synchronisation des pairs', async () => {
      (Node.find as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(syncService.syncPeersOfPeers()).rejects.toThrow('DB Error');
    });
  });

  describe('performFullSync', () => {
    it('devrait effectuer une synchronisation complète', async () => {
      (mcpService.getAllNodes as jest.Mock).mockResolvedValue([mockNode]);
      (Node.find as jest.Mock).mockResolvedValue([mockNode]);
      (mcpService.getPeersOfPeers as jest.Mock).mockResolvedValue({ peers_of_peers: [mockNode] });

      await syncService.performFullSync();

      expect(mcpService.getAllNodes).toHaveBeenCalled();
      expect(Node.find).toHaveBeenCalled();
    });

    it('ne devrait pas lancer une nouvelle synchronisation si une est en cours', async () => {
      syncService['isSyncing'] = true;
      await syncService.performFullSync();
      expect(mcpService.getAllNodes).not.toHaveBeenCalled();
    });
  });

  describe('startPeriodicSync', () => {
    it('devrait démarrer la synchronisation périodique', () => {
      jest.useFakeTimers();
      syncService.startPeriodicSync();
      expect(setInterval).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('ne devrait pas démarrer une nouvelle synchronisation si une est déjà active', () => {
      syncService['syncInterval'] = setInterval(() => {}, 1000);
      syncService.startPeriodicSync();
      expect(setInterval).not.toHaveBeenCalled();
    });
  });

  describe('stopPeriodicSync', () => {
    it('devrait arrêter la synchronisation périodique', () => {
      const mockInterval = setInterval(() => {}, 1000);
      syncService['syncInterval'] = mockInterval;
      syncService.stopPeriodicSync();
      expect(clearInterval).toHaveBeenCalledWith(mockInterval);
      expect(syncService['syncInterval']).toBeNull();
    });
  });
}); 