'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ExperimentConfig {
  name: string;
  variants: Record<string, any>;
  allocation: Record<string, number>;
  targetMetric: string;
  status: 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
}

interface ABTestContextType {
  getVariant: (experimentName: string) => string;
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  experiments: ExperimentConfig[];
}

const ABTestContext = createContext<ABTestContextType | null>(null);

export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within ABTestProvider');
  }
  return context;
};

class ABTestManager {
  private experiments: Map<string, ExperimentConfig> = new Map();
  private userId: string;
  private variantCache: Map<string, string> = new Map();

  constructor(userId: string) {
    this.userId = userId;
    this.initializeExperiments();
  }

  private initializeExperiments() {
    // Initialize with predefined experiments
    const experiments: ExperimentConfig[] = [
      {
        name: 'hero_cta_text',
        variants: {
          control: 'Essai gratuit 7 jours',
          variant_a: 'Voir la démo maintenant',
          variant_b: 'Calculer mon ROI'
        },
        allocation: { control: 40, variant_a: 30, variant_b: 30 },
        targetMetric: 'email_signup',
        status: 'active',
        startDate: new Date('2024-01-01')
      },
      {
        name: 'pricing_visibility',
        variants: {
          control: 'hidden_pricing',
          variant_a: 'hero_pricing',
          variant_b: 'sticky_pricing'
        },
        allocation: { control: 33, variant_a: 33, variant_b: 34 },
        targetMetric: 'trial_signup',
        status: 'active',
        startDate: new Date('2024-01-01')
      },
      {
        name: 'hero_layout',
        variants: {
          control: 'traditional',
          variant_a: 'split_screen',
          variant_b: 'video_background'
        },
        allocation: { control: 50, variant_a: 25, variant_b: 25 },
        targetMetric: 'scroll_depth',
        status: 'active',
        startDate: new Date('2024-01-01')
      },
      {
        name: 'social_proof_type',
        variants: {
          control: 'testimonials',
          variant_a: 'live_metrics',
          variant_b: 'customer_logos'
        },
        allocation: { control: 40, variant_a: 30, variant_b: 30 },
        targetMetric: 'trust_score',
        status: 'active',
        startDate: new Date('2024-01-01')
      }
    ];

    experiments.forEach(exp => {
      this.experiments.set(exp.name, exp);
    });
  }

  getVariant(experimentName: string): string {
    // Check cache first
    const cacheKey = `${experimentName}_${this.userId}`;
    if (this.variantCache.has(cacheKey)) {
      return this.variantCache.get(cacheKey)!;
    }

    const experiment = this.experiments.get(experimentName);
    if (!experiment || experiment.status !== 'active') {
      return 'control';
    }
    
    // Hash consistant basé sur userId + experiment name
    const hash = this.hashCode(this.userId + experimentName);
    const bucket = Math.abs(hash) % 100;
    
    let cumulative = 0;
    for (const [variant, allocation] of Object.entries(experiment.allocation)) {
      cumulative += allocation;
      if (bucket < cumulative) {
        this.variantCache.set(cacheKey, variant);
        
        // Track assignment
        this.trackAssignment(experimentName, variant);
        
        return variant;
      }
    }
    
    this.variantCache.set(cacheKey, 'control');
    return 'control';
  }
  
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  private trackAssignment(experimentName: string, variant: string) {
    // Track experiment assignment
    if (typeof window !== 'undefined') {
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'experiment_assignment', {
          experiment_name: experimentName,
          variant: variant,
          user_id: this.userId
        });
      }

      // Store in localStorage for persistence
      const assignments = JSON.parse(localStorage.getItem('ab_assignments') || '{}');
      assignments[experimentName] = {
        variant,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('ab_assignments', JSON.stringify(assignments));
    }
  }

  trackEvent(event: string, properties: Record<string, any> = {}) {
    // Add current experiment variants to event properties
    const experimentData: Record<string, string> = {};
    this.experiments.forEach((config, name) => {
      if (config.status === 'active') {
        experimentData[`exp_${name}`] = this.getVariant(name);
      }
    });

    const enrichedProperties = {
      ...properties,
      ...experimentData,
      user_id: this.userId,
      timestamp: new Date().toISOString()
    };

    // Send to analytics
    if (typeof window !== 'undefined') {
      if (window.gtag) {
        window.gtag('event', event, enrichedProperties);
      }

      // Send to internal analytics API
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { "ABTestManager.abtestmanagerabtestmanagercont": 'application/json' },
        body: JSON.stringify({
          event,
          properties: enrichedProperties
        })
      }).catch(console.error);
    }
  }

  getExperiments(): ExperimentConfig[] {
    return Array.from(this.experiments.values());
  }
}

