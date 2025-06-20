/**
 * Client API Dazno.de pour l'analyse Lightning Network
 * Intègre SparkSeer + OpenAI pour des recommandations complètes
 */

import { 
  DaznoCompleteResponse, 
  DaznoPriorityRequest, 
  DaznoPriorityResponse,
  DaznoNodeInfoDetailed,
  DaznoRecommendationsResponse,
  DaznoAuthCredentials,
  isDaznoValidContext,
  isDaznoValidGoal,
} from '@/types/dazno-api'

const isValidLightningPubkey = (pubkey: string): boolean => {
  return /^[0-9a-fA-F]{66}$/.test(pubkey)
}

class DaznoAPI {
  private baseURL: string
  private credentials: DaznoAuthCredentials | null = null
  private initialized = false

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_DAZNO_API_URL || 'https://api.dazno.de'
  }

  /**
   * Initialise l'API avec les credentials
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) return true

    try {
      console.log('🔄 Initialisation Dazno API...')
      
      // Option 1: Utiliser une clé API fixe
      if (process.env.DAZNO_API_KEY) {
        this.credentials = {
          api_key: process.env.DAZNO_API_KEY
        }
        this.initialized = true
        console.log('✅ Dazno API initialisée avec clé API')
        return true
      }

      // Option 2: Récupérer des credentials dynamiques
      const response = await fetch(`${this.baseURL}/auth/credentials`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      this.credentials = await response.json()
      this.initialized = true
      
      console.log('✅ Dazno API initialisée avec credentials dynamiques')
      return true

    } catch (error) {
      console.error('❌ Erreur initialisation Dazno API:', error)
      this.initialized = false
      return false
    }
  }

  /**
   * Effectue une requête authentifiée à l'API
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.initialized) {
      const success = await this.initialize()
      if (!success) {
        throw new Error('Impossible d\'initialiser l\'API Dazno')
      }
    }

    if (!this.credentials) {
      throw new Error('Aucun credential disponible')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    }

    // Authentification par clé API ou Bearer token
    if (this.credentials.api_key) {
      headers['Authorization'] = `Bearer ${this.credentials.api_key}`
    } else if (this.credentials.bearer_token) {
      headers['Authorization'] = `Bearer ${this.credentials.bearer_token}`
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData: any
      
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }

      throw new Error(`Dazno API Error ${response.status}: ${errorData.message || errorText}`)
    }

    const result = await response.json()
    
    // Si l'API retourne un format standardisé avec success/data/error
    if (typeof result === 'object' && 'success' in result) {
      if (!result.success) {
        throw new Error(`API Error: ${result.error?.message || 'Erreur inconnue'}`)
      }
      return result.data || result
    }

    return result
  }

  /**
   * 🚀 ENDPOINT PRINCIPAL - Analyse complète d'un nœud
   * Retourne toutes les données en une seule requête
   */
  async getCompleteNodeAnalysis(
    pubkey: string,
    context: DaznoPriorityRequest['context'] = 'intermediate',
    goals: DaznoPriorityRequest['goals'] = ['increase_revenue']
  ): Promise<DaznoCompleteResponse> {
    if (!isValidLightningPubkey(pubkey)) {
      throw new Error('Pubkey invalide: doit faire 66 caractères hexadécimaux')
    }

    if (!isDaznoValidContext(context)) {
      throw new Error('Contexte invalide: doit être beginner, intermediate ou expert')
    }

    for (const goal of goals) {
      if (!isDaznoValidGoal(goal)) {
        throw new Error(`Objectif invalide: ${goal}`)
      }
    }

    const params = new URLSearchParams({
      context,
      ...goals.reduce((acc, goal, _index) => ({ ...acc, [`goals`]: goal }), {})
    })

    return this.makeRequest<DaznoCompleteResponse>(`/api/v1/node/${pubkey}/complete?${params}`)
  }

  /**
   * 🎯 Actions prioritaires avec OpenAI
   * Génère des recommandations personnalisées et des rapports Markdown
   */
  async getPriorityActions(
    pubkey: string,
    request: DaznoPriorityRequest
  ): Promise<DaznoPriorityResponse> {
    if (!isValidLightningPubkey(pubkey)) {
      throw new Error('Pubkey invalide')
    }

    return this.makeRequest<DaznoPriorityResponse>(`/api/v1/node/${pubkey}/priorities`, {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  /**
   * 📊 Informations détaillées du nœud
   * Données brutes SparkSeer pour analyses approfondies
   */
  async getNodeInfo(pubkey: string): Promise<DaznoNodeInfoDetailed> {
    if (!isValidLightningPubkey(pubkey)) {
      throw new Error('Pubkey invalide')
    }

    return this.makeRequest<DaznoNodeInfoDetailed>(`/api/v1/node/${pubkey}/info`)
  }

  /**
   * ⚡ Recommandations SparkSeer
   * Recommandations techniques pures de SparkSeer
   */
  async getRecommendations(pubkey: string): Promise<DaznoRecommendationsResponse> {
    if (!isValidLightningPubkey(pubkey)) {
      throw new Error('Pubkey invalide')
    }

    return this.makeRequest<DaznoRecommendationsResponse>(`/api/v1/node/${pubkey}/recommendations`)
  }

  /**
   * 🔐 Vérifie l'état de l'authentification
   */
  async checkAuth(): Promise<{ authenticated: boolean; expires_at?: string }> {
    try {
      await this.makeRequest('/auth/verify')
      return { 
        authenticated: true, 
        expires_at: this.credentials?.expires_at 
      }
    } catch {
      return { authenticated: false }
    }
  }

  /**
   * 🏥 Vérifie l'état de santé de l'API
   */
  async checkHealth(): Promise<{ status: string; timestamp: string; services?: any }> {
    return this.makeRequest('/health')
  }

  /**
   * Utilitaires
   */
  isValidPubkey(pubkey: string): boolean {
    return isValidLightningPubkey(pubkey)
  }

  isInitialized(): boolean {
    return this.initialized
  }

  getCredentials(): DaznoAuthCredentials | null {
    return this.credentials
  }

  async reinitialize(): Promise<boolean> {
    this.initialized = false
    this.credentials = null
    return this.initialize()
  }

  /**
   * ⚡ Crée une facture Lightning via l'API Dazno
   */
  async createInvoice(params: {
    amount: number;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<{
    paymentRequest: string;
    paymentHash: string;
    amount: number;
    expiresAt: string;
    createdAt: string;
  }> {
    const body = {
      amount: params.amount,
      description: params.description,
      metadata: params.metadata || {},
    };
    // L'endpoint officiel pour la création de facture est /api/v1/lightning/decoder (POST)
    // Si un endpoint /api/v1/lightning/create-invoice existe, remplacer ici
    return this.makeRequest<{
      paymentRequest: string;
      paymentHash: string;
      amount: number;
      expiresAt: string;
      createdAt: string;
    }>(`/api/v1/lightning/decoder`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Vérifie le statut d'un paiement Lightning via l'API Dazno
   */
  async checkInvoiceStatus(paymentHash: string): Promise<'settled' | 'pending' | 'expired'> {
    const body = { payment_hash: paymentHash };
    // L'endpoint officiel pour le check est /api/v1/lightning/check-payment (POST)
    // Adapter si l'API attend un autre format
    const res = await this.makeRequest<{ status: 'settled' | 'pending' | 'expired' }>(
      '/api/v1/lightning/check-payment',
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );
    return res.status;
  }
}

// Instance singleton
export const daznoAPI = new DaznoAPI()
export default daznoAPI 