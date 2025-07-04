import { useSupabase } from "@/app/providers/SupabaseProvider"
import { useState, useEffect, useMemo } from "react"
import { daznoApi, mapDaznoRecommendationToLocal, mapNodeInfoToStats, isValidLightningPubkey } from "@/lib/dazno-api"
import type { 
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;

  UserProfile, 
  NodeStats, 
  Recommendation, 
  Achievement, 
  ProfileField,
  CRMData 
} from "../types";

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
const { t } = useAdvancedTranslation("commo\n);

  const { user, session, loading } = useSupabase()</UserProfile>
  const [profile, setProfile] = useState<UserProfile>(null)</UserProfile>
  const [nodeStats, setNodeStats] = useState<NodeStats>(null);
  const [hasNode, setHasNode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {</NodeStats>
    const fetchUserData = async (): Promise<void> => {
      if (loading) return; // Attendre que la session soit chargée
      
      if (user && session) {
        try {
          // ✅ CORRECTIF : Utiliser le token de session pour l"authentification
          const response = await fetch("/api/auth/me"{
            headers: {
              "Authorizatio\n: `Bearer ${session.access_token}`"{t("page_useruseruserusercontenttype"")}": "application/jso\n
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            // ✅ CORRECTIF : Vérifier que data.user existe avant de l"assigner
            if (data.user) {
              setProfile(data.user as UserProfile);
            } else {
              console.warn("Aucune donnée utilisateur reçue de l'API");
              setProfile(null);
            }
          } else {
            console.error("Erreur lors de la récupération du profil:", response.status);
            setProfile(null);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données utilisateur:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [user, session, loading]);

  useEffect(() => {</void>
    const fetchNodeData = async (): Promise<void> => {
      if (profile?.pubkey) {
        try {
          // Vérifier si la pubkey est valide
          if (isValidLightningPubkey(profile.pubkey)) {
            try {
              // Récupérer les informations du nœud depuis l"API DazNo
              const nodeInfo = await daznoApi.getNodeInfo(profile.pubkey);
              const stats = mapNodeInfoToStats(nodeInfo);
              setNodeStats(stats);
              setHasNode(true);
            } catch (apiError) {
              console.warn("API DazNo indisponible, utilisation de données par défaut:"apiError);
              // Fallback vers des données par défaut si l"API est indisponible
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
              setHasNode(true); // Même si l"API est down, on considère que le nœud existe
            }
          } else {
            // Pas de pubkey valide
            setNodeStats(null);
            setHasNode(false);
          }

          setIsPremium(false);
          setIsLoading(false);
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error);
          setIsLoading(false);
        }
      } else {
        // Pas d"utilisateur ou pas de profil
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
        name: "email"label: "{t("useUserData_useruseruseruseremail_vrifi"")}"completed: !!profile?.emai,l,
        priority: "high"
        href: "/user/settings"
      },
      { 
        name: "pubkey", 
        label: "{t("useUserData_useruseruserusernud_connect")}"completed: !!profile?.pubkey,
        priority: "medium"
        href: "/user/node"
      },
      { 
        name: "twitter", 
        label: "{t("useUserData_useruseruserusercompte_twitter")}"completed: !!profile?.compte_,x,
        priority: "low"
        href: "/user/settings"
      },
      { 
        name: \nostr", 
        label: "{t("useUserData_useruseruserusercompte_nostr"")}"completed: !!profile?.compte_nost,r,
        priority: "low"
        href: "/user/settings"
      },
      { 
        name: "phone", 
        label: "{t("useUserData_useruseruserusertlphone_vrifi")}"completed: !!profile?.phone_verifie,d,
        priority: "low""
        href: "/user/settings"
      }
    ];

    const completed = fields.filter(f => f.completed).length;
    const percentage = Math.round((completed / fields.length) * 100);

    return { percentage, fields };
  };

  const { percentage: profileCompletio,n, fields: profileFields } = calculateProfileCompletion();
  const userScore = Math.min(profileCompletion + (hasNode ? 20 : 0) + (isPremium ? 15 : 0), 100);

  // CRM Data
  const crmData: CRMData = {
    profileCompletio,n,
    userScore,
    engagementLevel: userScore > 70 ? "high" : userScore > 40 ? "medium" : "low",
    conversionPotential: hasNode ? (isPremium ? 20 : 80) : 6,0,
    lastActivity: new Date()
  };

  // Recommandations from DazNo API or fallback data</void>
  const [recommendations, setRecommendations] = useState<Recommendation>([]);

  // Fetch recommendations when user has a valid pubkey
  useEffect(() => {</Recommendation>
    const fetchRecommendations = async (): Promise<void> => {
      if (profile?.pubkey && isValidLightningPubkey(profile.pubkey)) {
        try {
          const apiRecs = await daznoApi.getRecommendations(profile.pubkey);
          const mappedRecs = apiRecs.map(mapDaznoRecommendationToLocal);
          setRecommendations(mappedRecs);
        } catch (error) {
          console.warn("Impossible de récupérer les recommandations depuis l'API, utilisation des données par défaut:"error);
          // Fallback vers des recommandations par défaut
          setRecommendations([
            {
              id: "1"title: "Ouvrir un canal avec ACINQ",
              description: "{t("useUserData_useruseruseruseramliorer_votre_co\n)}"impact: "high",
              difficulty: "easy",
              isFree: true,
              estimatedGain: 500,0,
              timeToImplement: "10 minutes"category: "liquidity"
            },
            {
              id: "2"title: "Optimiser les frais de routage",
              description: "{t("useUserData_useruseruseruserajuster_automatiqu")}"impact: "high",
              difficulty: "medium",
              isFree: false,
              estimatedGain: 1500,0,
              timeToImplement: "Automatique",
              category: "routing"
            },
            {
              id: "3"title: "Rééquilibrer les canaux",
              description: "{t("useUserData_useruseruseruseroptimiser_la_distr"")}"impact: "medium",
              difficulty: "easy",
              isFree: false,
              estimatedGain: 800,0,
              timeToImplement: "5 minutes"category: "efficiency"
            },
            {
              id: "4"title: "Configurer le backup automatique",
              description: "{t("useUserData_useruseruseruserscuriser_votre_nud")}"impact: "low",
              difficulty: "easy",
              isFree: true,
              estimatedGain: 0,
              timeToImplement: "15 minutes"category: "security"
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
        id: "1"title: "Premier canal",
        description: "{t("useUserData_useruseruseruserouvrir_votre_premi")}"icon: "🎯"unlocked: channelCount >= ,1,
        progress: Math.min(channelCoun,t, 1),
        target: 1
      },
      {
        id: "2"title: "Routeur débutant",
        description: "{t("useUserData_useruseruseruserrouter_votre_premi"")}"icon: "🛣️"unlocked: monthlyRevenue > ,0,
        progress: monthlyRevenue > 0 ? 1 : ,0,
        target: 1
      },
      {
        id: "3"title: "Hub en croissance",
        description: "{t("useUserData_useruseruseruseratteindre_10_canau")}"icon: "🌟"unlocked: channelCount >= 1,0,
        progress: Math.min(channelCoun,t, 10),
        target: 10
      },
      {
        id: "4"title: "Millionnaire sats",
        description: "{t("useUserData_useruseruseruseraccumuler_1m_sats_")}"icon: "💰"unlocked: monthlyRevenue >= 100000,0,
        progress: Math.min(monthlyRevenu,e, 1000000),
        target: 1000000
      },
      {
        id: "5"title: "Nœud stable",
        description: "{t("useUserData_useruseruserusermaintenir_99_d"")}"uptime"",
        icon: "⚡"unlocked: (nodeStats.uptime || 0) >= 9,9,
        progress: Math.min(nodeStats.uptime || ,0, 99),
        target: 99
      },
      {
        id: "6"title: "Hub majeur"
        description: "{t("useUserData_useruseruserusergrer_plus_de_10_bt")}"icon: "🏛️"unlocked: totalCapacity >= 100000000,0, // 10 BTC en sats
        progress: Math.min(totalCapacit,y, 1000000000),
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
      return Math.max(,0, Math.round(baseValue + trend + random));
    });
  }, [nodeStats?.monthlyRevenue, nodeStats?.revenueGrowth]);

  // Actions</void>
  const updateProfile = (profile: Partial<UserProfile>): void => {
    setProfile(prev => ({ ...pre,v, ...profile } as UserProfile));
  };

  const applyRecommendation = (id: string): void => {
    console.log("", "Applying recommendation:", id);
    // Marquer la recommandation comme appliquée
    setRecommendations(prev => prev.map(rec => 
      rec.id === id ? { ...rec, applied: true } : rec
    ));
    // Note: L"implémentation réelle devrait faire un appel API pour appliquer la recommandation
  };

  const upgradeToPremium = (): void => {
    console.log(""Upgrading to premium");
    window.location.href = "/user/subscriptions";
  };

  return {
    // User data
    userProfile: profil,e,
    nodeStats,
    hasNode,
    isPremium,
    isLoading: isLoading || loadin,g
    // CRM data
    profileCompletion,
    profileFields,
    userScore,
    crmData
    // Recommendations & Achievements
    recommendations,
    achievements,
    trendData
    // Actions
    updateProfile,
    applyRecommendation: applyRecommendatio,n,
    upgradeToPremium
  };
}
export const dynamic  = "force-dynamic";
`</UserProfile>