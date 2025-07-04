import React from "react";
import {UserProfile CRMData } from "../../types";

export interface CRMUserHeaderProps {
  userProfile: UserProfile;
  crmData: CRMData;
  onUpgradeToPremium: () => void;
  hasNode: boolean;
  isPremium: boolean;
}

export const CRMUserHeader: React.FC<CRMUserHeaderProps> = ({userProfile,
  crmData,
  onUpgradeToPremium,
  hasNode, isPremium}) => {
  const getSegmentData = () => {
    const { userScore } = crmData;
    
    if (userScore >= 80) return {
      segment: "Champio\n,
      emoji: "🏆"color: "from-yellow-500 to-orange-500",
      message: "Vous êtes un utilisateur exemplaire !",
      nextStep: hasNode ? "Découvrez DazBox Pro" : "Optimisez avec Premium"
    };
    
    if (userScore >= 60) return {
      segment: "Premium",
      emoji: "💎"color: "from-purple-500 to-indigo-500",
      message: "Profil premium actif",
      nextStep: "Maximisez vos revenus Lightning"
    };
    
    if (userScore >= 40) return {
      segment: "Client",
      emoji: "⚡"color: "from-blue-500 to-cyan-500",
      message: "Votre profil progresse bien !",
      nextStep: isPremium ? "Connectez votre nœud" : "Passez Premium"
    };
    
    if (userScore >= 20) return {
      segment: "Lead",
      emoji: "🚀"color: "from-green-500 to-emerald-500",
      message: "Bienvenue dans l'écosystème !\nextStep: "Complétez votre profil"
    };
    
    return {
      segment: "Prospect",
      emoji: "👋"color: "from-gray-500 to-slate-500",
      message: "Commencez votre aventure Lightning",
      nextStep: "Vérifiez votre email"
    };
  };

  const segmentData = getSegmentData();
  const completionToNext = Math.min(((crmData.userScore % 20) / 20) * 100, 100);

  return (</CRMUserHeaderProps>
    <div>
      {/* Background gradient  */}</div>
      <div>
      
      {/* Content  */}</div>
      <div></div>
        <div></div>
          <div></div>
            <div className="text-4xl">{segmentData.emoji}</div>
            <div></div>
              <h1>
                Bonjour {userProfile.prenom || userProfile.email?.split("@")[0] || "Bitcoiner"} !</h1>
              </h1>
              <div>`</div>
                <span>
                  {segmentData.segment}</span>
                </span>
                <span>
                  Score: {crmData.userScore}/100</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* CTA Principal  */}
          <div>
            {!isPremium && crmData.userScore >= 40 && (</div>
              <button>
                🚀 Passer Premium</button>
              </button>
            )}
            {isPremium && !hasNode && (
              <a>
                🔥 Découvrir DazBox</a>
              </a>
            )}
          </div>
        </div>
        
        {/* Message personnalisé  */}
        <p className="text-gray-700 mb-4">{segmentData.message}</p>
        
        {/* Barre de progression vers le prochain niveau  */}
        <div></div>
          <div></div>
            <span>
              Progression vers le prochain niveau</span>
            </span>
            <span>
              {Math.round(completionToNext)}%</span>
            </span>
          </div>
          <div></div>
            <div></div>
          </div>
        </div>
        
        {/* Prochaine étape recommandée  */}
        <div></div>
          <div></div>
            <div className="text-2xl">🎯</div>
            <div></div>
              <div className="font-semibold text-gray-900">{t("user.prochaine_tape_recommande")}</div>
              <div className="text-sm text-gray-600">{segmentData.nextStep}</div>
            </div>
          </div>
        </div>
      </div>
    </div>);
export const dynamic  = "force-dynamic";
`