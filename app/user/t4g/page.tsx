"use client";

import React, { useState, useEffect } from "react";
import { useGamificationSystem } from "../hooks/useGamificationSystem";
import { CRMUserHeader } from "../components/ui/CRMUserHeader";
import { GamificationCenter } from "../components/ui/GamificationCenter";
import { SmartRecommendations } from "../components/ui/SmartRecommendations";
import Link from "next/link";
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  prenom?: string;
  nom?: string;
  node_id?: string;
  pubkey?: string;
  t4g_tokens: number;
}

// Import de l'interface CRMData depuis types/index.ts
import { CRMData } from '../types';

// Interface étendue pour les besoins spécifiques de cette page
export interface ExtendedCRMData extends CRMData {
  segment: 'lead' | 'client' | 'premium' | 'champion';
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
  const { isLoading, error, gamificationData } = useGamificationSystem();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Charger le profil utilisateur
  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, prenom, nom, node_id, pubkey, t4g_tokens')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erreur lors du chargement du profil:', error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // TODO: Remplacer par un vrai fetch CRMData (mock ici)
  const crmData: ExtendedCRMData | null = profile ? {
    userScore: 72,
    segment: 'client',
    engagementLevel: 'medium',
    conversionProbability: 0.42,
    conversionPotential: 0.65,
    lastActivity: new Date('2024-06-01'),
    totalOrders: 2,
    totalSpent: 120000,
    isPremium: false,
    hasNode: !!profile.node_id,
    profileCompletion: 80,
    lightningAdoption: !!profile.pubkey,
    recommendations: [], // à remplir si besoin
  } : null;

  // Correction du typage pour les achievements (utiliser reward comme points)
  const achievements = gamificationData?.achievements?.map(a => ({
    ...a,
    points: a.reward // GamificationCenter attend 'points', le hook fournit 'reward'
  })) ?? [];

  if (isLoading || profileLoading) return <div className="p-8 text-center">Chargement...</div>;
  if (error || !profile || !gamificationData || !crmData) return <div className="p-8 text-center text-red-600">Erreur de chargement du profil</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header CRM + segment + progression */}
      <CRMUserHeader
        userProfile={profile}
        crmData={crmData}
        onUpgradeToPremium={() => {}}
        hasNode={!!profile.node_id}
        isPremium={crmData.isPremium}
      />

      {/* Solde T4G + progression + actions */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <span>🌱</span>
            <span>{profile.t4g_tokens}</span>
            <span className="text-lg font-semibold ml-2">Tokens T4G</span>
          </div>
          <div className="text-white/90 mb-4 max-w-md">
            Les tokens <b>T4G</b> récompensent l'entraide, le mentoring et l'engagement dans la communauté DazNode & TokenForGood. Plus vous aidez, plus vous progressez !
          </div>
          <div className="flex gap-4 mt-2">
            <Link href="https://app.token-for-good.com/mentor" target="_blank" className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-bold px-6 py-3 rounded-xl shadow transition">
              🚀 Devenir Mentor
            </Link>
            <Link href="https://app.token-for-good.com/help" target="_blank" className="bg-white/90 hover:bg-white text-green-900 font-bold px-6 py-3 rounded-xl shadow border border-green-200 transition">
              💬 Demander de l'aide
            </Link>
          </div>
        </div>
        {/* Progression vers le prochain badge */}
        <div className="flex-1 flex flex-col items-center">
          <div className="text-lg text-white mb-2">Prochain badge à <b>{profile.t4g_tokens + 5} T4G</b></div>
          <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center shadow-inner">
            <span className="text-5xl font-bold text-yellow-300">{profile.t4g_tokens}</span>
          </div>
          <div className="mt-4 text-white/80 text-sm">Participez à un mentoring ou aidez un membre pour gagner +1 T4G</div>
        </div>
      </section>

      {/* Badges & progression */}
      <GamificationCenter
        userScore={gamificationData.userScore}
        achievements={achievements}
        currentLevel={gamificationData.level}
        pointsToNextLevel={gamificationData.xpToNextLevel}
        totalPoints={gamificationData.totalXP}
        networkRank={gamificationData.rank}
        networkSize={gamificationData.totalUsers}
      />

      {/* Recommandations IA pour gagner des T4G */}
      <div className="mt-10">
        <SmartRecommendations
          recommendations={crmData.recommendations}
          crmData={crmData}
          isPremium={crmData.isPremium}
          onApplyRecommendation={() => {}}
          onShowPremiumModal={() => {}}
        />
      </div>

      {/* Storytelling/valeurs */}
      <section className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 text-center shadow">
        <h2 className="text-2xl font-bold mb-4 text-indigo-900">Pourquoi les Tokens T4G ?</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-4">
          Les tokens T4G sont le moteur de l'entraide et du partage dans la communauté. Chaque action positive (mentoring, aide, partage d'astuce) vous rapproche de nouveaux badges et d'un statut reconnu. Rejoignez le mouvement et faites grandir l'écosystème Bitcoin Lightning !
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
          <div className="bg-white rounded-xl shadow p-6 flex-1">
            <div className="text-3xl mb-2">🤝</div>
            <div className="font-bold text-indigo-800 mb-1">Mentorat & Entraide</div>
            <div className="text-gray-600 text-sm">Aidez un membre, partagez votre expérience et gagnez des tokens T4G.</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex-1">
            <div className="text-3xl mb-2">🏅</div>
            <div className="font-bold text-indigo-800 mb-1">Badges & Progression</div>
            <div className="text-gray-600 text-sm">Débloquez des badges exclusifs et grimpez dans le classement de la communauté.</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex-1">
            <div className="text-3xl mb-2">🌍</div>
            <div className="font-bold text-indigo-800 mb-1">Impact Communautaire</div>
            <div className="text-gray-600 text-sm">Chaque action compte pour faire grandir l'écosystème Bitcoin Lightning francophone.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
export const dynamic = "force-dynamic";
