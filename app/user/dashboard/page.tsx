"use client";

import React, { FC, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUserData } from '../hooks/useUserData';
import ProfileCompletion from '../components/ui/ProfileCompletion';
import DazBoxComparison from '../components/ui/DazBoxComparison';
import EnhancedRecommendations from '../components/ui/EnhancedRecommendations';
import PerformanceMetrics from '../components/ui/PerformanceMetrics';
import AccessDeniedAlert from '../components/ui/AccessDeniedAlert';

const UserDashboard: FC = () => {
  const sessionResult = useSession();
  const router = useRouter();
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

  // ✅ PROTECTION CONTRE LE PRE-RENDERING
  const { data: session, status } = sessionResult || { data: null, status: 'loading' };

  // ✅ PROTECTION D'ACCÈS AVEC NEXTAUTH
  React.useEffect(() => {
    if (status === 'loading') return; // Attendre le chargement de la session
    
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/user/dashboard');
      return;
    }
  }, [status, router]);

  // Afficher un loader pendant la vérification de la session
  if (!sessionResult || status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Rediriger si pas authentifié
  if (status === 'unauthenticated') {
    return null; // Le useEffect va rediriger
  }

  return (
    <div className="space-y-8 pb-8">
      <Suspense fallback={null}>
        <AccessDeniedAlert />
      </Suspense>

      {/* Header avec salutation personnalisée */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            👋 Bonjour{userProfile.firstName ? ` ${userProfile.firstName}` : session?.user?.email ? ` ${session.user.email.split('@')[0]}` : ''} !
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

      {/* Section 2: Performance du nœud (si connecté) */}
      {hasNode && nodeStats && (
        <PerformanceMetrics
          metrics={nodeStats}
          achievements={achievements}
          trendData={trendData}
        />
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
