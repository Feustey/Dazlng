"use client";

import React, { FC, useState, useEffect } from "react";
import { useGamificationSystem } from "../hooks/useGamificationSystem";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import { PerformanceMetrics } from "../components/ui/PerformanceMetrics";
import { DazBoxComparison } from "../components/ui/DazBoxComparison";
import { CRMHeaderDashboard } from "../components/ui/CRMHeaderDashboard";
import { ProfileCompletionEnhanced } from "../components/ui/ProfileCompletionEnhanced";
import { SmartConversionCenter } from "../components/ui/SmartConversionCenter";
import { PremiumConversionModal } from "../components/ui/PremiumConversionModal";
import DashboardCharts from "../components/ui/DashboardCharts";
import RealTimeStats from "../components/ui/RealTimeStats";
import MobileOptimizedDashboard from "../components/ui/MobileOptimizedDashboard";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import ReferralWidget from "@/components/user/ReferralWidget";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export interface UserProfile {
  id: string;
  email: string;
  prenom?: string;
  nom?: string;
  node_id?: string;
  pubkey?: string;
  referral_code?: string;
  referral_count?: number;
  referral_credits?: number;
}

const UserDashboard: FC = () => {
  const { t } = useAdvancedTranslation("common");

  const { user, session } = useSupabase();
  const { gamificationData, achievements } = useGamificationSystem();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);
  const accessToken = session?.access_token;

  // Charger le profil utilisateur
  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, prenom, nom, node_id, pubkey, referral_code, referral_count, referral_credits")
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
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  useEffect(() => {
    if (profile?.referral_code && accessToken) {
      fetch("/api/user/referrals", {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
        .then(res => res.json())
        .then(data => setReferrals(data.referrals || []));
    }
  }, [profile?.referral_code, accessToken]);

  const hasNode = Boolean(profile?.node_id);

  const applyRecommendation = (id: string) => console.log("Recommandation appliquée:", id);

  const upgradeToPremium = () => {
    console.log("Upgrade to premium");
    // Logique d'upgrade
  };

  if (!user || loading) {
    return (
      <div>
        <div>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("dashboard.chargement")}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header CRM avec données cohérentes */}
      <CRMHeaderDashboard
        userScore={gamificationData?.userScore || 0}
        profileCompletion={gamificationData?.profileCompletion || 0}
        conversionPotential={(gamificationData?.userScore || 0) >= 80 ? "high" : 
                         (gamificationData?.userScore || 0) >= 60 ? "medium" : "low"}
        lastActivity={new Date()}
        onUpgradeToPremium={() => setShowPremiumModal(true)}
        hasNode={gamificationData?.hasNode || false}
        isPremium={gamificationData?.isPremium || false}
      />

      {/* Section complétion de profil avec données cohérentes */}
      <ProfileCompletionEnhanced
        completion={gamificationData?.profileCompletion || 0}
        missingFields={[]}
        onComplete={() => {}}
      />

      {(gamificationData?.profileCompletion || 0) >= 100 && profile?.referral_code && (
        <ReferralWidget />
      )}

      {/* NOUVEAUTÉ : Centre d'achievements */}
      {gamificationData?.achievements && gamificationData.achievements.length > 0 && (
        <div>
          <div>
            <div>
              <h2>
                🏆 Vos Achievements
                <span>
                  {gamificationData.unlockedAchievements}/{gamificationData.totalAchievements}
                </span>
              </h2>
              <p>
                Niveau {gamificationData.level} • {gamificationData.totalXP} XP Total
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">#{gamificationData.rank}</div>
              <div className="text-sm text-gray-500">sur {gamificationData.totalUsers.toLocaleString()}</div>
            </div>
          </div>

          <div>
            {gamificationData.achievements.map((achievement: any) => (
              <div key={achievement.id}>
                <div>
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <div>
                      {achievement.title}
                    </div>
                    <div>
                      +{achievement.reward} XP
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <span>
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                
                {/* Barre de progression pour achievements en cours */}
                {!achievement.unlocked && achievement.progress && achievement.progress > 0 && (
                  <div>
                    <div>
                      <div 
                        className="bg-purple-200 rounded-full h-2" 
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <button>
              🏆 Voir tous les achievements
            </button>
            <button>
              📊 Comparer avec le réseau
            </button>
          </div>
        </div>
      )}

      {/* Centre de conversion intelligent avec fallback */}
      <SmartConversionCenter
        onUpgradeToPremium={() => setShowPremiumModal(true)}
      />

      {/* Modal Premium */}
      <PremiumConversionModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={() => {
          setShowPremiumModal(false);
          upgradeToPremium();
        }}
        userScore={gamificationData?.userScore || 0}
        hasNode={gamificationData?.hasNode || false}
        userName={profile?.prenom || profile?.email?.split("@")[0] || "Bitcoiner"}
      />

      {/* Version mobile optimisée */}
      <MobileOptimizedDashboard
        user={user}
        profile={profile}
        gamificationData={gamificationData}
        referrals={referrals}
        onUpgradeToPremium={() => setShowPremiumModal(true)}
      />
    </div>
  );
};

export default UserDashboard;
export const dynamic = "force-dynamic";