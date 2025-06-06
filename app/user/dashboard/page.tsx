"use client";

import React, { FC, Suspense } from 'react';
import { useUserData } from '../hooks/useUserData';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import ProfileCompletion from '../components/ui/ProfileCompletion';
import DazBoxComparison from '../components/ui/DazBoxComparison';
import EnhancedRecommendations from '../components/ui/EnhancedRecommendations';
import PerformanceMetrics from '../components/ui/PerformanceMetrics';
import AccessDeniedAlert from '../components/ui/AccessDeniedAlert';

const UserDashboard: FC = () => {
  const {
    userProfile,
    nodeStats,
    hasNode,
    isPremium,
    isLoading,
    profileCompletion,
    profileFields,
    userScore,
    recommendations,
    achievements,
    trendData,
    applyRecommendation,
    upgradeToPremium
  } = useUserData();

  // Récupérer l'utilisateur directement depuis le provider pour fallback
  const { user } = useSupabase();

  // ✅ SUPPRESSION DE LA REDIRECTION AUTOMATIQUE
  // Le dashboard est maintenant accessible même sans nœud connecté
  // L'utilisateur verra des prompts pour connecter son nœud

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

  // ✅ CORRECTIF : Protéger contre le rendu si pas de profil utilisateur
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  // Plus de redirection automatique - accessible même sans nœud

  return (
    <div className="space-y-8 pb-8">
      <Suspense fallback={null}>
        <AccessDeniedAlert />
      </Suspense>

      {/* Header avec salutation personnalisée */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            👋 Bonjour{userProfile?.firstName ? ` ${userProfile.firstName}` : userProfile?.email ? ` ${userProfile.email.split('@')[0]}` : user?.email ? ` ${user.email.split('@')[0]}` : ''} !
          </h1>
          <p className="text-gray-600 mt-1">
            Voici un aperçu de vos performances Lightning
          </p>
        </div>
        {!isPremium && (
          <button 
            onClick={upgradeToPremium}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition"
          >
            🚀 Passer Premium
          </button>
        )}
      </div>

      {/* Section 1: Complétion du profil (CRM) */}
      <ProfileCompletion
        profileFields={profileFields}
        completionPercentage={profileCompletion}
        userScore={userScore}
      />

      {/* Section 2: Performance du nœud (si connecté) ou Onboarding */}
      {hasNode && nodeStats ? (
        <PerformanceMetrics
          metrics={nodeStats}
          achievements={achievements}
          trendData={trendData}
        />
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Connectez votre nœud Lightning
              </h3>
              <p className="text-gray-600 text-lg">
                Débloquez l'analyse de performance et les recommandations personnalisées
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/user/node" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
              >
                🔗 Connecter mon nœud
              </a>
              <a 
                href="/dazbox" 
                className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                📦 Découvrir DazBox
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Comparaison DazBox */}
      <DazBoxComparison
        userNodeStats={nodeStats}
        hasNode={hasNode}
      />

      {/* Section 4: Recommandations Dazia */}
      <EnhancedRecommendations
        recommendations={recommendations}
        isPremium={isPremium}
        onApplyRecommendation={applyRecommendation}
        onUpgradeToPremium={upgradeToPremium}
      />

      {/* Call to action final si pas de nœud */}
      {!hasNode && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">🚀 Prêt à commencer ?</h2>
          <p className="mb-6 text-lg">
            Connectez votre nœud Lightning ou découvrez DazBox pour commencer à générer des revenus
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/user/node" 
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Connecter mon nœud
            </a>
            <a 
              href="/dazbox" 
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              Découvrir DazBox
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
