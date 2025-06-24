"use client";

import React, { FC, useState, useEffect } from 'react';
import { useGamificationSystem } from '../hooks/useGamificationSystem';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { PerformanceMetrics } from '../components/ui/PerformanceMetrics';
import { DazBoxComparison } from '../components/ui/DazBoxComparison';
import { CRMHeaderDashboard } from '../components/ui/CRMHeaderDashboard';
import { ProfileCompletionEnhanced } from '../components/ui/ProfileCompletionEnhanced';
import { SmartConversionCenter } from '../components/ui/SmartConversionCenter';
import { PremiumConversionModal } from '../components/ui/PremiumConversionModal';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  prenom?: string;
  nom?: string;
  node_id?: string;
  pubkey?: string;
}

const UserDashboard: FC = () => {
  const { user } = useSupabase();
  const { gamificationData, achievements } = useGamificationSystem();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
          .from('profiles')
          .select('id, email, prenom, nom, node_id, pubkey')
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
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const hasNode = Boolean(profile?.node_id);

  const applyRecommendation = (id: string) => console.log('Recommandation appliquée:', id);

  const upgradeToPremium = () => {
    console.log('Upgrade to premium');
    // Logique d'upgrade
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
};
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header CRM avec données cohérentes */}
      <CRMHeaderDashboard
        userProfile={profile}
        crmData={{
          userScore: gamificationData.userScore,
          segment: gamificationData.userScore >= 80 ? 'champion' : 
                  gamificationData.userScore >= 60 ? 'premium' :
                  gamificationData.userScore >= 40 ? 'client' : 'lead',
          profileCompletion: gamificationData.profileCompletion,
          hasNode: gamificationData.hasNode,
          isPremium: gamificationData.isPremium,
          engagementLevel: gamificationData.userScore
        }}
        onUpgradeToPremium={() => setShowPremiumModal(true)}
        hasNode={gamificationData.hasNode}
        isPremium={gamificationData.isPremium}
      />

      {/* ✅ Section complétion de profil avec données cohérentes */}
      <ProfileCompletionEnhanced
        profileFields={gamificationData.profileFields}
        completionPercentage={gamificationData.profileCompletion}
        userScore={gamificationData.userScore}
      />

      {/* ✅ NOUVEAUTÉ : Centre d'achievements */}
      {gamificationData.achievements.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                🏆 Vos Achievements
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  {gamificationData.unlockedAchievements}/{gamificationData.totalAchievements}
                </span>
              </h2>
              <p className="text-gray-600 text-sm">
                Niveau {gamificationData.level} • {gamificationData.totalXP} XP Total
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">#{gamificationData.rank}</div>
              <div className="text-sm text-gray-500">sur {gamificationData.totalUsers.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {gamificationData.achievements.map((achievement: any) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className={`font-medium ${
                      achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      +{achievement.reward} XP
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                
                {/* Barre de progression pour achievements en cours */}
                {!achievement.unlocked && achievement.progress && achievement.progress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition">
              🏆 Voir tous les achievements
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
              📊 Comparer avec le réseau
            </button>
          </div>
        </div>
      )}

      {/* Centre de conversion intelligent avec fallback */}
      <SmartConversionCenter
        recommendations={[
          {
            id: 'premium-upgrade',
            title: 'Passez à Premium',
            description: 'Débloquez les optimisations IA et le support prioritaire',
            impact: 'high',
            difficulty: 'easy',
            isFree: false,
            estimatedGain: 150000,
            timeToImplement: '1 minute',
            category: 'revenue'
          }
        ]}
        userScore={gamificationData.userScore}
        isPremium={gamificationData.isPremium}
        hasNode={gamificationData.hasNode}
        onApplyRecommendation={applyRecommendation}
        onShowPremiumModal={() => setShowPremiumModal(true)}
      />

      {/* Modal Premium */}
      <PremiumConversionModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={() => {
          setShowPremiumModal(false);
          upgradeToPremium();
        }}
        userScore={gamificationData.userScore}
        hasNode={gamificationData.hasNode}
        userName={profile?.prenom || profile?.email?.split('@')[0] || 'Bitcoiner'}
      />

      {/* Section 2: Performance du nœud (si connecté) ou Onboarding */}
      {hasNode ? (
        <>
          <PerformanceMetrics
            metrics={{
              monthlyRevenue: 0,
              totalCapacity: 0,
              activeChannels: 0,
              uptime: 95,
              healthScore: 85,
              routingEfficiency: 78,
              revenueGrowth: 12,
              rankInNetwork: gamificationData.rank,
              totalNodes: gamificationData.totalUsers
            }}
            achievements={achievements}
            trendData={[10, 15, 12, 18, 25, 22, 30]}
          />
        </>
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connectez votre nœud Lightning
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Ajoutez votre clé publique Lightning pour accéder aux analytics avancées, 
                recommandations IA et optimisations automatiques.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/user/settings'}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                🔧 Ajouter mon nœud
              </button>
              <button
                onClick={() => window.location.href = '/user/node'}
                className="border border-purple-300 text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                📖 Guide de connexion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DazBox si pas de nœud */}
      {!hasNode && (
        <DazBoxComparison
          hasNode={hasNode}
          userNodeStats={null}
        />
      )}
    </div>
};
};

export default UserDashboard;
