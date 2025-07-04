import { useState, useCallback } from 'react'
import { 
  DaznoCompleteResponse, 
  DaznoPriorityRequest, 
  DaznoPriorityResponse,
  DaznoNodeInfoDetailed,
  DaznoRecommendationsResponse
} from '@/types/dazno-api'

interface UseDaznoAPIState {
  loading: boolean
  error: string | null
  complete: DaznoCompleteResponse | null
  priorities: DaznoPriorityResponse | null
  nodeInfo: DaznoNodeInfoDetailed | null
  recommendations: DaznoRecommendationsResponse | null
}

interface UseDaznoAPIActions {
  getCompleteAnalysis: (
    pubkey: string, 
    context?: DaznoPriorityRequest['context'], 
    goals?: DaznoPriorityRequest['goals']
  ) => Promise<DaznoCompleteResponse | null>
  
  getPriorityActions: (
    pubkey: string, 
    request: DaznoPriorityRequest
  ) => Promise<DaznoPriorityResponse | null>
  
  getNodeInfo: (pubkey: string) => Promise<DaznoNodeInfoDetailed | null>
  getRecommendations: (pubkey: string) => Promise<DaznoRecommendationsResponse | null>
  clearError: () => void
  reset: () => void
}

export interface UseDaznoAPIReturn extends UseDaznoAPIState, UseDaznoAPIActions {}

export const useDaznoAPI = (): UseDaznoAPIReturn => {
  const [state, setState] = useState<UseDaznoAPIState>({
    loading: false,
    error: null,
    complete: null,
    priorities: null,
    nodeInfo: null,
    recommendations: null,
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }))
  }, [])

  const getCompleteAnalysis = useCallback(async (
    pubkey: string,
    context: DaznoPriorityRequest['context'] = 'intermediate',
    goals: DaznoPriorityRequest['goals'] = ['increase_revenue']
  ): Promise<DaznoCompleteResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ context })
      goals.forEach(goal => params.append('goals', goal))

      const response = await fetch(`/api/dazno/complete/${pubkey}?${params}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Erreur lors de l\'analyse')
      }

      setState(prev => ({ 
        ...prev, 
        complete: result.data, 
        loading: false 
      }))

      return result.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      setError(errorMessage)
      return null
    }
  }, [setLoading, setError])

  const getPriorityActions = useCallback(async (
    pubkey: string,
    request: DaznoPriorityRequest
  ): Promise<DaznoPriorityResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/dazno/priorities/${pubkey}`, {
        method: 'POST',
        headers: { "useDaznoAPI.usedaznoapiusedaznoapicontentt": 'application/json' },
        body: JSON.stringify(request)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Erreur lors de la génération des priorités')
      }

      setState(prev => ({ 
        ...prev, 
        priorities: result.data, 
        loading: false 
      }))

      return result.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      setError(errorMessage)
      return null
    }
  }, [setLoading, setError])

  const getNodeInfo = useCallback(async (pubkey: string): Promise<DaznoNodeInfoDetailed | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/dazno/info/${pubkey}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Erreur lors de la récupération des infos')
      }

      setState(prev => ({ 
        ...prev, 
        nodeInfo: result.data, 
        loading: false 
      }))

      return result.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      setError(errorMessage)
      return null
    }
  }, [setLoading, setError])

  const getRecommendations = useCallback(async (pubkey: string): Promise<DaznoRecommendationsResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/dazno/recommendations/${pubkey}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Erreur lors de la récupération des recommandations')
      }

      setState(prev => ({ 
        ...prev, 
        recommendations: result.data, 
        loading: false 
      }))

      return result.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      setError(errorMessage)
      return null
    }
  }, [setLoading, setError])

  const clearError = useCallback(() => {
    setError(null)
  }, [setError])

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      complete: null,
      priorities: null,
      nodeInfo: null,
      recommendations: null,
    })
  }, [])

  return {
    ...state,
    getCompleteAnalysis,
    getPriorityActions,
    getNodeInfo,
    getRecommendations,
    clearError,
    reset,
  }
}

export default useDaznoAPI 