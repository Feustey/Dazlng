import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Circle, Star, Target, Gift, TrendingUp } from 'lucide-react';

interface ProfileField {
  name: string;
  label: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  href: string;
  points: number;
  description?: string;
}

interface ProfileCompletionEnhancedProps {
  profileFields: ProfileField[];
  completionPercentage: number;
  userScore: number;
}

export const ProfileCompletionEnhanced: React.FC<ProfileCompletionEnhancedProps> = ({
  profileFields,
  completionPercentage,
  userScore
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const incompleteFields = profileFields.filter(field => !field.completed);
  const highPriorityFields = incompleteFields.filter(field => field.priority === 'high');
  const completedFields = profileFields.filter(field => field.completed);
  
  const totalPossiblePoints = profileFields.reduce((sum, field) => sum + field.points, 0);
  const earnedPoints = completedFields.reduce((sum, field) => sum + field.points, 0);

  const getRewardForCompletion = () => {
    if (completionPercentage === 100) return "🎉 Profil Master débloqué !";
    if (completionPercentage >= 80) return "🏆 Presque champion !";
    if (completionPercentage >= 60) return "⭐ Bon progrès !";
    if (completionPercentage >= 40) return "🚀 En bonne voie !";
    return "👋 Commencez votre aventure !";
  };

  const getNextMilestone = () => {
    if (completionPercentage >= 100) return null;
    const nextThreshold = Math.ceil(completionPercentage / 20) * 20;
    const pointsNeeded = Math.ceil((nextThreshold - completionPercentage) / 100 * totalPossiblePoints);
    return { threshold: nextThreshold, pointsNeeded };
  };

  const nextMilestone = getNextMilestone();

  if (completionPercentage >= 100) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
              Profil Master ! 
              <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                +50 XP Bonus
              </span>
            </h2>
            <p className="text-green-700 text-sm">
              Félicitations ! Vous avez débloqué toutes les fonctionnalités personnalisées.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{earnedPoints}/{totalPossiblePoints}</div>
            <div className="text-xs text-green-600">Points XP</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-gray-700">Statut</span>
            </div>
            <div className="text-lg font-bold text-green-600">Utilisateur Vérifié</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-700">Score Global</span>
            </div>
            <div className="text-lg font-bold text-blue-600">{userScore}/100</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-gray-700">Avantages</span>
            </div>
            <div className="text-sm text-purple-600">Accès complet</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link 
            href="/user/settings" 
            className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline"
          >
            Gérer mon profil →
          </Link>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
            Partager mon statut
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Circle className="w-8 h-8 text-amber-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-bold text-amber-600">{Math.round(completionPercentage)}</div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-amber-800 flex items-center gap-2">
              Complétez votre profil
              <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                {getRewardForCompletion()}
              </span>
            </h2>
            <p className="text-amber-700 text-sm">
              Débloquez plus de fonctionnalités et améliorez votre score
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-800">{completionPercentage}%</div>
          <div className="text-xs text-amber-600">{earnedPoints}/{totalPossiblePoints} XP</div>
        </div>
      </div>
      
      {/* Barre de progression avec milestones */}
      <div className="mb-6">
        <div className="w-full bg-amber-200 rounded-full h-4 relative overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-4 rounded-full transition-all duration-1000 ease-out relative" 
            style={{ width: `${completionPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse" />
          </div>
          
          {/* Milestones */}
          {[20, 40, 60, 80, 100].map(milestone => (
            <div
              key={milestone}
              className={`absolute top-0 h-4 w-0.5 ${
                completionPercentage >= milestone ? 'bg-green-500' : 'bg-gray-400'
              }`}
              style={{ left: `${milestone}%` }}
            />
          ))}
        </div>
        
        {nextMilestone && (
          <div className="flex justify-between items-center mt-2 text-xs text-amber-600">
            <span>Prochain jalon: {nextMilestone.threshold}%</span>
            <span>+{nextMilestone.pointsNeeded} XP restants</span>
          </div>
        )}
      </div>

      {/* Actions prioritaires */}
      {highPriorityFields.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-medium text-amber-800">Actions prioritaires</h3>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
              +{highPriorityFields.reduce((sum, field) => sum + field.points, 0)} XP
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {highPriorityFields.slice(0, 2).map((field) => (
              <Link 
                key={field.name}
                href={field.href}
                className="group block p-4 bg-white rounded-lg border border-red-200 hover:border-red-300 transition-all hover:shadow-md hover:scale-105"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 rounded-full p-2 group-hover:bg-red-200 transition-colors">
                    <Circle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 group-hover:text-red-700">
                      {field.label}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {field.description || 'Cliquez pour compléter'}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                        +{field.points} XP
                      </span>
                      <span className="text-xs text-gray-500">
                        2 min
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Toggle détails */}
      <div className="space-y-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium"
        >
          <span>{showDetails ? 'Masquer' : 'Voir'} tous les champs</span>
          <div className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
            ⌄
          </div>
        </button>

        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {profileFields.map((field) => (
              <div 
                key={field.name} 
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  field.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200'
                }`}
              >
                {field.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    field.completed ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {field.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    +{field.points} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-6 flex items-center justify-between">
        <Link 
          href="/user/settings" 
          className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition transform hover:scale-105"
        >
          Compléter maintenant
        </Link>
        <div className="text-right text-xs text-amber-600">
          <div>Temps estimé: {incompleteFields.length * 2} min</div>
          <div>Gain XP: +{totalPossiblePoints - earnedPoints} points</div>
        </div>
      </div>
    </div>
  );
}; 