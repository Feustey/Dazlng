import { CleanupService } from '../../lib/services/cleanupService';
import { connectToDatabase } from '../../lib/mongodb';
import Node from '../../models/Node';
import PeerOfPeer from '../../models/PeerOfPeer';
import History from '../../models/History';

// Mock des dépendances
jest.mock('@/lib/mongodb');
jest.mock('@/models/Node');
jest.mock('@/models/PeerOfPeer');
jest.mock('@/models/History');

describe('CleanupService', () => {
  let cleanupService: CleanupService;

  beforeEach(() => {
    jest.clearAllMocks();
    cleanupService = CleanupService.getInstance();

    // Configuration des mocks Mongoose
    const mockNodeDelete = {
      exec: jest.fn().mockResolvedValue({ deletedCount: 5 })
    };
    (Node.deleteMany as jest.Mock).mockReturnValue(mockNodeDelete);

    const mockPeerDelete = {
      exec: jest.fn().mockResolvedValue({ deletedCount: 3 })
    };
    (PeerOfPeer.deleteMany as jest.Mock).mockReturnValue(mockPeerDelete);

    const mockHistoryDelete = {
      exec: jest.fn().mockResolvedValue({ deletedCount: 10 })
    };
    (History.deleteMany as jest.Mock).mockReturnValue(mockHistoryDelete);
  });

  describe('getInstance', () => {
    it('devrait retourner la même instance', () => {
      const instance1 = CleanupService.getInstance();
      const instance2 = CleanupService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('cleanupNodes', () => {
    it('devrait nettoyer les nœuds plus vieux que NODE_RETENTION_DAYS', async () => {
      await cleanupService['cleanupNodes']();

      expect(connectToDatabase).toHaveBeenCalled();
      expect(Node.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(Object)
        })
      );
    });

    it('devrait gérer les erreurs de nettoyage des nœuds', async () => {
      const mockNodeDeleteError = {
        exec: jest.fn().mockRejectedValue(new Error('DB Error'))
      };
      (Node.deleteMany as jest.Mock).mockReturnValue(mockNodeDeleteError);

      await expect(cleanupService['cleanupNodes']()).rejects.toThrow('DB Error');
    });
  });

  describe('cleanupPeersOfPeers', () => {
    it('devrait nettoyer les pairs plus vieux que PEER_RETENTION_DAYS', async () => {
      await cleanupService['cleanupPeersOfPeers']();

      expect(connectToDatabase).toHaveBeenCalled();
      expect(PeerOfPeer.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(Object)
        })
      );
    });

    it('devrait gérer les erreurs de nettoyage des pairs', async () => {
      const mockPeerDeleteError = {
        exec: jest.fn().mockRejectedValue(new Error('DB Error'))
      };
      (PeerOfPeer.deleteMany as jest.Mock).mockReturnValue(mockPeerDeleteError);

      await expect(cleanupService['cleanupPeersOfPeers']()).rejects.toThrow('DB Error');
    });
  });

  describe('cleanupHistory', () => {
    it('devrait nettoyer l\'historique plus vieux que HISTORY_RETENTION_DAYS', async () => {
      await cleanupService['cleanupHistory']();

      expect(connectToDatabase).toHaveBeenCalled();
      expect(History.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({
          date: expect.any(Object)
        })
      );
    });

    it('devrait gérer les erreurs de nettoyage de l\'historique', async () => {
      const mockHistoryDeleteError = {
        exec: jest.fn().mockRejectedValue(new Error('DB Error'))
      };
      (History.deleteMany as jest.Mock).mockReturnValue(mockHistoryDeleteError);

      await expect(cleanupService['cleanupHistory']()).rejects.toThrow('DB Error');
    });
  });

  describe('performCleanup', () => {
    it('devrait effectuer un nettoyage complet', async () => {
      await cleanupService.performCleanup();

      expect(Node.deleteMany).toHaveBeenCalled();
      expect(PeerOfPeer.deleteMany).toHaveBeenCalled();
      expect(History.deleteMany).toHaveBeenCalled();
    });

    it('ne devrait pas lancer un nouveau nettoyage si un est en cours', async () => {
      cleanupService['isCleaning'] = true;
      await cleanupService.performCleanup();
      expect(Node.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe('startPeriodicCleanup', () => {
    it('devrait démarrer le nettoyage périodique', () => {
      jest.useFakeTimers();
      cleanupService.startPeriodicCleanup();
      expect(setInterval).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('ne devrait pas démarrer un nouveau nettoyage si un est déjà actif', () => {
      cleanupService['cleanupInterval'] = setInterval(() => {}, 1000);
      cleanupService.startPeriodicCleanup();
      expect(setInterval).not.toHaveBeenCalled();
    });
  });

  describe('stopPeriodicCleanup', () => {
    it('devrait arrêter le nettoyage périodique', () => {
      const mockInterval = setInterval(() => {}, 1000);
      cleanupService['cleanupInterval'] = mockInterval;
      cleanupService.stopPeriodicCleanup();
      expect(clearInterval).toHaveBeenCalledWith(mockInterval);
      expect(cleanupService['cleanupInterval']).toBeNull();
    });
  });
}); 