interface ABTestProviderProps {
  children: ReactNode;
  userId?: string;
}

export const ABTestProvider: React.FC<ABTestProviderProps> = ({ 
  children, 
  userId = 'anonymous' 
}) => {
  const [manager, setManager] = useState<ABTestManager | null>(null);

  useEffect(() => {
    // Generate or get persistent user ID
    let finalUserId = userId;
    if (userId === 'anonymous' && typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_id');
      if (stored) {
        finalUserId = stored;
      } else {
        finalUserId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('user_id', finalUserId);
      }
    }

    const newManager = new ABTestManager(finalUserId);
    setManager(newManager);
  }, [userId]);

  if (!manager) {
    return <>{children}</>;
  }

  const contextValue: ABTestContextType = {
    getVariant: (experimentName: string) => manager.getVariant(experimentName),
    trackEvent: (event: string, properties?: Record<string, any>) => 
      manager.trackEvent(event, properties),
    experiments: manager.getExperiments()
  };

  return (
    <ABTestContext.Provider value={contextValue}>
      {children}
    </ABTestContext.Provider>
  );
};

// Hook for getting variant values
export const useVariant = (experimentName: string) => {
  const { getVariant, trackEvent } = useABTest();
  const variant = getVariant(experimentName);

  useEffect(() => {
    // Track exposure to experiment
    trackEvent('experiment_exposure', {
      experiment_name: experimentName,
      variant: variant
    });
  }, [experimentName, variant, trackEvent]);

  return variant;
};

// Hook for tracking conversions
export const useConversionTracking = () => {
  const { trackEvent } = useABTest();

  const trackConversion = (conversionType: string, properties?: Record<string, any>) => {
    trackEvent('conversion', {
      conversion_type: conversionType,
      ...properties
    });
  };

  return { trackConversion };
};

// Component for A/B testing specific elements
interface ABTestProps {
  experiment: string;
  variants: Record<string, ReactNode>;
  children?: ReactNode;
}

export const ABTest: React.FC<ABTestProps> = ({ 
  experiment, 
  variants, 
  children 
}) => {
  const variant = useVariant(experiment);
  
  // Return the appropriate variant or fallback to children
  return <>{variants[variant] || children || variants.control}</>;
};

// Analytics Dashboard Component (for admin use)
export const ABTestDashboard: React.FC = () => {
  const { experiments } = useABTest();
  const [results, setResults] = useState<Record<string, any>>({});

  useEffect(() => {
    // Fetch experiment results from API
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/analytics/ab-test-results');
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching A/B test results:', error);
      }
    };

    fetchResults();
    const interval = setInterval(fetchResults, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ab-test-dashboard bg-gray-900 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">{t('ABTestManager.tableau_de_bord_ab_testing')}</h3>
      
      <div className="space-y-6">
        {experiments.filter(exp => exp.status === 'active').map(experiment => (
          <div key={experiment.name} className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-white">{experiment.name}</h4>
              <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded text-sm">
                {experiment.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(experiment.variants).map(([variant, _]) => {
                const variantResults = results[experiment.name]?.[variant] || {};
                const conversionRate = variantResults.conversion_rate || 0;
                const participants = variantResults.participants || 0;
                
                return (
                  <div key={variant} className="bg-gray-700 rounded p-3">
                    <h5 className="font-medium text-white mb-2">{variant}</h5>
                    <div className="text-sm text-gray-300">
                      <div>Participants: {participants}</div>
                      <div>Conversion: {(conversionRate * 100).toFixed(1)}%</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Allocation: {experiment.allocation[variant]}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              Métrique cible: {experiment.targetMetric} • 
              Démarré: {experiment.startDate.toLocaleDateString('fr-FR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};