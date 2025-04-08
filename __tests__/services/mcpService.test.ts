import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  McpService,
  McpError,
  NodeNotFoundError,
  DatabaseError,
} from "../../app/lib/mcpService";
import { MongoClient } from "mongodb";

// Mock des modules MCP
vi.mock("@mcp/client", () => ({
  McpClient: vi.fn().mockImplementation(() => ({
    getNodeInfo: vi.fn(),
    getNodeChannels: vi.fn(),
    getNodeStats: vi.fn(),
    getPaymentStatus: vi.fn(),
    findRoute: vi.fn(),
    subscribeToNodeEvents: vi.fn(),
    subscribeToChannelEvents: vi.fn(),
  })),
}));

vi.mock("@mcp/server", () => ({
  McpServer: vi.fn().mockImplementation(() => ({
    openChannel: vi.fn(),
    closeChannel: vi.fn(),
    sendPayment: vi.fn(),
  })),
}));

vi.mock("@mcp/core", () => ({
  McpCore: vi.fn().mockImplementation(() => ({
    // Ajoutez ici les méthodes nécessaires pour le core
  })),
}));

vi.mock("mongodb", () => ({
  MongoClient: {
    connect: vi.fn(),
  },
}));

describe("McpService", () => {
  let mcpService: McpService;
  const mockCollection = {
    findOne: vi.fn(),
    find: vi.fn(),
    insertOne: vi.fn(),
    updateOne: vi.fn(),
    deleteOne: vi.fn(),
  };

  const mockDb = {
    collection: vi.fn().mockReturnValue(mockCollection),
  };

  const mockClient = {
    db: vi.fn().mockReturnValue(mockDb),
    close: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (MongoClient.connect as jest.Mock).mockResolvedValue(mockClient);
    mcpService = McpService.getInstance();
  });

  describe("Gestion des erreurs", () => {
    it("devrait gérer les erreurs de base de données", async () => {
      (MongoClient.connect as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );

      await expect(mcpService.getNodeInfo("test")).rejects.toThrow(
        DatabaseError
      );
    });

    it("devrait gérer les nœuds non trouvés", async () => {
      mockCollection.findOne.mockResolvedValue(null);

      await expect(mcpService.getNodeInfo("test")).rejects.toThrow(
        NodeNotFoundError
      );
    });

    it("devrait propager les erreurs personnalisées", async () => {
      mockCollection.findOne.mockRejectedValue(
        new McpError("Custom error", "CUSTOM_ERROR", 400)
      );

      await expect(mcpService.getNodeInfo("test")).rejects.toThrow(McpError);
    });
  });

  describe("Opérations sur les nœuds", () => {
    const mockNode = {
      pubkey: "test",
      alias: "Test Node",
      color: "#000000",
    };

    it("devrait récupérer les informations d'un nœud", async () => {
      mockCollection.findOne.mockResolvedValue(mockNode);

      const result = await mcpService.getNodeInfo("test");
      expect(result).toEqual(mockNode);
      expect(mockCollection.findOne).toHaveBeenCalledWith({ pubkey: "test" });
    });

    it("devrait mettre à jour les informations d'un nœud", async () => {
      mockCollection.updateOne.mockResolvedValue({ modifiedCount: 1 });

      await mcpService.updateNodeInfo("test", { alias: "Updated Node" });
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { pubkey: "test" },
        { $set: { alias: "Updated Node" } }
      );
    });

    it("devrait supprimer un nœud", async () => {
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await mcpService.deleteNode("test");
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ pubkey: "test" });
    });
  });

  describe("Opérations sur le réseau", () => {
    const mockNodes = [
      { pubkey: "node1", alias: "Node 1" },
      { pubkey: "node2", alias: "Node 2" },
    ];

    it("devrait récupérer les statistiques du réseau", async () => {
      mockCollection.find.mockReturnValue({
        toArray: vi.fn().mockResolvedValue(mockNodes),
      });

      const result = await mcpService.getNetworkStats();
      expect(result).toBeDefined();
      expect(mockCollection.find).toHaveBeenCalled();
    });

    it("devrait récupérer les nœuds du réseau", async () => {
      mockCollection.find.mockReturnValue({
        toArray: vi.fn().mockResolvedValue(mockNodes),
      });

      const result = await mcpService.getNodes();
      expect(result).toEqual(mockNodes);
      expect(mockCollection.find).toHaveBeenCalled();
    });
  });

  describe("Gestion des connexions", () => {
    it("devrait fermer la connexion après chaque opération", async () => {
      mockCollection.findOne.mockResolvedValue({ pubkey: "test" });

      await mcpService.getNodeInfo("test");
      expect(mockClient.close).toHaveBeenCalled();
    });

    it("devrait fermer la connexion même en cas d'erreur", async () => {
      mockCollection.findOne.mockRejectedValue(new Error("Test error"));

      await expect(mcpService.getNodeInfo("test")).rejects.toThrow();
      expect(mockClient.close).toHaveBeenCalled();
    });
  });

  describe("Node Operations", () => {
    it("should get node info", async () => {
      const mockNodeInfo = { id: "node1", name: "Test Node" };
      (mcpService as any).client.getNodeInfo.mockResolvedValue(mockNodeInfo);

      const result = await mcpService.getNodeInfo("node1");
      expect(result).toEqual(mockNodeInfo);
      expect((mcpService as any).client.getNodeInfo).toHaveBeenCalledWith(
        "node1"
      );
    });

    it("should get node channels", async () => {
      const mockChannels = [{ id: "channel1", capacity: 1000000 }];
      (mcpService as any).client.getNodeChannels.mockResolvedValue(
        mockChannels
      );

      const result = await mcpService.getNodeChannels("node1");
      expect(result).toEqual(mockChannels);
      expect((mcpService as any).client.getNodeChannels).toHaveBeenCalledWith(
        "node1"
      );
    });
  });

  describe("Channel Operations", () => {
    it("should open a channel", async () => {
      const mockChannel = { id: "channel1", capacity: 1000000 };
      (mcpService as any).server.openChannel.mockResolvedValue(mockChannel);

      const result = await mcpService.openChannel("node1", 1000000, "node2");
      expect(result).toEqual(mockChannel);
      expect((mcpService as any).server.openChannel).toHaveBeenCalledWith({
        nodeId: "node1",
        capacity: 1000000,
        targetNodeId: "node2",
      });
    });

    it("should close a channel", async () => {
      const mockResult = { success: true };
      (mcpService as any).server.closeChannel.mockResolvedValue(mockResult);

      const result = await mcpService.closeChannel("channel1");
      expect(result).toEqual(mockResult);
      expect((mcpService as any).server.closeChannel).toHaveBeenCalledWith(
        "channel1"
      );
    });
  });

  describe("Payment Operations", () => {
    it("should send a payment", async () => {
      const mockPayment = { id: "payment1", status: "pending" };
      (mcpService as any).server.sendPayment.mockResolvedValue(mockPayment);

      const result = await mcpService.sendPayment("node1", 100000, "node2");
      expect(result).toEqual(mockPayment);
      expect((mcpService as any).server.sendPayment).toHaveBeenCalledWith({
        nodeId: "node1",
        amount: 100000,
        targetNodeId: "node2",
      });
    });

    it("should get payment status", async () => {
      const mockStatus = { status: "completed" };
      (mcpService as any).client.getPaymentStatus.mockResolvedValue(mockStatus);

      const result = await mcpService.getPaymentStatus("payment1");
      expect(result).toEqual(mockStatus);
      expect((mcpService as any).client.getPaymentStatus).toHaveBeenCalledWith(
        "payment1"
      );
    });
  });

  describe("Route Operations", () => {
    it("should find a route", async () => {
      const mockRoute = { path: ["node1", "node2"], fee: 1000 };
      (mcpService as any).client.findRoute.mockResolvedValue(mockRoute);

      const result = await mcpService.findRoute("node1", "node2", 100000);
      expect(result).toEqual(mockRoute);
      expect((mcpService as any).client.findRoute).toHaveBeenCalledWith({
        sourceNodeId: "node1",
        targetNodeId: "node2",
        amount: 100000,
      });
    });
  });

  describe("Event Subscriptions", () => {
    it("should subscribe to node events", async () => {
      const mockCallback = vi.fn();
      const mockSubscription = { id: "sub1" };
      (mcpService as any).client.subscribeToNodeEvents.mockResolvedValue(
        mockSubscription
      );

      const result = await mcpService.subscribeToNodeEvents(
        "node1",
        mockCallback
      );
      expect(result).toEqual(mockSubscription);
      expect(
        (mcpService as any).client.subscribeToNodeEvents
      ).toHaveBeenCalledWith("node1", mockCallback);
    });

    it("should subscribe to channel events", async () => {
      const mockCallback = vi.fn();
      const mockSubscription = { id: "sub1" };
      (mcpService as any).client.subscribeToChannelEvents.mockResolvedValue(
        mockSubscription
      );

      const result = await mcpService.subscribeToChannelEvents(
        "channel1",
        mockCallback
      );
      expect(result).toEqual(mockSubscription);
      expect(
        (mcpService as any).client.subscribeToChannelEvents
      ).toHaveBeenCalledWith("channel1", mockCallback);
    });
  });
});
