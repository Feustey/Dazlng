import { useState, useEffect } from 'react';
import { UserProfile, CRMData, SmartRecommendation, ProfileField } from '../types/crm';

interface UseCRMDataProps {
  userProfile?: UserProfile;
}

export const useCRMData = ({ userProfile }: UseCRMDataProps) => {
  const [crmData, setCrmData] = useState<CRMData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données CRM depuis l'API
  const fetchCRMData = async () => {
    if (!userProfile) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/user/crm-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // En production, utiliser le vrai token JWT
          'Authorization': 'Bearer fake-token',
          'x-user-id': userProfile.id
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Erreur lors de la récupération des données CRM');
      }

      setCrmData(result.data.crmData);

    } catch (err) {
      console.error('Erreur récupération CRM data:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      
      // Fallback sur les données locales en cas d'erreur API
      const fallbackData = generateLocalCRMData(userProfile);
      setCrmData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback local en cas d'erreur API
  const generateLocalCRMData = (profile: UserProfile): CRMData => {
    const score = calculateUserScore(profile);
    const segment = determineSegment(score, profile);
    const profileCompletion = calculateProfileCompletion(profile);

    return {
      userScore: score,
      segment,
      engagementLevel: Math.min(100, score + 10),
      conversionProbability: calculateConversionProbability(score, profile),
      lastActivity: profile.updated_at || new Date().toISOString(),
      totalOrders: 0, // Données non disponibles côté client
      totalSpent: 0,
      isPremium: false,
      hasNode: !!profile.node_id,
      profileCompletion,
      lightningAdoption: !!profile.pubkey,
      recommendations: generateBasicRecommendations(profile, score)
    };
  };

  // Calculer le score utilisateur localement
  const calculateUserScore = (profile: UserProfile): number => {
    let score = 0;

    // Email vérifié (20 points)
    if (profile.email_verified) score += 20;

    // Profil complété (20 points max)
    const profileFields = ['nom', 'prenom', 'pubkey', 'node_id', 'compte_x', 'compte_nostr'];
    const completed = profileFields.filter(field => profile[field as keyof UserProfile] && String(profile[field as keyof UserProfile]).length > 0).length;
    score += Math.round((completed / profileFields.length) * 20);

    // Pubkey Lightning (15 points)
    if (profile.pubkey) score += 15;

    // Nœud connecté (20 points)
    if (profile.node_id) score += 20;

    // Tokens T4G bonus (5 points)
    if (profile.t4g_tokens > 1) score += 5;

    // Comptes sociaux (10 points max)
    let socialScore = 0;
    if (profile.compte_x) socialScore += 5;
    if (profile.compte_nostr) socialScore += 5;
    score += socialScore;

    return Math.min(100, Math.round(score));
  };

  // Déterminer le segment
  const determineSegment = (score: number, profile: UserProfile): CRMData['segment'] => {
    if (score >= 80) return 'champion';
    if (score >= 60) return 'premium';
    if (score >= 40) return 'client';
    if (score >= 20 || profile.email_verified) return 'lead';
    return 'prospect';
  };

  // Calculer la probabilité de conversion
  const calculateConversionProbability = (score: number, profile: UserProfile): number => {
    let probability = score * 0.6;
    
    if (profile.email_verified) probability += 10;
    if (profile.pubkey) probability += 15;
    
    const accountAge = profile.created_at ? 
      (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24) : 0;
    if (accountAge < 7) probability -= 20;
    
    return Math.max(0, Math.min(100, Math.round(probability)));
  };

  // Recommandations basiques pour le fallback (sans données hard-codées d'usage)
  const generateBasicRecommendations = (profile: UserProfile, score: number): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];
    const segment = determineSegment(score, profile);

    // Gains estimés basés sur le segment (valeurs conservative sans données réelles)
    const getEstimatedGain = (actionType: string): number => {
      const baseGains: Record<string, Record<string, number>> = {
        'verify-email': { 'prospect': 5000, 'lead': 8000, 'client': 12000, 'premium': 15000, 'champion': 20000 },
        'add-pubkey': { 'prospect': 15000, 'lead': 20000, 'client': 25000, 'premium': 30000, 'champion': 35000 },
        'connect-node': { 'prospect': 50000, 'lead': 60000, 'client': 75000, 'premium': 90000, 'champion': 100000 },
        'upgrade-premium': { 'prospect': 100000, 'lead': 120000, 'client': 150000, 'premium': 180000, 'champion': 200000 },
        'dazbox-offer': { 'prospect': 150000, 'lead': 180000, 'client': 200000, 'premium': 250000, 'champion': 300000 }
      };
      return baseGains[actionType]?.[segment] || 10000;
    };

    if (!profile.email_verified) {
      recommendations.push({
        id: 'verify-email',
        title: 'Vérifiez votre email',
        description: 'Débloquez toutes les fonctionnalités en vérifiant votre adresse email',
        category: 'security',
        impact: 'high',
        estimatedGain: getEstimatedGain('verify-email'),
        timeToImplement: '2 minutes',
        isPremium: false,
        priority: 'high',
        href: '/user/settings',
        appliedBy: 0 // Sera remplacé par les vraies données de l'API
      });
    }

    if (!profile.pubkey) {
      recommendations.push({
        id: 'add-pubkey',
        title: 'Connectez votre portefeuille Lightning',
        description: 'Accédez aux fonctionnalités Lightning et améliorez votre score',
        category: 'growth',
        impact: 'high',
        estimatedGain: getEstimatedGain('add-pubkey'),
        timeToImplement: '5 minutes',
        isPremium: false,
        priority: 'high',
        href: '/user/settings',
        appliedBy: 0
      });
    }

    if (!profile.node_id && score >= 40) {
      recommendations.push({
        id: 'connect-node',
        title: 'Connectez votre nœud Lightning',
        description: 'Obtenez des analytics détaillées et des recommandations IA',
        category: 'efficiency',
        impact: 'high',
        estimatedGain: getEstimatedGain('connect-node'),
        timeToImplement: '10 minutes',
        isPremium: false,
        priority: 'medium',
        href: '/user/node',
        appliedBy: 0
      });
    }

    return recommendations.slice(0, 6);
  };

  // Calculer la completion du profil
  const calculateProfileCompletion = (profile: UserProfile): number => {
    const fields = ['nom', 'prenom', 'pubkey', 'node_id', 'compte_x', 'compte_nostr'];
    const completed = fields.filter(field => profile[field as keyof UserProfile] && String(profile[field as keyof UserProfile]).length > 0).length;
    const emailVerified = profile.email_verified ? 1 : 0;
    
    return Math.round(((completed + emailVerified) / (fields.length + 1)) * 100);
  };

  // Générer les champs de profil
  const generateProfileFields = (profile: UserProfile): ProfileField[] => {
    return [
      {
        name: 'email_verified',
        label: 'Email vérifié',
        completed: profile.email_verified,
        priority: 'high',
        href: '/user/settings',
        points: 20,
        description: 'Vérifiez votre email pour sécuriser votre compte'
      },
      {
        name: 'nom',
        label: 'Nom de famille',
        completed: !!profile.nom,
        priority: 'medium',
        href: '/user/settings',
        points: 10,
        description: 'Complétez votre identité'
      },
      {
        name: 'prenom',
        label: 'Prénom',
        completed: !!profile.prenom,
        priority: 'medium',
        href: '/user/settings',
        points: 10,
        description: 'Personnalisez votre expérience'
      },
      {
        name: 'pubkey',
        label: 'Clé publique Lightning',
        completed: !!profile.pubkey,
        priority: 'high',
        href: '/user/settings',
        points: 15,
        description: 'Connectez votre portefeuille Lightning'
      },
      {
        name: 'node_id',
        label: 'Nœud Lightning',
        completed: !!profile.node_id,
        priority: 'high',
        href: '/user/node',
        points: 20,
        description: 'Connectez votre nœud pour les analytics'
      },
      {
        name: 'compte_x',
        label: 'Compte X (Twitter)',
        completed: !!profile.compte_x,
        priority: 'low',
        href: '/user/settings',
        points: 5,
        description: 'Connectez votre compte X'
      },
      {
        name: 'compte_nostr',
        label: 'Compte Nostr',
        completed: !!profile.compte_nostr,
        priority: 'low',
        href: '/user/settings',
        points: 5,
        description: 'Connectez votre compte Nostr'
      }
    ];
  };

  // Effect pour charger les données CRM
  useEffect(() => {
    fetchCRMData();
  }, [userProfile?.id]); // Recharger si l'utilisateur change

  return {
    crmData,
    isLoading,
    error,
    refetch: fetchCRMData,
    profileFields: userProfile ? generateProfileFields(userProfile) : []
  };
}; 