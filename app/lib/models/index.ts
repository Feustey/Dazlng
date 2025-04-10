/**
 * Modèles Mongoose centralisés avec pattern Singleton
 * Ce fichier est importé uniquement côté serveur
 */

import mongoose, { Model } from "mongoose";
import {
  userSchema,
  nodeSchema,
  sessionSchema,
  networkStatsSchema,
} from "./schema";
import { IUser } from "../interfaces/user.interface";
import { INode } from "../interfaces/node.interface";
import { ISession } from "../interfaces/session.interface";
import { INetworkStats } from "../interfaces/networkStats.interface";

// Vérifier si nous sommes dans un environnement Edge Runtime
const isEdgeRuntime =
  typeof process.env.NEXT_RUNTIME === "string" &&
  process.env.NEXT_RUNTIME === "edge";

// Simple système de logging
const logger = {
  info: (message: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    }
  },
  error: (message: string, error?: any) => {
    console.error(
      `[ERROR] ${new Date().toISOString()} - ${message}`,
      error || ""
    );
  },
};

// Système de cache simple pour les requêtes fréquentes
const queryCache = new Map<string, { timestamp: number; data: any }>();

/**
 * Fonction pour exécuter des requêtes avec mise en cache
 * @param model Le modèle Mongoose
 * @param queryFn Fonction qui exécute la requête
 * @param cacheKey Clé unique pour la mise en cache
 * @param ttlMs Durée de vie du cache en millisecondes (par défaut 1 minute)
 * @returns Résultat de la requête
 */
export function cachedQuery<T>(
  model: any,
  queryFn: Function,
  cacheKey: string,
  ttlMs = 60000
): Promise<T> {
  // Ne pas utiliser le cache dans Edge Runtime
  if (isEdgeRuntime) {
    return Promise.resolve([] as unknown as T);
  }

  // Vérifier si la requête est en cache et valide
  if (
    queryCache.has(cacheKey) &&
    Date.now() - queryCache.get(cacheKey)!.timestamp < ttlMs
  ) {
    logger.info(`Cache hit for key: ${cacheKey}`);
    return Promise.resolve(queryCache.get(cacheKey)!.data);
  }

  // Si pas en cache ou expiré, exécuter la requête
  logger.info(`Cache miss for key: ${cacheKey}`);
  return queryFn(model).then((result: T) => {
    queryCache.set(cacheKey, {
      timestamp: Date.now(),
      data: result,
    });
    return result;
  });
}

/**
 * Fonction générique pour créer un modèle mongoose avec pattern singleton
 * @param modelName Nom du modèle
 * @param schema Schéma mongoose
 * @returns Instance du modèle
 */
function createModel<T>(
  modelName: string,
  schema: mongoose.Schema<T> | any // Permettre les objets factices pour Edge
): Model<T> | any {
  // Dans un environnement Edge, retourner un objet factice
  if (isEdgeRuntime) {
    return {
      modelName,
      find: () => Promise.resolve([]),
      findOne: () => Promise.resolve(null),
      findById: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      // Autres méthodes communes de modèle
    };
  }

  // Utiliser un modèle existant ou en créer un nouveau
  logger.info(`Initialisation du modèle ${modelName}`);
  return mongoose.models[modelName] || mongoose.model<T>(modelName, schema);
}

// Modèles avec pattern singleton
export const User = createModel<IUser>("User", userSchema);
export const Node = createModel<INode>("Node", nodeSchema);
export const Session = createModel<ISession>("Session", sessionSchema);
export const NetworkStats = createModel<INetworkStats>(
  "NetworkStats",
  networkStatsSchema
);

// Export d'objets pour le client
// Ces objets sont vides côté client, mais permettent de maintenir la compatibilité de type
export const clientSideModels = {
  User: {} as typeof User,
  Node: {} as typeof Node,
  Session: {} as typeof Session,
  NetworkStats: {} as typeof NetworkStats,
};

/**
 * Fonction qui retourne le bon modèle en fonction de l'environnement
 * @param serverModel Le modèle côté serveur
 * @param clientStub Le stub côté client
 * @returns Le modèle approprié selon l'environnement
 */
export function getModel<T>(serverModel: T, clientStub: T): T {
  return typeof window === "undefined" ? serverModel : clientStub;
}

// Exports pour utilisation dans l'application
export const UserModel = getModel(User, clientSideModels.User);
export const NodeModel = getModel(Node, clientSideModels.Node);
export const SessionModel = getModel(Session, clientSideModels.Session);
export const NetworkStatsModel = getModel(
  NetworkStats,
  clientSideModels.NetworkStats
);
