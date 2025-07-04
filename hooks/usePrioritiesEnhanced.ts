import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { EnhancedPriorityResponse } from '@/app/api/dazno/priorities-enhanced/[pubkey]/route'

interface UsePrioritiesEnhancedOptions {
  context?: string
  goals?: string[]
  includeHistorical?: boolean
  depth?: 'standard' | 'detailed'
  logActivity?: boolean
}

interface UsePrioritiesEnhancedResult {
  data: EnhancedPriorityResponse | null
  loading: boolean
  error: Error | null
  fetchPriorities: (pubkey: string, options?: UsePrioritiesEnhancedOptions) => Promise<void>
  reset: () => void
}

export function usePrioritiesEnhanced(): UsePrioritiesEnhancedResult {
  const [data, setData] = useState<EnhancedPriorityResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchPriorities = useCallback(async (
    pubkey: string,
    options: UsePrioritiesEnhancedOptions = {}
  ) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/dazno/priorities-enhanced/${pubkey}`, {
        method: 'POST',
        headers: {
          "usePrioritiesEnhanced.useprioritiesenhancedusepriori": 'application/json',
        },
        body: JSON.stringify({
          context: options.context || "Optimisation complète du nœud Lightning",
          goals: options.goals || ["increase_revenue", "improve_centrality", "optimize_channels"],
          includeHistorical: options.includeHistorical || false,
          depth: options.depth || 'standard',
          logActivity: options.logActivity || false
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Erreur lors de la récupération des priorités')
      }

      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
        toast.success('Analyse des priorités terminée')
      } else {
        throw new Error(result.error?.message || 'Erreur inconnue')
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue')
      setError(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    fetchPriorities,
    reset
  }
}