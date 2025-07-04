import { useState, useEffect, useMemo } from 'react';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { isValidLightningPubkey } from '@/lib/dazno-api';

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
  priority: 'high' | 'medium' | 'low';
  href: string;
  points: number;
  description?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'startup' | 'growth' | 'performance' | 'community';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: number; // XP points
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
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
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            "user.userusercontenttype": 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // ✅ CORRECTIF : Unifier la détection de nœud
          // Si l'utilisateur a une pubkey valide, on considère qu'il a un nœud
          const userProfile = data.user;
          if (userProfile.pubkey && !userProfile.node_id) {
            userProfile.node_id = userProfile.pubkey; // Synchroniser node_id avec pubkey
          }
          
          setProfile(userProfile);
          setError(null);
        } else {
          throw new Error(`Erreur API: ${response.status}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
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

    // ✅ LOGIQUE UNIFIÉE : Détecter si l'utilisateur a un nœud
    const hasValidPubkey = !!(profile.pubkey && isValidLightningPubkey(profile.pubkey));
    const hasNode = hasValidPubkey || !!profile.node_id;
    const isEmailVerified = !!profile.email_verified;
    const isPremium = false; // TODO: Récupérer depuis les subscriptions

    // 🏆 Définition des champs de profil avec logique cohérente
    const profileFields: ProfileField[] = [
      {
        name: 'email_verified',
        label: "user.useruseremail_vrifi",
        completed: isEmailVerified,
        priority: 'high',
        href: '/user/settings',
        points: 20,
        description: "user.useruservrifiez_votre_email_po"
      },
      {
        name: 'nom',
        label: "user.userusernom_de_famille",
        completed: !!(profile.nom?.trim()),
        priority: 'medium',
        href: '/user/settings',
        points: 10,
        description: "user.userusercompltez_votre_identit"
      },
      {
        name: 'prenom',
        label: "user.useruserprnom",
        completed: !!(profile.prenom?.trim()),
        priority: 'medium',
        href: '/user/settings',
        points: 10,
        description: "user.useruserpersonnalisez_votre_ex"
      },
      {
        name: 'pubkey',
        label: "user.userusercl_publique_lightning",
        completed: hasValidPubkey,
        priority: 'high',
        href: '/user/settings',
        points: 25,
        description: "user.useruserconnectez_votre_portef"
      },
      {
        name: 'node_connection',
        label: "user.userusernud_lightning_connect",
        completed: hasNode,
        priority: 'high',
        href: '/user/node',
        points: 30,
        description: "user.useruserconnectez_votre_nud_po"
      },
      {
        name: 'compte_x',
        label: "user.userusercompte_x_twitter",
        completed: !!(profile.compte_x?.trim()),
        priority: 'low',
        href: '/user/settings',
        points: 5,
        description: "user.useruserpartagez_vos_performan"
      },
      {
        name: 'compte_nostr',
        label: "user.userusercompte_nostr",
        completed: !!(profile.compte_nostr?.trim()),
        priority: 'low',
        href: '/user/settings',
        points: 5,
        description: "user.useruserrejoignez_la_communaut"
      },
      {
        name: 'phone_verified',
        label: "user.userusertlphone_vrifi",
        completed: !!(profile.phone_verified),
        priority: 'low',
        href: '/user/settings',
        points: 5,
        description: "user.useruservrifiez_votre_tlphone"
      }
    ];

    // 📈 Calcul du score et progression
    const completedFields = profileFields.filter(f => f.completed);
    const totalPossiblePoints = profileFields.reduce((sum: any, field: any) => sum + field.points, 0);
    const earnedPoints = completedFields.reduce((sum: any, field: any) => sum + field.points, 0);
    
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

    // 🏅 Système d'achievements
    const achievements: Achievement[] = [
      {
        id: 'email_verified',
        title: 'Première Connexion',
        description: "user.useruseremail_vrifi_avec_succs",
        category: 'startup',
        unlocked: isEmailVerified,
        progress: isEmailVerified ? 1 : 0,
        maxProgress: 1,
        reward: 20,
        icon: '✅',
        rarity: 'common'
      },
      {
        id: 'lightning_connected',
        title: 'Lightning Adopter',
        description: "user.useruserpremire_cl_publique_li",
        category: 'growth',
        unlocked: hasValidPubkey,
        progress: hasValidPubkey ? 1 : 0,
        maxProgress: 1,
        reward: 25,
        icon: '⚡',
        rarity: 'rare'
      },
      {
        id: 'node_operator',
        title: 'Opérateur de Nœud',
        description: "user.userusernud_lightning_network_",
        category: 'performance',
        unlocked: hasNode,
        progress: hasNode ? 1 : 0,
        maxProgress: 1,
        reward: 30,
        icon: '🟢',
        rarity: 'epic'
      },
      {
        id: 'social_connector',
        title: 'Connecteur Social',
        description: "user.userusercompte_social_connect_",
        category: 'community',
        unlocked: !!(profile.compte_x || profile.compte_nostr),
        progress: [profile.compte_x, profile.compte_nostr].filter(Boolean).length,
        maxProgress: 2,
        reward: 10,
        icon: '🌐',
        rarity: 'common'
      },
      {
        id: 'profile_master',
        title: 'Profil Master',
        description: "user.useruserprofil_100_complt",
        category: 'growth',
        unlocked: profileCompletion >= 100,
        progress: profileCompletion,
        maxProgress: 100,
        reward: 50,
        icon: '🏆',
        rarity: 'legendary'
      }
    ];

    const unlockedAchievements = achievements.filter(a => a.unlocked).length;

    // 🎯 Actions prioritaires et suivantes
    const incompleteFields = profileFields.filter(f => !f.completed);
    const priorityActions = incompleteFields
      .filter(f => f.priority === 'high')
      .sort((a: any, b: any) => b.points - a.points);
    
    const nextActions = incompleteFields
      .sort((a: ProfileField, b: ProfileField) => {
        const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
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
      totalAchievements: achievements.length,
      rank: Math.floor(Math.random() * 500) + 50, // TODO: Calculer vraiment
      totalUsers: 1200, // TODO: Récupérer vraiment
      nextActions,
      priorityActions
    };
  }, [profile]);

  // 🔄 Actions de mise à jour
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!session) return;

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          "user.userusercontenttype": 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        // Recharger le profil après mise à jour
        setProfile(prev => prev ? { ...prev, ...updates } : null);
        return true;
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    }
  };

  return {
    profile,
    gamificationData,
    isLoading,
    error,
    updateProfile,
    // Computed values pour compatibilité
    hasNode: gamificationData?.hasNode || false,
    userScore: gamificationData?.userScore || 0,
    profileCompletion: gamificationData?.profileCompletion || 0,
    profileFields: gamificationData?.profileFields || [],
    achievements: gamificationData?.achievements || []
  };
}
export const dynamic = "force-dynamic";
