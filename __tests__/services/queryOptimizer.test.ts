import { QueryOptimizer } from '@/lib/services/queryOptimizer';
import { connectToDatabase } from '@/lib/mongodb';
import Node from '@/models/Node';
import PeerOfPeer from '@/models/PeerOfPeer';

// Mock des dépendances
jest.mock('@/lib/mongodb');
jest.mock('@/models/Node');
jest.mock('@/models/PeerOfPeer');

describe('QueryOptimizer', () => {
  let queryOptimizer: QueryOptimizer;
  const mockNode = {
    pubkey: 'test-pubkey',
    alias: 'Test Node',
    platform: 'test-platform',
    version: '1.0.0',
    total_capacity: 1000000,
    active_channel_count: 10,
    total_peers: 5,
    uptime: 99.9
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryOptimizer = QueryOptimizer.getInstance();

    // Configuration des mocks Mongoose
    const mockNodeFindOne = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockNode)
    };
    (Node.findOne as jest.Mock).mockReturnValue(mockNodeFindOne);

    const mockNodeFind = {
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockNode])
    };
    (Node.find as jest.Mock).mockReturnValue(mockNodeFind);

    const mockPeerFind = {
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockNode])
    };
    (PeerOfPeer.find as jest.Mock).mockReturnValue(mockPeerFind);
  });

  describe('getInstance', () => {
    it('devrait retourner la même instance', () => {
      const instance1 = QueryOptimizer.getInstance();
      const instance2 = QueryOptimizer.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getNodeWithOptimizedQuery', () => {
    it('devrait retourner un nœud depuis la base de données', async () => {
      const result = await queryOptimizer.getNodeWithOptimizedQuery('test-pubkey');

      expect(connectToDatabase).toHaveBeenCalled();
      expect(Node.findOne).toHaveBeenCalledWith(
        { pubkey: 'test-pubkey' }
      );
      expect(result).toEqual(mockNode);
    });

    it('devrait utiliser le cache si disponible et valide', async () => {
      const cacheKey = queryOptimizer['getCacheKey']('getNode', { pubkey: 'test-pubkey' });
      queryOptimizer['queryCache'].set(cacheKey, {
        data: mockNode,
        timestamp: Date.now()
      });

      const result = await queryOptimizer.getNodeWithOptimizedQuery('test-pubkey');

      expect(Node.findOne).not.toHaveBeenCalled();
      expect(result).toEqual(mockNode);
    });

    it('devrait gérer les erreurs de requête', async () => {
      const mockNodeFindOneError = {
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('DB Error'))
      };
      (Node.findOne as jest.Mock).mockReturnValue(mockNodeFindOneError);

      await expect(queryOptimizer.getNodeWithOptimizedQuery('test-pubkey')).rejects.toThrow('DB Error');
    });
  });

  describe('getTopNodes', () => {
    const mockNodes = [mockNode];

    it('devrait retourner les top nœuds depuis la base de données', async () => {
      const result = await queryOptimizer.getTopNodes(10);

      expect(connectToDatabase).toHaveBeenCalled();
      expect(Node.find).toHaveBeenCalled();
      expect(result).toEqual(mockNodes);
    });

    it('devrait utiliser le cache si disponible et valide', async () => {
      const cacheKey = queryOptimizer['getCacheKey']('getTopNodes', { limit: 10 });
      queryOptimizer['queryCache'].set(cacheKey, {
        data: mockNodes,
        timestamp: Date.now()
      });

      const result = await queryOptimizer.getTopNodes(10);

      expect(Node.find).not.toHaveBeenCalled();
      expect(result).toEqual(mockNodes);
    });

    it('devrait gérer les erreurs de requête', async () => {
      const mockNodeFindError = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('DB Error'))
      };
      (Node.find as jest.Mock).mockReturnValue(mockNodeFindError);

      await expect(queryOptimizer.getTopNodes(10)).rejects.toThrow('DB Error');
    });
  });

  describe('getPeersOfPeersWithOptimizedQuery', () => {
    const mockPeers = [mockNode];

    it('devrait retourner les pairs depuis la base de données', async () => {
      const result = await queryOptimizer.getPeersOfPeersWithOptimizedQuery('test-pubkey');

      expect(connectToDatabase).toHaveBeenCalled();
      expect(PeerOfPeer.find).toHaveBeenCalledWith(
        { nodePubkey: 'test-pubkey' }
      );
      expect(result).toEqual(mockPeers);
    });

    it('devrait utiliser le cache si disponible et valide', async () => {
      const cacheKey = queryOptimizer['getCacheKey']('getPeersOfPeers', { nodePubkey: 'test-pubkey' });
      queryOptimizer['queryCache'].set(cacheKey, {
        data: mockPeers,
        timestamp: Date.now()
      });

      const result = await queryOptimizer.getPeersOfPeersWithOptimizedQuery('test-pubkey');

      expect(PeerOfPeer.find).not.toHaveBeenCalled();
      expect(result).toEqual(mockPeers);
    });

    it('devrait gérer les erreurs de requête', async () => {
      const mockPeerFindError = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('DB Error'))
      };
      (PeerOfPeer.find as jest.Mock).mockReturnValue(mockPeerFindError);

      await expect(queryOptimizer.getPeersOfPeersWithOptimizedQuery('test-pubkey')).rejects.toThrow('DB Error');
    });
  });

  describe('clearCache', () => {
    it('devrait vider le cache', () => {
      queryOptimizer['queryCache'].set('test-key', { data: {}, timestamp: Date.now() });
      queryOptimizer.clearCache();
      expect(queryOptimizer['queryCache'].size).toBe(0);
    });
  });

  describe('setCacheTTL', () => {
    it('devrait mettre à jour le TTL du cache', () => {
      const newTTL = 10 * 60 * 1000; // 10 minutes
      queryOptimizer.setCacheTTL(newTTL);
      expect(queryOptimizer['CACHE_TTL']).toBe(newTTL);
    });
  });
}); 