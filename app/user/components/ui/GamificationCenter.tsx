import React, { useState } from 'react';
import { Trophy, Target, Star, Award, TrendingUp, Users, Zap, Shield } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'startup' | 'growth' | 'performance' | 'community';
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedDate?: Date;
}

export interface GamificationCenterProps {
  userScore: number;
  achievements: Achievement[];
  currentLevel: number;
  pointsToNextLevel: number;
  totalPoints: number;
  networkRank?: number;
  networkSize?: number;
}

export const GamificationCenter: React.FC<GamificationCenterProps> = ({
  userScore,
  achievements,
  currentLevel,
  pointsToNextLevel,
  totalPoints,
  networkRank = 150,
  networkSize = 1200
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tous', icon: <Star className="w-4 h-4" /> },
    { id: 'startup', label: 'Premiers pas', icon: <Zap className="w-4 h-4" /> },
    { id: 'growth', label: 'Croissance', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <Target className="w-4 h-4" /> },
    { id: 'community', label: 'Communauté', icon: <Users className="w-4 h-4" /> }
  ];

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  const levelProgress = ((100 - pointsToNextLevel) / 100) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏆</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Centre de Réussites</h2>
              <p className="text-gray-600 text-sm">Débloquez des achievements et progressez dans le réseau</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">Niveau {currentLevel}</div>
            <div className="text-sm text-gray-500">{totalPoints} points</div>
          </div>
        </div>

        {/* Barre de progression niveau */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progression vers le niveau {currentLevel + 1}
            </span>
            <span className="text-sm text-gray-500">
              {pointsToNextLevel} points restants
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        {/* Stats générales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Achievements</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{unlockedCount}/{totalAchievements}</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Score Global</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{userScore}/100</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Classement</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">#{networkRank}</div>
            <div className="text-xs text-gray-500">sur {networkSize.toLocaleString()}</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Prochain Objectif</span>
            </div>
            <div className="text-sm font-bold text-orange-600">
              {filteredAchievements.find(a => !a.unlocked)?.title || 'Tous débloqués !'}
            </div>
          </div>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeCategory === category.id
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.icon}
            {category.label}
          </button>
        ))}
      </div>

      {/* Grille des achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => (
          <div
            key={achievement.id}
            className={`relative border rounded-lg p-4 transition ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            {/* Badge débloqué */}
            {achievement.unlocked && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <Award className="w-3 h-3" />
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${
                  achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h3>
                <p className={`text-sm mb-2 ${
                  achievement.unlocked ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                
                {/* Progression */}
                {achievement.progress !== undefined && achievement.maxProgress && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progression</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          achievement.unlocked ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                        style={{ 
                          width: `${(achievement.progress / achievement.maxProgress) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    achievement.unlocked
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {achievement.points} points
                  </span>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <span className="text-xs text-gray-500">
                      {achievement.unlockedDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🎯</div>
          <p>Aucun achievement dans cette catégorie pour le moment.</p>
        </div>
      )}
    </div>
};
}
