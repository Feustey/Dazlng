import React from 'react';
import { UserProfile, CRMData } from '../../types';

export interface CRMHeaderDashboardProps {
  userProfile: UserProfile;
  crmData: CRMData;
  onUpgradeToPremium: () => void;
  hasNode: boolean;
  isPremium: boolean;
}

export const CRMHeaderDashboard: React.FC<CRMHeaderDashboardProps> = ({
  userProfile,
  crmData,
  onUpgradeToPremium,
  hasNode,
  isPremium
}) => {
  const getSegmentInfo = () => {
    const { userScore } = crmData;
    
    if (userScore >= 80) return {
      segment: 'Champion 🏆',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200',
      message: 'Utilisateur exemplaire du réseau Lightning !',
      nextAction: 'Découvrez DazBox Pro pour maximiser vos revenus'
    };
    
    if (userScore >= 60) return {
      segment: 'Premium ⚡',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200',
      message: 'Profil premium actif - Excellente progression !',
      nextAction: 'Optimisez votre nœud avec nos recommandations IA'
    };
    
    if (userScore >= 40) return {
      segment: 'Actif 🚀',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      message: 'Votre profil Lightning évolue positivement !',
      nextAction: isPremium ? 'Connectez votre nœud pour plus d\'insights' : 'Passez Premium pour débloquer toutes les fonctionnalités'
    };
    
    if (userScore >= 20) return {
      segment: 'Débutant ⭐',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      message: 'Bienvenue dans l\'écosystème Lightning !',
      nextAction: 'Complétez votre profil pour débloquer plus de fonctionnalités'
    };
    
    return {
      segment: 'Nouveau 👋',
      color: 'from-gray-500 to-slate-500',
      bgColor: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-200',
      message: 'Commencez votre aventure Lightning dès maintenant',
      nextAction: 'Vérifiez votre email pour activer votre compte'
    };
  };

  const segmentInfo = getSegmentInfo();
  const progressToNext = ((crmData.userScore % 20) / 20) * 100;
  const nextLevelScore = Math.ceil(crmData.userScore / 20) * 20;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${segmentInfo.bgColor} rounded-2xl shadow-lg border ${segmentInfo.borderColor} p-6 mb-8`}>
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-16 h-16 bg-gradient-to-r ${segmentInfo.color} rounded-full flex items-center justify-center text-2xl text-white font-bold shadow-lg`}>
                {userProfile.prenom ? userProfile.prenom.charAt(0).toUpperCase() : '👤'}
              </div>
              {/* Badge segment */}
              <div className={`absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-1 text-xs font-bold text-gray-700 shadow-md border ${segmentInfo.borderColor}`}>
                {crmData.userScore}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bonjour {userProfile.prenom || userProfile.email?.split('@')[0] || 'Bitcoiner'} !
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 bg-gradient-to-r ${segmentInfo.color} text-white text-sm font-semibold rounded-full shadow-sm`}>
                  {segmentInfo.segment}
                </span>
                <span className="text-gray-600 text-sm">
                  Niveau {Math.floor(crmData.userScore / 20) + 1}/5
                </span>
              </div>
            </div>
          </div>
          
          {/* CTA dynamique */}
          <div className="text-right">
            {!isPremium && crmData.userScore >= 40 && (
              <button
                onClick={onUpgradeToPremium}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition transform hover:scale-105"
              >
                🚀 Passer Premium
              </button>
            )}
            {isPremium && !hasNode && (
              <a
                href="/dazbox"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-orange-600 hover:to-red-600 transition transform hover:scale-105"
              >
                🔥 Découvrir DazBox
              </a>
            )}
            {hasNode && isPremium && (
              <a
                href="/user/node/recommendations"
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-emerald-600 transition transform hover:scale-105"
              >
                ⚡ Optimiser
              </a>
            )}
          </div>
        </div>
        
        {/* Message personnalisé */}
        <p className="text-gray-700 mb-4 text-lg">{segmentInfo.message}</p>
        
        {/* Barre de progression vers le prochain niveau */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progression vers le niveau {Math.floor(crmData.userScore / 20) + 2}
            </span>
            <span className="text-sm text-gray-500">
              {crmData.userScore}/{nextLevelScore} points
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`bg-gradient-to-r ${segmentInfo.color} h-3 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
        
        {/* Prochaine étape recommandée */}
        <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-white border-opacity-50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎯</div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Prochaine étape recommandée</div>
              <div className="text-sm text-gray-600">{segmentInfo.nextAction}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Potentiel</div>
              <div className="text-lg font-bold text-gray-900">+{20 - (crmData.userScore % 20)} pts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
