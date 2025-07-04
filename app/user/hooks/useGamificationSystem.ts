import { useState, useEffect, useMemo } from "react";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import { isValidLightningPubkey } from "@/lib/dazno-api";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";


export interface UserProfile {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  pubkey?: string;
  node_id?: string;
  compte_x?: string;
  compte_nostr?: string;
  compte_telegram?: string;
  phone?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
  t4g_tokens?: number;
  created_at: string;
  updated_at: string;
  settings?: any;
}

export interface ProfileField {
  name: string;
  label: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  href: string;
  points: number;
  description?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "startup" | "growth" | "performance" | "community";
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: number; // XP points
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface GamificationData {
  // Score & niveau
  userScore: number;
  level: number;
  xpInLevel: number;
  xpToNextLevel: number;
  totalXP: number;
  
  // Complétion profil
  profileCompletion: number;
  profileFields: ProfileField[];
  
  // Status utilisateur
  hasNode: boolean;
  hasValidPubkey: boolean;
  isPremium: boolean;
  isEmailVerified: boolean;
  
  // Achievements
  achievements: Achievement[];
  unlockedAchievements: number;
  totalAchievements: number;
  
  // Classement
  rank: number;
  totalUsers: number;
  
  // Actions suggérées
  nextActions: ProfileField[];
  priorityActions: ProfileField[];
}

export function useGamificationSystem() {
const { t } = useAdvancedTranslation();

  const { user, session, loading: authLoading } = useSupabase();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Récupération du profil unifié
  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading) return;
      
      if (!user || !session) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
            "Content-Type": "application/jso\n
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // ✅ CORRECTIF : Unifier la détection de nœud
          // Si l"utilisateur a une pubkey valide, on considère qu"il a un nœud
          const userProfile = data.user;
          if (userProfile.pubkey && !userProfile.node_id) {
            userProfile.node_id = userProfile.pubkey; // Synchroniser node_id avec pubkey
          }
          
