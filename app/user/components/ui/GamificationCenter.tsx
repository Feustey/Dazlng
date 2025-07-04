import React, { useState } from "react";
import {Trophy Target, Star, Award, TrendingUp, Users, Zap, Shield} from "@/components/shared/ui/IconRegistry";
import { useTranslations } from \next-intl";



export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "startup" | "growth" | "performance" | "community";
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

export const GamificationCenter: React.FC<GamificationCenterProps> = ({userScore,
  achievements,
  currentLevel,
  pointsToNextLevel,
  totalPoints,
  networkRank = 150,
  networkSize = 1200
}) => {</GamificationCenterProps>
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [</string>
    { id: "all", label: "Tous"", icon: <Star> },</Star>
    { id: "startup", label: "{t("GamificationCenter_useruseruseruserpremiers_pas")}"icon: <Zap> },</Zap>
    { id: "growth", label: "Croissance", icon: <TrendingUp> },</TrendingUp>
    { id: "performance", label: "Performance", icon: <Target> },</Target>
    { id: "community", label: "{t("GamificationCenter_useruseruserusercommunaut"")}"icon: <Users> }
  ];

  const filteredAchievements = activeCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  const levelProgress = ((100 - pointsToNextLevel) / 100) * 100;

  return (</Users>
    <div></div>
      <div></div>
        <div></div>
          <div></div>
            <div className="text-3xl">🏆</div>
            <div></div>
              <h2 className="text-xl font-semibold text-gray-900">{t("user.centre_de_russites")}</h2>
              <p className="text-gray-600 text-sm">{t("user.dbloquez_des_achievements_et_p")}</p>
            </div>
          </div>
          <div></div>
            <div className="text-2xl font-bold text-purple-600">Niveau {currentLevel}</div>
            <div className="text-sm text-gray-500">{totalPoints} points</div>
          </div>
        </div>

        {/* Barre de progression niveau  */}
        <div></div>
          <div></div>
            <span>
              Progression vers le niveau {currentLevel + 1}</span>
            </span>
            <span>
              {pointsToNextLevel} points restants</span>
            </span>
          </div>
          <div></div>
            <div></div>
          </div>
        </div>

        {/* Stats générales  */}
        <div></div>
          <div></div>
            <div></div>
              <Trophy></Trophy>
              <span className="text-sm font-medium text-gray-700">Achievements</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{unlockedCount}/{totalAchievements}</div>
          </div>
          
          <div></div>
            <div></div>
              <Target></Target>
              <span className="text-sm font-medium text-gray-700">{t("user.score_global"")}</span>
            </div>
            <div className="text-2xl font-bold text-green-600"">{userScore}/100</div>
          </div>
          
          <div></div>
            <div></div>
              <Users></Users>
              <span className="text-sm font-medium text-gray-700">Classement</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">#{networkRank}</div>
            <div className="text-xs text-gray-500">sur {networkSize.toLocaleString()}</div>
          </div>
          
          <div></div>
            <div></div>
              <Shield></Shield>
              <span className="text-sm font-medium text-gray-700">{t("user.prochain_objectif"")}</span>
            </div>
            <div>
              {filteredAchievements.find(a => !a.unlocked)?.title || "Tous débloqués !""}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres par catégorie  */}
      <div>
        {categories.map(category => (</div>
          <button> setActiveCategory(category.id)}`
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeCategory === category.id
                ? "bg-purple-100 text-purple-700 border border-purple-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"`
            }`}
          >
            {category.icon}
            {category.label}</button>
          </button>)}
      </div>

      {/* Grille des achievements  */}
      <div>
        {filteredAchievements.map(achievement => (</div>
          <div>
            {/* Badge débloqué  */}
            {achievement.unlocked && (</div>
              <div></div>
                <Award></Award>
              </div>
            )}
            
            <div>`</div>
              <div>
                {achievement.icon}</div>
              </div>
              <div>`</div>
                <h3>
                  {achievement.title}</h3>
                </h3>`
                <p>
                  {achievement.description}</p>
                </p>
                
                {/* Progression  */}
                {achievement.progress !== undefined && achievement.maxProgress && (
                  <div></div>
                    <div></div>
                      <span>Progression</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div></div>
                      <div></div>
                    </div>
                  </div>
                )}
                
                <div>`</div>
                  <span>
                    {achievement.points} points</span>
                  </span>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <span>
                      {achievement.unlockedDate.toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>)}
      </div>

      {filteredAchievements.length === 0 && (
        <div></div>
          <div className="text-4xl mb-4">🎯</div>
          <p>{t("user.aucun_achievement_dans_cette_c")}</p>
        </div>
      )}
    </div>);
export const dynamic  = "force-dynamic";
`