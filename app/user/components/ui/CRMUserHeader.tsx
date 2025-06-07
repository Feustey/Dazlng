import React from 'react';
import { UserProfile, CRMData } from '../../types';

interface CRMUserHeaderProps {
  userProfile: UserProfile;
  crmData: CRMData;
  onUpgradeToPremium: () => void;
  hasNode: boolean;
  isPremium: boolean;
}

export const CRMUserHeader: React.FC<CRMUserHeaderProps> = ({
  userProfile,
  crmData,
  onUpgradeToPremium,
  hasNode,
  isPremium
}) => {
  const getSegmentData = () => {
    const { userScore, engagementLevel } = crmData;
    
    if (userScore >= 80) return {
      segment: 'Champion',
      emoji: '🏆',
      color: 'from-yellow-500 to-orange-500',
      message: 'Vous êtes un utilisateur exemplaire !',
      nextStep: hasNode ? 'Découvrez DazBox Pro' : 'Optimisez avec Premium'
    };
    
    if (userScore >= 60) return {
      segment: 'Premium',
      emoji: '💎',
      color: 'from-purple-500 to-indigo-500',
      message: 'Profil premium actif',
      nextStep: 'Maximisez vos revenus Lightning'
    };
    
    if (userScore >= 40) return {
      segment: 'Client',
      emoji: '⚡',
      color: 'from-blue-500 to-cyan-500',
      message: 'Votre profil progresse bien !',
      nextStep: isPremium ? 'Connectez votre nœud' : 'Passez Premium'
    };
    
    if (userScore >= 20) return {
      segment: 'Lead',
      emoji: '🚀',
      color: 'from-green-500 to-emerald-500',
      message: 'Bienvenue dans l\'écosystème !',
      nextStep: 'Complétez votre profil'
    };
    
    return {
      segment: 'Prospect',
      emoji: '👋',
      color: 'from-gray-500 to-slate-500',
      message: 'Commencez votre aventure Lightning',
      nextStep: 'Vérifiez votre email'
    };
  };

  const segmentData = getSegmentData();
  const completionToNext = Math.min(((crmData.userScore % 20) / 20) * 100, 100);

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${segmentData.color} opacity-5`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{segmentData.emoji}</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bonjour {userProfile.prenom || userProfile.email?.split('@')[0] || 'Bitcoiner'} !
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 bg-gradient-to-r ${segmentData.color} text-white text-sm font-semibold rounded-full`}>
                  {segmentData.segment}
                </span>
                <span className="text-gray-600 text-sm">
                  Score: {crmData.userScore}/100
                </span>
              </div>
            </div>
          </div>
          
          {/* CTA Principal */}
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
          </div>
        </div>
        
        {/* Message personnalisé */}
        <p className="text-gray-700 mb-4">{segmentData.message}</p>
        
        {/* Barre de progression vers le prochain niveau */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progression vers le prochain niveau
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(completionToNext)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`bg-gradient-to-r ${segmentData.color} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${completionToNext}%` }}
            />
          </div>
        </div>
        
        {/* Prochaine étape recommandée */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <div className="font-semibold text-gray-900">Prochaine étape recommandée</div>
              <div className="text-sm text-gray-600">{segmentData.nextStep}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 