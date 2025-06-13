"use client";

import React, { FC, Suspense, useState } from 'react';
import { useGamificationSystem } from '../hooks/useGamificationSystem';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import DazBoxComparison from '../components/ui/DazBoxComparison';
import PerformanceMetrics from '../components/ui/PerformanceMetrics';
import AccessDeniedAlert from '../components/ui/AccessDeniedAlert';
// Nouveaux composants CRM
import { CRMHeaderDashboard } from '../components/ui/CRMHeaderDashboard';
import { ProfileCompletionEnhanced } from '../components/ui/ProfileCompletionEnhanced';
import { SmartConversionCenter } from '../components/ui/SmartConversionCenter';
import { PremiumConversionModal } from '../components/ui/PremiumConversionModal';
import { useRouter } from 'next/navigation';

const UserDashboard: FC = () => {
  const {
    profile,
    gamificationData,
    isLoading,
    error,
    hasNode,
    achievements
  } = useGamificationSystem(); // ✅ Nouveau hook unifié

  // Récupérer l'utilisateur directement depuis le provider pour fallback
  const { user: _user } = useSupabase();

  // États pour les modals
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Variables pour compatibilité
  const applyRecommendation = (id: string) => console.log('Recommandation appliquée:', id);
  const router = useRouter();
  const upgradeToPremium = () => {
    router.push('/user/subscriptions?plan=premium');
  };

  // Afficher un loader pendant la vérification de la session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erreur: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // ✅ CORRECTIF : Protéger contre le rendu si pas de profil utilisateur
  if (!profile || !gamificationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <Suspense fallback={null}>
        <AccessDeniedAlert />
      </Suspense>

      {/* ✅ Header CRM avec données unifiées */}
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
        } as any}
        onUpgradeToPremium={() => setShowPremiumModal(true)}
        hasNode={gamificationData.hasNode}
        isPremium={gamificationData.isPremium}
      />

      {/* ✅ Section complétion de profil avec données cohérentes */}
      <ProfileCompletionEnhanced
        profileFields={gamificationData.profileFields as any}
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
            {gamificationData.achievements.map((achievement) => (
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
                {!achievement.unlocked && achievement.progress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
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
        ] as any}
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
            achievements={achievements as any}
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
  );
};

export default UserDashboard;
