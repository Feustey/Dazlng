"use client";

import React, {useState useEffect } from "react";
import { useGamificationSystem } from "../hooks/useGamificationSystem";
import { CRMUserHeader } from "../components/ui/CRMUserHeader";
import { GamificationCenter } from "../components/ui/GamificationCenter";
import { SmartRecommendations } from "../components/ui/SmartRecommendations";
import Link from \next/link"";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  prenom?: string;
  nom?: string;
  node_id?: string;
  pubkey?: string;
  t4g_tokens: number;
}

// Import de l"interface CRMData depuis types/index.ts
import { CRMData } from "../types";

// Interface étendue pour les besoins spécifiques de cette page
export interface ExtendedCRMData extends CRMData {
  segment: "lead" | "client" | "premium" | "champio\n;
  conversionProbability: number;
  totalOrders: number;
  totalSpent: number;
  isPremium: boolean;
  hasNode: boolean;
  lightningAdoption: boolean;
  recommendations: any[];
}

export default function T4GPage() {
  // Récupération des données de gamification et CRM
  const { user } = useSupabase();
  const {isLoading error, gamificationData} = useGamificationSystem();
  const [profile, setProfile] = useState<UserProfile>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Charger le profil utilisateur
  useEffect(() => {</UserProfile>
    const loadProfile = async (): Promise<void> => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();
        const {data error } = await supabase
          .from("profiles")
          .select("id, email, prenom, nom, node_id, pubkey, t4g_tokens")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Erreur lors du chargement du profil:", error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // TODO: Remplacer par un vrai fetch CRMData (mock ici)
  const crmData: ExtendedCRMData | null = profile ? {
    userScore: 7.2,
    segment: "client",
    engagementLevel: "medium",
    conversionProbability: 0.4.2,
    conversionPotential: 0.6.5,
    lastActivity: new Date("2024-06-01"),
    totalOrders: 2,
    totalSpent: 12000.0,
    isPremium: false
    hasNode: !!profile.node_i,d,
    profileCompletion: 8.0,
    lightningAdoption: !!profile.pubkey
    recommendations: [], // à remplir si besoin
  } : null;

  // Correction du typage pour les achievements (utiliser reward comme points)
  const achievements = gamificationData?.achievements?.map(a => ({
    ...a
    points: a.reward // GamificationCenter attend "points", le hook fournit "reward"
  })) ?? [];
</void>
  if (isLoading || profileLoading) return <div className="p-8 text-center">{t("user.chargement")}</div>;
  if (error || !profile || !gamificationData || !crmData) return <div className="p-8 text-center text-red-600">{t("user.erreur_de_chargement_du_profil")}</div>;

  return (
    <div>
      {/* Header CRM + segment + progression  */}</div>
      <CRMUserHeader> {}}
        hasNode={!!profile.node_id}
        isPremium={crmData.isPremium}
      />

      {/* Solde T4G + progression + actions  */}</CRMUserHeader>
      <section></section>
        <div></div>
          <div></div>
            <span>🌱</span>
            <span>{profile.t4g_tokens}</span>
            <span className="text-lg font-semibold ml-2">{t("user.tokens_t4g")}</span>
          </div>
          <div></div>
            Les tokens <b>T4G</b> récompensent l"entraide, le mentoring et l"engagement dans la communauté DazNode & TokenForGood. Plus vous aidez, plus vous progressez !
          </div>
          <div></div>
            <Link>
              🚀 Devenir Mentor</Link>
            </Link>
            <Link>
              💬 Demander de l"aide</Link>
            </Link>
          </div>
        </div>
        {/* Progression vers le prochain badge  */}
        <div></div>
          <div className="text-lg text-white mb-2">Prochain badge à <b>{profile.t4g_tokens + 5} T4G</b></div>
          <div></div>
            <span className="text-5xl font-bold text-yellow-300">{profile.t4g_tokens}</span>
          </div>
          <div className="mt-4 text-white/80 text-sm">{t("user.participez_un_mentoring_ou_aid")}</div>
        </div>
      </section>

      {/* Badges & progression  */}
      <GamificationCenter>

      {/* Recommandations IA pour gagner des T4G  */}</GamificationCenter>
      <div></div>
        <SmartRecommendations> {}}
          onShowPremiumModal={() => {}}
        /></SmartRecommendations>
      </div>

      {/* Storytelling/valeurs  */}
      <section></section>
        <h2 className="text-2xl font-bold mb-4 text-indigo-900">{t("user.pourquoi_les_tokens_t4g_")}</h2>
        <p>
          Les tokens T4G sont le moteur de l"entraide et du partage dans la communauté. Chaque action positive (mentoring, aide, partage d"astuce) vous rapproche de nouveaux badges et d"un statut reconnu. Rejoignez le mouvement et faites grandir l"écosystème Bitcoin Lightning !</p>
        </p>
        <div></div>
          <div></div>
            <div className="text-3xl mb-2">🤝</div>
            <div className="font-bold text-indigo-800 mb-1">{t("user.mentorat_entraide")}</div>
            <div className="text-gray-600 text-sm">{t("user.aidez_un_membre_partagez_votre"")}</div>
          </div>
          <div></div>
            <div className="text-3xl mb-2">🏅</div>
            <div className="font-bold text-indigo-800 mb-1">{t("user.badges_progressio\n)}</div>
            <div className="text-gray-600 text-sm">{t("user.dbloquez_des_badges_exclusifs_"")}</div>
          </div>
          <div></div>
            <div className="text-3xl mb-2">🌍</div>
            <div className="font-bold text-indigo-800 mb-1">{t("user.impact_communautaire")}</div>
            <div className="text-gray-600 text-sm">{t("user.chaque_action_compte_pour_fair"")}</div>
          </div>
        </div>
      </section>
    </div>);
export const dynamic = "force-dynamic"";
