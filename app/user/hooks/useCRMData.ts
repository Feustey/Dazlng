import { useState, useEffect } from 'react';
import { UserProfile, CRMData, SmartRecommendation, ProfileField } from '../types/crm';

export interface UseCRMDataProps {
  userProfile?: UserProfile;
}

export const useCRMData = ({ userProfile }: UseCRMDataProps) => {
  const [crmData, setCrmData] = useState<CRMData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Générer les recommandations
  const generateRecommendations = (profile: UserProfile, score: number): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];

    if (!profile.email_verified) {
      recommendations.push({
        id: 'verify-email',
        title: 'Vérifiez votre email',
        description: 'Débloquez toutes les fonctionnalités en vérifiant votre adresse email',
        category: 'security',
        impact: 'high',
        estimatedGain: 10000,
        timeToImplement: '2 minutes',
        isPremium: false,
        priority: 'high',
        href: '/user/settings',
        appliedBy: 1250
      });
    }

    if (!profile.pubkey) {
      recommendations.push({
        id: 'add-pubkey',
        title: 'Connectez votre portefeuille Lightning',
        description: 'Accédez aux fonctionnalités Lightning et améliorez votre score',
        category: 'growth',
        impact: 'high',
        estimatedGain: 25000,
        timeToImplement: '5 minutes',
        isPremium: false,
        priority: 'high',
        href: '/user/settings',
        appliedBy: 890
      });
    }

    if (!profile.node_id && score >= 40) {
      recommendations.push({
        id: 'connect-node',
        title: 'Connectez votre nœud Lightning',
        description: 'Obtenez des analytics détaillées et des recommandations IA',
        category: 'efficiency',
        impact: 'high',
        estimatedGain: 75000,
        timeToImplement: '10 minutes',
        isPremium: false,
        priority: 'medium',
        href: '/user/node',
        appliedBy: 456
      });
    }

    if (score >= 50) {
      recommendations.push({
        id: 'upgrade-premium',
        title: 'Passez à Premium',
        description: 'Débloquez les optimisations IA et le support prioritaire',
        category: 'revenue',
        impact: 'high',
        estimatedGain: 150000,
        timeToImplement: '1 minute',
        isPremium: true,
        priority: 'high',
        href: '/subscribe',
        appliedBy: 678
      });
    }

    if (!profile.node_id && score >= 60) {
      recommendations.push({
        id: 'dazbox-offer',
        title: 'Découvrez DazBox',
        description: 'Nœud Lightning clé en main pour des revenus passifs optimisés',
        category: 'revenue',
        impact: 'high',
        estimatedGain: 200000,
        timeToImplement: '48h livraison',
        isPremium: true,
        priority: 'medium',
        href: '/dazbox',
        appliedBy: 234
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
        description: 'Partagez vos performances'
      },
      {
        name: 'compte_nostr',
        label: 'Compte Nostr',
        completed: !!profile.compte_nostr,
        priority: 'low',
        href: '/user/settings',
        points: 5,
        description: 'Rejoignez la communauté décentralisée'
      }
    ];
  };

  // Calculer les données CRM
  useEffect(() => {
    if (userProfile) {
      setIsLoading(true);
      try {
        const userScore = calculateUserScore(userProfile);
        const segment = determineSegment(userScore, userProfile);
        const recommendations = generateRecommendations(userProfile, userScore);
        const profileCompletion = calculateProfileCompletion(userProfile);

        const data: CRMData = {
          userScore,
          segment,
          engagementLevel: Math.min(100, userScore + 10),
          conversionProbability: Math.max(0, Math.min(100, userScore * 0.8 + (userProfile.email_verified ? 10 : 0))),
          lastActivity: userProfile.updated_at,
          totalOrders: 0, // À récupérer depuis l'API
          totalSpent: 0, // À récupérer depuis l'API
          isPremium: false, // À récupérer depuis l'API
          hasNode: !!userProfile.node_id,
          profileCompletion,
          lightningAdoption: !!userProfile.pubkey,
          recommendations
        };

        setCrmData(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du calcul des données CRM');
        console.error('CRM calculation error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [userProfile]);

  return {
    crmData,
    isLoading,
    error,
    profileFields: userProfile ? generateProfileFields(userProfile) : [],
    profileCompletion: userProfile ? calculateProfileCompletion(userProfile) : 0,
    userScore: userProfile ? calculateUserScore(userProfile) : 0,
    recommendations: crmData?.recommendations || []
  };
}
export const dynamic = "force-dynamic";
