// app/services/api.ts
// Service pour gérer les appels à l'API

import {
  mockNetworkStats,
  mockNodes,
  mockOrders,
  mockUsers,
  mockProducts,
} from "../lib/mockData";

// Types de base
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Service principal d'API
export const ApiService = {
  /**
   * Fonction générique pour faire des appels API
   */
  async fetch<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      // Vérifier si on est en mode mock (développement ou test)
      if (
        process.env.NODE_ENV === "development" ||
        process.env.MOCK_API === "true"
      ) {
        return await this.mockFetch<T>(url, options);
      }

      // Utilisation de fetch avec le bon typage pour Next.js
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
      });

      if (!response.ok) {
        throw new Error(
          `Erreur API: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();
      return { data: responseData as T, success: true };
    } catch (error) {
      console.error("Erreur API:", error);
      return {
        data: null as unknown as T,
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  },

  /**
   * Version simulée de fetch pour les tests et le développement
   */
  async mockFetch<T>(
    url: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    // Simuler un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Analyser l'URL pour déterminer le type de données à retourner
    const urlParts = url.split("/");
    const endpoint = urlParts[urlParts.length - 1];
    const method = options?.method || "GET";

    let data: any = null;

    // Gérer les différents endpoints
    switch (true) {
      case url.includes("/api/stats/current"):
        data = mockNetworkStats;
        break;
      case url.includes("/api/network/nodes"):
        data = mockNodes;
        break;
      case url.includes("/api/orders"):
        if (method === "GET") {
          data = mockOrders;
        } else if (method === "POST") {
          // Simuler la création d'une commande
          const newOrder = {
            id: `ord_${Date.now()}`,
            ...JSON.parse((options?.body as string) || "{}"),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: "pending",
          };
          data = newOrder;
        }
        break;
      case url.includes("/api/users"):
        data = mockUsers;
        break;
      case url.includes("/api/products"):
        data = mockProducts;
        break;
      default:
        // Endpoint non reconnu, retourner une erreur
        return {
          data: null as unknown as T,
          success: false,
          error: `Endpoint non pris en charge: ${url}`,
        };
    }

    return { data: data as T, success: true };
  },

  // Méthodes spécifiques pour chaque type de ressource
  network: {
    getStats: async () => {
      return await ApiService.fetch<typeof mockNetworkStats>(
        "/api/stats/current"
      );
    },
    getNodes: async () => {
      return await ApiService.fetch<typeof mockNodes>("/api/network/nodes");
    },
  },

  orders: {
    getAll: async () => {
      return await ApiService.fetch<typeof mockOrders>("/api/orders");
    },
    getById: async (id: string) => {
      return await ApiService.fetch<(typeof mockOrders)[0]>(
        `/api/orders/${id}`
      );
    },
    create: async (orderData: any) => {
      return await ApiService.fetch<(typeof mockOrders)[0]>(
        "/api/orders/create",
        {
          method: "POST",
          body: JSON.stringify(orderData),
        }
      );
    },
  },

  users: {
    getProfile: async () => {
      return await ApiService.fetch<(typeof mockUsers)[0]>("/api/user/profile");
    },
    updateProfile: async (profileData: any) => {
      return await ApiService.fetch<(typeof mockUsers)[0]>(
        "/api/profile/update",
        {
          method: "PUT",
          body: JSON.stringify(profileData),
        }
      );
    },
  },

  products: {
    getAll: async () => {
      return await ApiService.fetch<typeof mockProducts>("/api/products");
    },
  },
};