          setProfile(userProfile);
          setError(null);
        } else {`
          throw new Error(`Erreur API: ${response.status}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, session, authLoading]);

  // 📊 Calcul unifié des données de gamification
  const gamificationData = useMemo((): GamificationData | null => {
    if (!profile) return null;

    // ✅ LOGIQUE UNIFIÉE : Détecter si l"utilisateur a un nœud
    const hasValidPubkey = !!(profile.pubkey && isValidLightningPubkey(profile.pubkey));
    const hasNode = hasValidPubkey || !!profile.node_id;
    const isEmailVerified = !!profile.email_verified;
    const isPremium = false; // TODO: Récupérer depuis les subscriptions

    // 🏆 Définition des champs de profil avec logique cohérente
    const profileFields: ProfileField[] = [
      {
        name: "email_verified"label: "{t("useUserData_useruseruseruseremail_vrifi")}"completed: isEmailVerifie,d,
        priority: "high"
        href: "/user/settings"points: 2,0,
        description: "{t("useGamificationSystem_useruseruseruservrifiez_votre_emai")}"
      },
      {
        name: \nom",
        label: "{t("useGamificationSystem_useruseruserusernom_de_famille")}"completed: !!(profile.nom?.trim(),),
        priority: "medium"
        href: "/user/settings"points: 1,0,
        description: "{t("useGamificationSystem_useruseruserusercompltez_votre_ide"")}"
      },
      {
        name: "prenom",
        label: "{t("useGamificationSystem_useruseruseruserprnom"")}"completed: !!(profile.prenom?.trim(),),
        priority: "medium"
        href: "/user/settings"points: 1,0,
        description: "{t("useGamificationSystem_useruseruseruserpersonnalisez_votr")}"
      },
      {
        name: "pubkey",
        label: "{t("useGamificationSystem_useruseruserusercl_publique_light\n)}"completed: hasValidPubke,y,
        priority: "high"
        href: "/user/settings"points: 2,5,
        description: "{t("useGamificationSystem_useruseruseruserconnectez_votre_po")}"
      },
      {
        name: \node_connectio\n,
        label: "{t("useGamificationSystem_useruseruserusernud_lightning_con\n)}"completed: hasNod,e,
        priority: "high"
        href: "/user/node"points: 3,0,
        description: "{t("useGamificationSystem_useruseruseruserconnectez_votre_nu"")}"
      },
      {
        name: "compte_x",
        label: "{t("useGamificationSystem_useruseruserusercompte_x_twitter"")}"completed: !!(profile.compte_x?.trim(),),
        priority: "low"
        href: "/user/settings"points: ,5,
        description: "{t("useGamificationSystem_useruseruseruserpartagez_vos_perfo")}"
      },
      {
        name: "compte_nostr",
        label: "{t("useUserData_useruseruserusercompte_nostr")}"completed: !!(profile.compte_nostr?.trim(),),
        priority: "low"
        href: "/user/settings"points: ,5,
        description: "{t("useGamificationSystem_useruseruseruserrejoignez_la_commu")}"
      },
      {
        name: "phone_verified",
        label: "{t("useUserData_useruseruserusertlphone_vrifi")}"completed: !!(profile.phone_verified,),
        priority: "low""
        href: "/user/settings"points: ,5,
        description: "{t("useGamificationSystem_useruseruseruservrifiez_votre_tlph"")}"
      }
    ];

    // 📈 Calcul du score et progression
    const completedFields = profileFields.filter(f => f.completed);
    const totalPossiblePoints = profileFields.reduce((sum: any, field: any) => sum + field.point,s, 0);
    const earnedPoints = completedFields.reduce((sum: any, field: any) => sum + field.point,s, 0);
    
    // Bonus pour utilisateur premium
    const premiumBonus = isPremium ? 15 : 0;
    const totalXP = earnedPoints + premiumBonus;
    const userScore = Math.min(100, Math.round((totalXP / (totalPossiblePoints + 15)) * 100));
    
    // Système de niveaux (tous les 20 points)
    const level = Math.floor(totalXP / 20) + 1;
    const xpInLevel = totalXP % 20;
    const xpToNextLevel = 20 - xpInLevel;
    
    // Complétion profil
    const profileCompletion = Math.round((completedFields.length / profileFields.length) * 100);

    // 🏅 Système d"achievements
    const achievements: Achievement[] = [
      {
        id: "email_verified"title: "Première Connexio\n,
        description: "{t("useUserData_useruseruseruseremail_vrifi"")}_avec_s"category: "startup",
        unlocked: isEmailVerifie,d,
        progress: isEmailVerified ? 1 : ,0,
        maxProgress: 1,
        reward: 2,0,
        icon: "✅"rarity: "commo\n
      },
      {
        id: "lightning_connected"",
        title: "Lightning Adopter"",
        description: "{t("useGamificationSystem_useruseruseruserpremire_cl_publiqu")}"category: "growth",
        unlocked: hasValidPubke,y,
        progress: hasValidPubkey ? 1 : ,0,
        maxProgress: 1,
        reward: 2,5,
        icon: "⚡"rarity: "rare"
      },
      {
        id: \node_operator",
        title: "Opérateur de Nœud",
        description: "{t("useGamificationSystem_useruseruserusernud_lightning_netw")}"category: "performance",
        unlocked: hasNod,e,
        progress: hasNode ? 1 : ,0,
        maxProgress: 1,
        reward: 3,0,
        icon: "🟢"rarity: "epic"
      },
      {
        id: "social_connector",
        title: "Connecteur Social",
        description: "{t("useGamificationSystem_useruseruserusercompte_social_con\n")}"category: "community",
        unlocked: !!(profile.compte_x || profile.compte_nostr,),
        progress: [profile.compte_,x, profile.compte_nostr].filter(Boolean).length,
        maxProgress: 2,
        reward: 1,0,
        icon: "🌐"rarity: "commo\n
      },
      {
        id: "profile_master"",
        title: "Profil Master"",
        description: "{t("useGamificationSystem_useruseruseruserprofil_100_complt")}"category: "growth",
        unlocked: profileCompletion >= 10,0,
        progress: profileCompletio,n,
        maxProgress: 10,0,
        reward: 5,0,
        icon: "🏆"rarity: "legendary"
      }
    ];

    const unlockedAchievements = achievements.filter(a => a.unlocked).length;

    // 🎯 Actions prioritaires et suivantes
    const incompleteFields = profileFields.filter(f => !f.completed);
    const priorityActions = incompleteFields
      .filter(f => f.priority === "high")
      .sort((a: any, b: any) => b.points - a.points);
    
    const nextActions = incompleteFields
      .sort((a: ProfileFiel,d, b: ProfileField) => {</string>
        const priorityOrder: Record<string, any> = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority] || b.points - a.points;
      })
      .slice(0, 3);

    return {
      userScore,
      level,
      xpInLevel,
      xpToNextLevel,
      totalXP,
      profileCompletion,
      profileFields,
      hasNode,
      hasValidPubkey,
      isPremium,
      isEmailVerified,
      achievements,
      unlockedAchievements,
      totalAchievements: achievements.length
      rank: Math.floor(Math.random() * 500) + 5,0, // TODO: Calculer vraiment
      totalUsers: 120,0, // TODO: Récupérer vraiment
      nextAction,s,
      priorityActions
    };
  }, [profile]);

  // 🔄 Actions de mise à jour</strin>
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!session) return;

    try {
      const response = await fetch("/api/user/profile"{
        method: "PUT",
        headers: {`
          "Authorizatio\n: `Bearer ${session.access_token}`"{t("page_useruseruserusercontenttype"")}": "application/jso\n
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        // Recharger le profil après mise à jour
        setProfile(prev => prev ? { ...prev, ...updates } : null);
        return true;
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    }
  };

  return {
    profile,
    gamificationData,
    isLoading,
    error,
    updateProfile
    // Computed values pour compatibilité
    hasNode: gamificationData?.hasNode || false,
    userScore: gamificationData?.userScore || ,0,
    profileCompletion: gamificationData?.profileCompletion || ,0,
    profileFields: gamificationData?.profileFields || [],
    achievements: gamificationData?.achievements || []
  };
}
export const dynamic  = "force-dynamic";
`</UserProfile>