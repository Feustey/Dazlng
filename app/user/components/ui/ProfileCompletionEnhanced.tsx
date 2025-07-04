import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle, Circle, Star, Target, Gift, TrendingUp } from "@/components/shared/ui/IconRegistry";

export interface ProfileField {
  name: string;
  label: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  href: string;
  points?: number;
  description?: string;
}

export interface ProfileCompletionEnhancedProps {
  profileFields: ProfileField[];
  completionPercentage: number;
  userScore: number;
  referralCode?: string;
  referralCount?: number;
  referralCredits?: number;
}

export const ProfileCompletionEnhanced: React.FC<ProfileCompletionEnhancedProps> = ({
  profileFields,
  completionPercentage,
  userScore,
  referralCode,
  referralCount = 0,
  referralCredits = 0
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const incompleteFields = profileFields.filter(field => !field.completed);
  const highPriorityFields = incompleteFields
    .filter(field => field.priority === "high")
    .sort((a: ProfileField, b: ProfileField) => (b.points || 0) - (a.points || 0));

  const completedFields = profileFields.filter((field: ProfileField) => field.completed);
  
  const totalPossiblePoints = profileFields.reduce((sum: number, field: ProfileField) => sum + (field.points || 10), 0);
  const earnedPoints = completedFields.reduce((sum: number, field: ProfileField) => sum + (field.points || 10), 0);

  const getRewardForCompletion = () => {
    if (completionPercentage === 100) return "🎉 Profil Master débloqué !";
    if (completionPercentage >= 80) return "🏆 Presque champion !";
    if (completionPercentage >= 60) return "⭐ Excellent progrès !";
    if (completionPercentage >= 40) return "🚀 En très bonne voie !";
    if (completionPercentage >= 20) return "💪 Premier pas accompli !";
    return "👋 Commencez votre aventure DazNode !";
  };

  const getNextMilestone = () => {
    if (completionPercentage >= 100) return null;
    
    const milestones = [25, 50, 75, 100];
    const nextThreshold = milestones.find(m => m > completionPercentage) || 100;
    const pointsNeeded = Math.ceil((nextThreshold - completionPercentage) / 100 * totalPossiblePoints);
    
    return { threshold: nextThreshold, pointsNeeded };
  };

  const nextMilestone = getNextMilestone();

  const getActionTiming = (field: ProfileField): string => {
    switch (field.name) {
      case "email_verified": return "1 min";
      case "pubkey": return "3 min";
      case "node_connection": return "5 min";
      case "nom":
      case "prenom": return "30 sec";
      default: return "2 min";
    }
  };

  if (completionPercentage >= 100) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Profil Master ! 
                <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  +50 XP Bonus
                </span>
              </h2>
              <p className="text-gray-600 mt-1">
                Félicitations ! Vous avez débloqué toutes les fonctionnalités personnalisées.
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{earnedPoints}/{totalPossiblePoints}</div>
            <div className="text-xs text-green-600">Points XP</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <Gift className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-700">Parrainez vos amis</span>
            </div>
            <div className="text-sm text-gray-700 mb-1">Gagnez 1 mois d'abonnement par filleul</div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Votre lien :</span>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                {referralCode ? `https://daznode.com/register?ref=${referralCode}` : "..."}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-xs text-gray-500">Filleuls : <span className="font-bold text-purple-700">{referralCount}</span></div>
            <div className="text-xs text-gray-500">Mois gagnés : <span className="font-bold text-green-700">{referralCredits}</span></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <div>
              <span className="font-medium text-gray-700">Statut</span>
              <div className="text-lg font-bold text-green-600">Lightning Pro</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <div>
              <span className="font-medium text-gray-700">Score global</span>
              <div className="text-lg font-bold text-blue-600">{userScore}/100</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-purple-600" />
            <div>
              <span className="font-medium text-gray-700">Avantages</span>
              <div className="text-sm text-purple-600">Accès complet + bonus</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <Link
            href="/user/settings"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Gérer mon profil →
          </Link>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors">
              🏆 Voir mes achievements
            </button>
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              📱 Partager mon statut
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Circle className="w-8 h-8 text-amber-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-bold text-amber-600">{Math.round(completionPercentage)}</div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Complétez votre profil
              <span className="ml-2 text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                {getRewardForCompletion()}
              </span>
            </h2>
            <p className="text-gray-600 mt-1">
              Débloquez plus de fonctionnalités et améliorez votre score
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-800">{completionPercentage}%</div>
          <div className="text-xs text-amber-600">{earnedPoints}/{totalPossiblePoints} XP</div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          
          {[25, 50, 75, 100].map(milestone => (
            <div
              key={milestone}
              className={`absolute top-0 w-1 h-3 rounded-full ${
                completionPercentage >= milestone ? "bg-green-500" : "bg-gray-400"
              }`}
              style={{ left: `${milestone}%` }}
            />
          ))}
        </div>
        
        {nextMilestone && (
          <div className="mt-3 text-center">
            <div className="text-sm text-gray-600">
              Prochain objectif : {nextMilestone.threshold}% 
              <span className="text-amber-600 font-medium">
                (+{nextMilestone.pointsNeeded} XP nécessaires)
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Actions prioritaires</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            {showDetails ? "Masquer" : "Voir tout"}
          </button>
        </div>

        <div className="space-y-3">
          {(showDetails ? incompleteFields : highPriorityFields).map((field, index) => (
            <div
              key={field.name}
              className="bg-white rounded-lg p-4 border border-amber-200 hover:border-amber-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    field.priority === "high" ? "bg-red-500" :
                    field.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900">{field.label}</div>
                    {field.description && (
                      <div className="text-sm text-gray-600">{field.description}</div>
                    )}
                    <div className="text-xs text-gray-500">
                      ⏱️ {getActionTiming(field)} • +{field.points || 10} XP
                    </div>
                  </div>
                </div>
                <Link
                  href={field.href}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 text-sm font-medium"
                >
                  Compléter
                </Link>
              </div>
            </div>
          ))}
        </div>

        {!showDetails && incompleteFields.length > highPriorityFields.length && (
          <div className="text-center">
            <button
              onClick={() => setShowDetails(true)}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Voir {incompleteFields.length - highPriorityFields.length} autres actions →
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Progression globale</span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {earnedPoints}/{totalPossiblePoints} XP ({completionPercentage}%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionEnhanced;