"use client";

import React, { FC, Suspense, useEffect } from 'react';
import { useUserData } from '../hooks/useUserData';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import ProfileCompletion from '../components/ui/ProfileCompletion';
import DazBoxComparison from '../components/ui/DazBoxComparison';
import EnhancedRecommendations from '../components/ui/EnhancedRecommendations';
import PerformanceMetrics from '../components/ui/PerformanceMetrics';
import AccessDeniedAlert from '../components/ui/AccessDeniedAlert';
import { useDaznoAPI } from '@/hooks/useDaznoAPI';

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

  // AJOUTER : Hook Dazno pour analyse complète
  const { complete: daznoData, getCompleteAnalysis } = useDaznoAPI();

  // AJOUTER : Récupérer l'analyse complète si l'utilisateur a un nœud
  useEffect(() => {
    if (userProfile?.pubkey) {
      getCompleteAnalysis(userProfile.pubkey);
    }
  }, [userProfile?.pubkey, getCompleteAnalysis]);

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
        <>
          <PerformanceMetrics
            metrics={nodeStats}
            achievements={achievements}
            trendData={trendData}
          />
          
          {/* AJOUTER : Analyse Dazno complète */}
          {daznoData && (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    🧠 Analyse IA Complète
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                      Dazia
                    </span>
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Score de santé: {daznoData.health_score}/100
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-semibold ${
                  daznoData.health_score >= 80 ? 'bg-green-100 text-green-800' :
                  daznoData.health_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {daznoData.health_score >= 80 ? '🟢 Excellent' :
                   daznoData.health_score >= 60 ? '🟡 Bon' : '🔴 À améliorer'}
                </div>
              </div>

              {/* Prochaines étapes recommandées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">🎯 Prochaines étapes</h3>
                  {daznoData.next_steps.slice(0, 3).map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="bg-purple-100 text-purple-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">📊 Actions prioritaires</h3>
                  {daznoData.openai_actions.actions.slice(0, 3).map((action: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 truncate">{action.action}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          action.difficulty === 'facile' ? 'bg-green-100 text-green-600' :
                          action.difficulty === 'moyen' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {action.difficulty}
                        </span>
                        <span className="text-purple-600 font-medium">+{action.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <a 
                  href="/user/node" 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  Voir l'analyse détaillée
                </a>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                  Télécharger le rapport
                </button>
              </div>
            </div>
          )}
        </>
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
