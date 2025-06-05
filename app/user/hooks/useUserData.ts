import { useSupabase } from '@/app/providers/SupabaseProvider'
import { useState, useEffect } from 'react'
import type { 
  UserProfile, 
  NodeStats, 
  Recommendation, 
  Achievement, 
  ProfileField,
  CRMData 
} from '../types';

interface UseUserDataReturn {
  // User data
  userProfile: UserProfile;
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
            setProfile(data.user as UserProfile);
          } else {
            console.error('Erreur lors de la récupération du profil:', response.status);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, session, loading])

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      if (user) {
        try {
          // Simuler des stats de nœud (à remplacer par de vrais appels API)
          setNodeStats({
            monthlyRevenue: 12450,
            totalCapacity: 2100000,
            activeChannels: 8,
            uptime: 99.8,
            healthScore: 85,
            routingEfficiency: 78,
            revenueGrowth: 15.2,
            rankInNetwork: 892,
            totalNodes: 18650
          });

          setHasNode(true);
          setIsPremium(false);
          setIsLoading(false);
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

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
        completed: !!profile?.twitterHandle,
        priority: 'low',
        href: '/user/settings'
      },
      { 
        name: 'nostr', 
        label: 'Compte Nostr', 
        completed: !!profile?.nostrPubkey,
        priority: 'low',
        href: '/user/settings'
      },
      { 
        name: 'phone', 
        label: 'Téléphone vérifié', 
        completed: !!profile?.phoneVerified,
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

  // Mock recommendations data
  const recommendations: Recommendation[] = [
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
  ];

  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Premier canal',
      description: 'Ouvrir votre premier canal Lightning',
      icon: '🎯',
      unlocked: true,
      progress: 1,
      target: 1
    },
    {
      id: '2',
      title: 'Routeur débutant',
      description: 'Router votre premier paiement',
      icon: '🛣️',
      unlocked: true,
      progress: 1,
      target: 1
    },
    {
      id: '3',
      title: 'Hub en croissance',
      description: 'Atteindre 10 canaux actifs',
      icon: '🌟',
      unlocked: false,
      progress: 8,
      target: 10
    },
    {
      id: '4',
      title: 'Millionnaire sats',
      description: 'Accumuler 1M sats de revenus',
      icon: '💰',
      unlocked: false,
      progress: 124500,
      target: 1000000
    }
  ];

  // Mock trend data pour les graphiques
  const trendData = [8500, 9200, 11000, 9800, 12400, 15600, 13200];

  // Actions
  const updateProfile = (profile: Partial<UserProfile>): void => {
    setProfile(prev => ({ ...prev, ...profile } as UserProfile));
  };

  const applyRecommendation = (id: string): void => {
    console.log('Applying recommendation:', id);
    // TODO: Implémenter l'application de la recommandation
    // Ici on pourrait faire un appel API et mettre à jour les stats
  };

  const upgradeToPremium = (): void => {
    console.log('Upgrading to premium');
    window.location.href = '/user/subscriptions';
  };

  return {
    // User data
    userProfile: profile as UserProfile,
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