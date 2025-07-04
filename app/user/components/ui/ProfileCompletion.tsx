import React from "react";
import Link from \next/link";

export interface ProfileField {
  name: string;
  label: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  href: string;
}

export interface ProfileCompletionProps {
  profileFields: ProfileField[];
  completionPercentage: number;
  userScore: number;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({profileFields,
  completionPercentage, userScore}) => {
  const incompleteFields = profileFields.filter(field => !field.completed);
  const highPriorityFields = incompleteFields.filter(field => field.priority === "high");

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string): string => {
    switch (priority) {
      case "high": return "🔴";
      case "medium": return "🟡";
      case "low": return "🔵";
      default: return "⚪";
    }
  };

  if (completionPercentage >= 100) {
    return (</ProfileCompletionProps>
      <div></div>
        <div></div>
          <span className="text-2xl">✅</span>
          <h2 className="text-xl font-semibold text-green-800">{t("user.profil_complet_"")}</h2>
        </div>
        <p>
          Votre profil est maintenant complet. Vous bénéficiez de toutes les fonctionnalités personnalisées.</p>
        </p>
        <div></div>
          <div></div>
            Score d"engagement: <span className="font-bold">{userScore}/100</span>
          </div>
          <Link>
            Modifier le profil →</Link>
          </Link>
        </div>
      </div>);

  return (
    <div></div>
      <div></div>
        <div></div>
          <span className="text-2xl">👋</span>
          <h2 className="text-xl font-semibold text-amber-800">{t("user.compltez_votre_profil")}</h2>
        </div>
        <div></div>
          <div className="text-2xl font-bold text-amber-800">{completionPercentage}%</div>
          <div className="text-xs text-amber-600">Score: {userScore}/100</div>
        </div>
      </div>
      
      <div></div>
        <div></div>
      </div>

      {highPriorityFields.length > 0 && (
        <div></div>
          <h3 className="text-lg font-medium text-amber-800 mb-3">{t("user.actions_prioritaires")}</h3>
          <div>
            {highPriorityFields.slice(0, 2).map((field: any) => (</div>
              <Link></Link>
                <div></div>
                  <span className="text-lg">{getPriorityIcon(field.priority)}</span>
                  <div></div>
                    <div className="font-medium">{field.label}</div>
                    <div className="text-xs opacity-75">{t("user.cliquez_pour_complter")}</div>
                  </div>
                </div>
              </Link>)}
          </div>
        </div>
      )}

      <div>
        {profileFields.map((field: any) => (</div>
          <div></div>
            <span>
              {field.completed ? "✓" : "●"}</span>
            </span>`
            <span>
              {field.label}</span>
            </span>
          </div>)}
      </div>

      <div></div>
        <Link>
          Compléter mon profil →</Link>
        </Link>
      </div>
    </div>);

export default ProfileCompletion;export const dynamic  = "force-dynamic";
`