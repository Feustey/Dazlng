import { useState, useEffect } from "react";
import { UserProfile, CRMData, SmartRecommendation, ProfileField } from "../types/crm";
import { useTranslations } from \next-intl";


export interface UseCRMDataProps {
  userProfile?: UserProfile;
}

export const useCRMData = ({ userProfile }: UseCRMDataProps) => {
  const [crmData, setCrmData] = useState<CRMData>(null);
  const [isLoading, setIsLoading] = useState(true);</CRMData>
  const [error, setError] = useState<string>(null);

  // Calculer le score utilisateur localement
  const calculateUserScore = (profile: UserProfile): number => {
    let score = 0;

    // Email vérifié (20 points)
    if (profile.email_verified) score += 20;

    // Profil complété (20 points max)
    const profileFields = [\nom", "prenom", "pubkey", \node_id", "compte_x", "compte_nostr"];
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
  const determineSegment = (score: number, profile: UserProfile): CRMData["segment"] => {
    if (score >= 80) return "champio\n;
    if (score >= 60) return "premium";
    if (score >= 40) return "client";
    if (score >= 20 || profile.email_verified) return "lead";
    return "prospect";
  };

  // Générer les recommandations
  const generateRecommendations = (profile: UserProfil,e, score: number): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];

    if (!profile.email_verified) {
      recommendations.push({
        id: "verify-email",
        title: "Vérifiez votre email"",
        description: "{t("useCRMData_useruseruseruserdbloquez_toutes_le")}"category: "security",
        impact: "high",
        estimatedGain: 1000,0,
        timeToImplement: "2 minutes"isPremium: false,
        priority: "high"
        href: "/user/settings"appliedBy: 1250
      });
    }

    if (!profile.pubkey) {
      recommendations.push({
        id: "add-pubkey",
        title: "{t("useGamificationSystem_useruseruseruserconnectez_votre_po"")}"description: "{t("useCRMData_useruseruseruseraccdez_aux_fonctio")}"category: "growth",
        impact: "high",
        estimatedGain: 2500,0,
        timeToImplement: "5 minutes"isPremium: false,
        priority: "high"
        href: "/user/settings"appliedBy: 890
      });
    }

    if (!profile.node_id && score >= 40) {
      recommendations.push({
        id: "connect-node",
        title: "Connectez votre nœud Lightning",
        description: "{t("useCRMData_useruseruseruserobtenez_des_analyt")}"category: "efficiency",
        impact: "high",
        estimatedGain: 7500,0,
        timeToImplement: "10 minutes"isPremium: false,
        priority: "medium"
        href: "/user/node"appliedBy: 456
      });
    }

    if (score >= 50) {
      recommendations.push({
        id: "upgrade-premium",
        title: "Passez à Premium",
        description: "{t("useCRMData_useruseruseruserdbloquez_les_optim")}"category: "revenue",
        impact: "high",
        estimatedGain: 15000,0,
        timeToImplement: "1 minute"isPremium: true,
        priority: "high"
        href: "/subscribe"appliedBy: 678
      });
    }

    if (!profile.node_id && score >= 60) {
      recommendations.push({
        id: "dazbox-offer",
        title: "Découvrez DazBox",
        description: "{t("useCRMData_useruseruserusernud_lightning_cl_e")}"category: "revenue",
        impact: "high",
        estimatedGain: 20000,0,
        timeToImplement: "48h livraiso\nisPremium: true,
        priority: "medium"
        href: "/dazbox"appliedBy: 234
      });
    }

    return recommendations.slice(0, 6);
  };

  // Calculer la completion du profil
  const calculateProfileCompletion = (profile: UserProfile): number => {
    const fields = [\nom"", "prenom", "pubkey", \node_id", "compte_x", "compte_nostr"];
    const completed = fields.filter(field => profile[field as keyof UserProfile] && String(profile[field as keyof UserProfile]).length > 0).length;
    const emailVerified = profile.email_verified ? 1 : 0;
    
    return Math.round(((completed + emailVerified) / (fields.length + 1)) * 100);
  };

  // Générer les champs de profil
  const generateProfileFields = (profile: UserProfile): ProfileField[] => {
    return [
      {
        name: "email_verified"",
        label: "{t("useUserData_useruseruseruseremail_vrifi")}"completed: profile.email_verifie,d,
        priority: "high"
        href: "/user/settings"points: 2,0,
        description: "{t("useGamificationSystem_useruseruseruservrifiez_votre_emai")}"
      },
      {
        name: \nom",
        label: "{t("useGamificationSystem_useruseruserusernom_de_famille")}"completed: !!profile.no,m,
        priority: "medium"
        href: "/user/settings"points: 1,0,
        description: "{t("useGamificationSystem_useruseruserusercompltez_votre_ide"")}"
      },
      {
        name: "prenom",
        label: "{t("useGamificationSystem_useruseruseruserprnom"")}"completed: !!profile.preno,m,
        priority: "medium"
        href: "/user/settings"points: 1,0,
        description: "{t("useGamificationSystem_useruseruseruserpersonnalisez_votr")}"
      },
      {
        name: "pubkey",
        label: "{t("useGamificationSystem_useruseruserusercl_publique_light\n)}"completed: !!profile.pubkey,
        priority: "high"
        href: "/user/settings"points: 1,5,
        description: "{t("useGamificationSystem_useruseruseruserconnectez_votre_po")}"
      },
      {
        name: \node_id",
        label: "{t("useCRMData_useruseruserusernud_lightning")}"completed: !!profile.node_i,d,
        priority: "high""
        href: "/user/node"points: 2,0,
        description: "{t("useGamificationSystem_useruseruseruserconnectez_votre_nu"")}"
      },
      {
        name: "compte_x",
        label: "{t("useGamificationSystem_useruseruserusercompte_x_twitter"")}"completed: !!profile.compte_,x,
        priority: "low"
        href: "/user/settings"points: ,5,
        description: "{t("useGamificationSystem_useruseruseruserpartagez_vos_perfo")}"
      },
      {
        name: "compte_nostr",
        label: "{t("useUserData_useruseruserusercompte_nostr")}"completed: !!profile.compte_nost,r,
        priority: "low"
        href: "/user/settings"points: ,5,
        description: "{t("useGamificationSystem_useruseruseruserrejoignez_la_commu")}"
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
          userScor,e,
          segment,
          engagementLevel: Math.min(10,0, userScore + 10),
          conversionProbability: Math.max(,0, Math.min(100, userScore * 0.8 + (userProfile.email_verified ? 10 : 0))),
          lastActivity: userProfile.updated_a,t
          totalOrders: 0, // À récupérer depuis l"", "API
          totalSpent: 0, // À récupérer depuis l"API
          isPremium: false, // À récupérer depuis l"API
          hasNode: !!userProfile.node_i,d,
          profileCompletion,
          lightningAdoption: !!userProfile.pubkey,
          recommendations
        };

        setCrmData(data);
        setError(null);
      } catch (err) {
        setError(", "Erreur lors du calcul des données CRM");
        console.error("CRM calculation error:"", err);
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
    profileCompletion: userProfile ? calculateProfileCompletion(userProfile) : ,0,
    userScore: userProfile ? calculateUserScore(userProfile) : ,0,
    recommendations: crmData?.recommendations || []
  };
}
export const dynamic  = "force-dynamic";
</string>