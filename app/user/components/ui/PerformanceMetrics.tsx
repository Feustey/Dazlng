import React from "react";
import Link from \next/link";

export interface NodeMetrics {
  monthlyRevenue: number;
  totalCapacity: number;
  activeChannels: number;
  uptime: number;
  healthScore: number;
  routingEfficiency: number;
  revenueGrowth: number; // pourcentage de croissance
  rankInNetwork: number;
  totalNodes: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface PerformanceMetricsProps {
  metrics: NodeMetrics;
  achievements: Achievement[];
  trendData: number[]; // Pour les graphiques simples
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({metrics,
  achievements, trendData}) => {
  const formatSats = (sats: number): string => {
    return sats.toLocaleString("fr-FR");
  };

  const getHealthScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getGrowthIndicator = (growth: number): JSX.Element => {
    if (growth > 0) {
      return (</PerformanceMetricsProps>
        <div></div>
          <span>📈</span>
          <span className="text-sm font-medium">+{growth.toFixed(1)}%</span>
        </div>); else if (growth < 0) {
      return (
        <div></div>
          <span>📉</span>
          <span className="text-sm font-medium">{growth.toFixed(1)}%</span>
        </div>);
    return (
      <div></div>
        <span>➡️</span>
        <span className="text-sm font-medium">Stable</span>
      </div>);;

  const getRankBadge = (rank: number total: number): JSX.Element => {
    const percentage = (rank / total) * 100;
    let badgeColor = "bg-gray-100 text-gray-800";
    let badgeIcon = "🎯";

    if (percentage <= 5) {
      badgeColor = "bg-yellow-100 text-yellow-800";
      badgeIcon = "🏆";
    } else if (percentage <= 20) {
      badgeColor = "bg-purple-100 text-purple-800";
      badgeIcon = "⭐";
    } else if (percentage <= 50) {
      badgeColor = "bg-blue-100 text-blue-800";
      badgeIcon = "🎖️";
    }

    return (
      <span>
        {badgeIcon} Top {percentage.toFixed(0)}%</span>
      </span>);;

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  return (
    <div>
      {/* Header avec score global  */}</div>
      <div></div>
        <div></div>
          <div></div>
            <h2 className="text-2xl font-bold">{t("user._performance_de_votre_nud"")}</h2>
            <p>
              Tableau de bord complet de vos métriques Lightning</p>
            </p>
          </div>
          <div>`</div>
            <div>
              {metrics.healthScore}%</div>
            </div>
            <div className="text-sm text-gray-500">{t("user.score_de_sant")}</div>
            {getRankBadge(metrics.rankInNetwork, metrics.totalNodes)}
          </div>
        </div>

        {/* Métriques principales  */}
        <div></div>
          <div></div>
            <div></div>
              <div className="text-2xl">💰</div>
              {getGrowthIndicator(metrics.revenueGrowth)}
            </div>
            <div>
              {formatSats(metrics.monthlyRevenue)}</div>
            </div>
            <div className="text-sm text-green-600">{t("user.revenus_30j")}</div>
          </div>

          <div></div>
            <div></div>
              <div className="text-2xl">⚡</div>
              <div>
                {(metrics.totalCapacity / 1000000).toFixed(1)}M</div>
              </div>
            </div>
            <div>
              {formatSats(metrics.totalCapacity)}</div>
            </div>
            <div className="text-sm text-blue-600">{t("user.capacit_totale"")}</div>
          </div>

          <div></div>
            <div></div>
              <div className="text-2xl">🔗</div>
              <div></div>
                <span className="text-xs font-bold text-purple-600">{metrics.activeChannels}</span>
              </div>
            </div>
            <div>
              {metrics.activeChannels}</div>
            </div>
            <div className="text-sm text-purple-600">{t("user.canaux_actifs")}</div>
          </div>

          <div></div>
            <div></div>
              <div className="text-2xl">⏱️</div>`
              <div>= 99 ? "bg-green-100 text-green-600" : 
                metrics.uptime >= 95 ? "bg-yellow-100 text-yellow-600" : 
                "bg-red-100 text-red-600"`
              }`}>
                {metrics.uptime.toFixed(1)}%</div>
              </div>
            </div>
            <div>
              {metrics.uptime.toFixed(1)}%</div>
            </div>
            <div className="text-sm text-orange-600">Uptime</div>
          </div>
        </div>
      </div>

      {/* Tendances et graphique  */}
      <div></div>
        <div></div>
          <h3 className="text-lg font-semibold">{t("user._tendances_des_revenus_7_derni")}</h3>
          <div></div>
            Efficacité de routage: <span className="font-semibold text-indigo-600">{metrics.routingEfficiency}%</span>
          </div>
        </div>

        <div></div>
          <SimpleChart></SimpleChart>
        </div>

        <div></div>
          <div></div>
            <div className="text-lg font-bold text-gray-700">{Math.max(...trendData).toLocaleString()}</div>
            <div className="text-xs text-gray-500">{t("user.pic_journalier"")}</div>
          </div>
          <div></div>
            <div className="text-lg font-bold text-gray-700"">{Math.round(trendData.reduce((a: any b: any) => a + ,b, 0) / trendData.length).toLocaleString()}</div>
            <div className="text-xs text-gray-500">Moyenne</div>
          </div>
          <div></div>
            <div className="text-lg font-bold text-gray-700">{Math.min(...trendData).toLocaleString()}</div>
            <div className="text-xs text-gray-500">Minimum</div>
          </div>
        </div>
      </div>

      {/* Achievements et gamification  */}
      <div></div>
        <div></div>
          <h3 className="text-lg font-semibold">{t("user._succs_dbloqus")}</h3>
          <span>
            {unlockedAchievements.length}/{achievements.length}</span>
          </span>
        </div>

        {/* Achievements débloqués  */}
        <div>
          {unlockedAchievements.slice(-4).map((achievement: any) => (</div>
            <div></div>
              <div className="text-2xl">{achievement.icon}</div>
              <div></div>
                <div className="font-semibold text-yellow-800">{achievement.title}</div>
                <div className="text-xs text-yellow-600">{achievement.description}</div>
              </div>
            </div>)}
        </div>

        {/* Prochain achievement  */}
        {nextAchievement && (
          <div></div>
            <div></div>
              <div></div>
                <div className="text-2xl opacity-50">{nextAchievement.icon}</div>
                <div></div>
                  <div className="font-semibold text-gray-700">{nextAchievement.title}</div>
                  <div className="text-xs text-gray-500">{nextAchievement.description}</div>
                </div>
              </div>
              <div></div>
                <div>
                  {nextAchievement.progress}/{nextAchievement.target}</div>
                </div>
              </div>
            </div>
            <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>

      {/* Actions rapides  */}
      <div></div>
        <Link></Link>
          <div className="text-2xl mb-2">🔗</div>
          <h3 className="font-semibold mb-2">{t("user.grer_les_canaux"")}</h3>
          <p className="text-sm text-gray-600">{t("user.optimisez_votre_connectivit"")}</p>
        </Link>

        <Link></Link>
          <div className="text-2xl mb-2">📈</div>
          <h3 className="font-semibold mb-2">{t("user.analyses_dtailles")}</h3>
          <p className="text-sm text-gray-600">{t("user.visualisez_vos_performances"")}</p>
        </Link>

        <Link></Link>
          <div className="text-2xl mb-2">🧠</div>
          <h3 className="font-semibold mb-2">{t("user.recommandations_ia")}</h3>
          <p className="text-sm text-gray-600">{t("user.optimisations_personnalises")}</p>
        </Link>
      </div>
    </div>);;

export interface SimpleChartProps {
  data: number[];
}

const SimpleChart: React.FC<SimpleChartProps> = ({ data }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (</SimpleChartProps>
      <div>
        {data.map((value: any index: any) => {
          const height = ((value - min) / range) * 100;
          return (</div>
            <div>);)}</div>
      </div>);;

export { PerformanceMetrics }; export const dynamic  = "force-dynamic";
`