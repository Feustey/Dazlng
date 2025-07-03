import { useSupabase } from '@/app/providers/SupabaseProvider'
import { useState, useEffect, useMemo } from 'react'
import { daznoApi, mapDaznoRecommendationToLocal, mapNodeInfoToStats, isValidLightningPubkey } from '@/lib/dazno-api'
import type { 
  UserProfile, 
  NodeStats, 
  Recommendation, 
  Achievement, 
  ProfileField,
  CRMData 
} from '../types';

export interface UseUserDataReturn {
  // User data
  userProfile: UserProfile | null;
  nodeStats: NodeStats | null;
  hasNode: boolean;
  isPremium: boolean;
  isLoading: boolean;
  
  // CRM data
  profileCompletion: number;
  profileFields: ProfileField[];
  userScore: number;
  crmData: CRMData;
  
  // Recommendations & Achievements
  recommendations: Recommendation[];
  achievements: Achievement[];
  trendData: number[];
  
  // Actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  applyRecommendation: (id: string) => void;
  upgradeToPremium: () => void;
}

export function useUserData(): UseUserDataReturn {
  const { user, session, loading } = useSupabase()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [nodeStats, setNodeStats] = useState<NodeStats | null>(null);
  const [hasNode, setHasNode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      if (loading) return; // Attendre que la session soit chargée
      
      if (user && session) {
        try {
          // ✅ CORRECTIF : Utiliser le token de session pour l'authentification
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            // ✅ CORRECTIF : Vérifier que data.user existe avant de l'assigner
            if (data.user) {
              setProfile(data.user as UserProfile);
            } else {
              console.warn('Aucune donnée utilisateur reçue de l\'API');
              setProfile(null);
            }
          } else {
            console.error('Erreur lors de la récupération du profil:', response.status);
            setProfile(null);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur:', error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [user, session, loading]);

  useEffect(() => {
    const fetchNodeData = async (): Promise<void> => {
      if (profile?.pubkey) {
        try {
          // Vérifier si la pubkey est valide
          if (isValidLightningPubkey(profile.pubkey)) {
            try {
              // Récupérer les informations du nœud depuis l'API DazNo
              const nodeInfo = await daznoApi.getNodeInfo(profile.pubkey);
              const stats = mapNodeInfoToStats(nodeInfo);
              setNodeStats(stats);
              setHasNode(true);
            } catch (apiError) {
              console.warn('API DazNo indisponible, utilisation de données par défaut:', apiError);
              // Fallback vers des données par défaut si l'API est indisponible
              setNodeStats({
                monthlyRevenue: 0,
                totalCapacity: 0,
                activeChannels: 0,
                uptime: 0,
                healthScore: 0,
                routingEfficiency: 0,
                revenueGrowth: 0,
                rankInNetwork: 0,
                totalNodes: 0
              });
              setHasNode(true); // Même si l'API est down, on considère que le nœud existe
            }
          } else {
            // Pas de pubkey valide
            setNodeStats(null);
            setHasNode(false);
          }

          setIsPremium(false);
          setIsLoading(false);
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
          setIsLoading(false);
        }
      } else {
        // Pas d'utilisateur ou pas de profil
        setNodeStats(null);
        setHasNode(false);
        setIsLoading(false);
      }
    };

    fetchNodeData();
  }, [profile]);

  // Calcul de la complétude du profil pour le CRM
  const calculateProfileCompletion = (): { percentage: number; fields: ProfileField[] } => {
    const fields: ProfileField[] = [
      { 
        name: 'email', 
        label: 'Email vérifié', 
        completed: !!profile?.email,
        priority: 'high',
        href: '/user/settings'
      },
      { 
        name: 'pubkey', 
        label: 'Nœud connecté', 
        completed: !!profile?.pubkey,
        priority: 'medium',
        href: '/user/node'
      },
      { 
        name: 'twitter', 
        label: 'Compte Twitter', 
        completed: !!profile?.compte_x,
        priority: 'low',
        href: '/user/settings'
      },
      { 
        name: 'nostr', 
        label: 'Compte Nostr', 
        completed: !!profile?.compte_nostr,
        priority: 'low',
        href: '/user/settings'
      },
      { 
        name: 'phone', 
        label: 'Téléphone vérifié', 
        completed: !!profile?.phone_verified,
        priority: 'low',
        href: '/user/settings'
      }
    ];

    const completed = fields.filter(f => f.completed).length;
    const percentage = Math.round((completed / fields.length) * 100);

    return { percentage, fields };
  };

  const { percentage: profileCompletion, fields: profileFields } = calculateProfileCompletion();
  const userScore = Math.min(profileCompletion + (hasNode ? 20 : 0) + (isPremium ? 15 : 0), 100);

  // CRM Data
  const crmData: CRMData = {
    profileCompletion,
    userScore,
    engagementLevel: userScore > 70 ? 'high' : userScore > 40 ? 'medium' : 'low',
    conversionPotential: hasNode ? (isPremium ? 20 : 80) : 60,
    lastActivity: new Date()
  };

  // Recommandations from DazNo API or fallback data
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Fetch recommendations when user has a valid pubkey
  useEffect(() => {
    const fetchRecommendations = async (): Promise<void> => {
      if (profile?.pubkey && isValidLightningPubkey(profile.pubkey)) {
        try {
          const apiRecs = await daznoApi.getRecommendations(profile.pubkey);
          const mappedRecs = apiRecs.map(mapDaznoRecommendationToLocal);
          setRecommendations(mappedRecs);
        } catch (error) {
          console.warn('Impossible de récupérer les recommandations depuis l\'API, utilisation des données par défaut:', error);
          // Fallback vers des recommandations par défaut
          setRecommendations([
            {
              id: '1',
              title: 'Ouvrir un canal avec ACINQ',
              description: 'Améliorer votre connectivité en vous connectant à un hub majeur du réseau',
              impact: 'high',
              difficulty: 'easy',
              isFree: true,
              estimatedGain: 5000,
              timeToImplement: '10 minutes',
              category: 'liquidity'
            },
            {
              id: '2',
              title: 'Optimiser les frais de routage',
              description: 'Ajuster automatiquement vos frais en fonction des conditions du marché',
              impact: 'high',
              difficulty: 'medium',
              isFree: false,
              estimatedGain: 15000,
              timeToImplement: 'Automatique',
              category: 'routing'
            },
            {
              id: '3',
              title: 'Rééquilibrer les canaux',
              description: 'Optimiser la distribution de liquidité pour maximiser les revenus',
              impact: 'medium',
              difficulty: 'easy',
              isFree: false,
              estimatedGain: 8000,
              timeToImplement: '5 minutes',
              category: 'efficiency'
            },
            {
              id: '4',
              title: 'Configurer le backup automatique',
              description: 'Sécuriser votre nœud avec des sauvegardes régulières',
              impact: 'low',
              difficulty: 'easy',
              isFree: true,
              estimatedGain: 0,
              timeToImplement: '15 minutes',
              category: 'security'
            }
          ]);
        }
      } else {
        setRecommendations([]);
      }
    };

    fetchRecommendations();
  }, [profile?.pubkey]);

  // Achievements data based on user stats
  const achievements: Achievement[] = useMemo(() => {
    if (!nodeStats) return [];
    
    const channelCount = nodeStats.activeChannels || 0;
    const totalCapacity = nodeStats.totalCapacity || 0;
    const monthlyRevenue = nodeStats.monthlyRevenue || 0;
    
    return [
      {
        id: '1',
        title: 'Premier canal',
        description: 'Ouvrir votre premier canal Lightning',
        icon: '🎯',
        unlocked: channelCount >= 1,
        progress: Math.min(channelCount, 1),
        target: 1
      },
      {
        id: '2',
        title: 'Routeur débutant',
        description: 'Router votre premier paiement',
        icon: '🛣️',
        unlocked: monthlyRevenue > 0,
        progress: monthlyRevenue > 0 ? 1 : 0,
        target: 1
      },
      {
        id: '3',
        title: 'Hub en croissance',
        description: 'Atteindre 10 canaux actifs',
        icon: '🌟',
        unlocked: channelCount >= 10,
        progress: Math.min(channelCount, 10),
        target: 10
      },
      {
        id: '4',
        title: 'Millionnaire sats',
        description: 'Accumuler 1M sats de revenus',
        icon: '💰',
        unlocked: monthlyRevenue >= 1000000,
        progress: Math.min(monthlyRevenue, 1000000),
        target: 1000000
      },
      {
        id: '5',
        title: 'Nœud stable',
        description: 'Maintenir 99% d\'uptime',
        icon: '⚡',
        unlocked: (nodeStats.uptime || 0) >= 99,
        progress: Math.min(nodeStats.uptime || 0, 99),
        target: 99
      },
      {
        id: '6',
        title: 'Hub majeur',
        description: 'Gérer plus de 10 BTC de capacité',
        icon: '🏛️',
        unlocked: totalCapacity >= 1000000000, // 10 BTC en sats
        progress: Math.min(totalCapacity, 1000000000),
        target: 1000000000
      }
    ];
  }, [nodeStats]);

  // Trend data basé sur les revenus mensuels réels
  const trendData = useMemo(() => {
    if (!nodeStats?.monthlyRevenue) return [0, 0, 0, 0, 0, 0, 0];
    
    const currentRevenue = nodeStats.monthlyRevenue;
    const growth = nodeStats.revenueGrowth || 0;
    
    // Générer une tendance réaliste basée sur les données actuelles
    const baseValue = currentRevenue;
    const variance = baseValue * 0.15; // 15% de variance
    
    return Array.from({ length: 7 }, (_: any, i: any) => {
      const trend = growth * (i - 3); // Tendance centrée
      const random = (Math.random() - 0.5) * variance;
      return Math.max(0, Math.round(baseValue + trend + random));
    });
  }, [nodeStats?.monthlyRevenue, nodeStats?.revenueGrowth]);

  // Actions
  const updateProfile = (profile: Partial<UserProfile>): void => {
    setProfile(prev => ({ ...prev, ...profile } as UserProfile));
  };

  const applyRecommendation = (id: string): void => {
    console.log('Applying recommendation:', id);
    // Marquer la recommandation comme appliquée
    setRecommendations(prev => prev.map(rec => 
      rec.id === id ? { ...rec, applied: true } : rec
    ));
    // Note: L'implémentation réelle devrait faire un appel API pour appliquer la recommandation
  };

  const upgradeToPremium = (): void => {
    console.log('Upgrading to premium');
    window.location.href = '/user/subscriptions';
  };

  return {
    // User data
    userProfile: profile,
    nodeStats,
    hasNode,
    isPremium,
    isLoading: isLoading || loading,
    
    // CRM data
    profileCompletion,
    profileFields,
    userScore,
    crmData,
    
    // Recommendations & Achievements
    recommendations,
    achievements,
    trendData,
    
    // Actions
    updateProfile,
    applyRecommendation: applyRecommendation,
    upgradeToPremium
  };
}
export const dynamic = "force-dynamic";
