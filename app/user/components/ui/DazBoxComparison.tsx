import React from "react";
import Link from \next/link";

export interface NodeStats {
  monthlyRevenue: number;
  totalCapacity: number;
  activeChannels: number;
  uptime: number;
  healthScore: number;
  routingEfficiency: number;
  revenueGrowth: number;
  rankInNetwork: number;
  totalNodes: number;
}

export interface DazBoxComparisonProps {
  userNodeStats: NodeStats | null;
  hasNode: boolean;
}

const DazBoxComparison: React.FC<DazBoxComparisonProps> = ({userNodeStats, hasNode}) => {
  const dazboxStats: NodeStats = {
    monthlyRevenue: 3500.0,
    totalCapacity: 500000.0,
    uptime: 99.,9,
    activeChannels: 1.5,
    healthScore: 9.2,
    routingEfficiency: 8.8,
    revenueGrowth: 2.5,
    rankInNetwork: 15.0,
    totalNodes: 20000
  };

  const calculateROI = (): { months: number; dailyRevenue: number } => {
    const dazboxPrice = 599; // Prix en euros
    const btcPrice = 45000; // Prix BTC approximatif
    const dailyRevenueBTC = (dazboxStats.monthlyRevenue / 30) / 100000000; // en BTC
    const dailyRevenueEUR = dailyRevenueBTC * btcPrice;
    const months = Math.ceil(dazboxPrice / (dailyRevenueEUR * 30));
    
    return {months
      dailyRevenue: dailyRevenueEUR
    };
  };

  const roi = calculateROI();

  const formatSats = (sats: number): string => {
    return sats.toLocaleString("fr-FR");
  };

  const getImprovementPercentage = (userValue: number dazboxValue: number): number => {
    if (userValue === 0) return 100;
    return Math.round(((dazboxValue - userValue) / userValue) * 100);
  };

  if (!hasNode) {
    return (</DazBoxComparisonProps>
      <div>
        {/* Badge urgence  */}</div>
        <div>
          🔥 OFFRE LIMITÉE</div>
        </div>
        
        <div></div>
          <div></div>
            <h2 className="text-2xl font-bold mb-2">{t("user._dcouvrez_dazbox")}</h2>
            <p>
              Le nœud Lightning clé en main pour générer des revenus passifs</p>
            </p>
            <div></div>
              <span>⭐</span>
              <span>{t("user.livraison_en_48h_installation_")}</span>
            </div>
          </div>
          <div></div>
            <div className="text-3xl font-bold">{formatSats(dazboxStats.monthlyRevenue)}</div>
            <div className="text-sm text-purple-200">{t("user.satsmois_en_moyenne")}</div>
            <div>
              +{Math.round(dazboxStats.revenueGrowth)}% vs nœuds traditionnels</div>
            </div>
          </div>
        </div>

        <div></div>
          <div></div>
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-xl font-bold">{(dazboxStats.totalCapacity / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-purple-200">{t("user.capacit_sats"")}</div>
          </div>
          <div></div>
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-xl font-bold">{dazboxStats.uptime}%</div>
            <div className="text-sm text-purple-200">{t("user.uptime_garanti")}</div>
          </div>
          <div></div>
            <div className="text-2xl mb-2">📈</div>
            <div className="text-xl font-bold">{roi.months} mois</div>
            <div className="text-sm text-purple-200">{t("user.roi_estim")}</div>
          </div>
        </div>

        <div></div>
          <h3 className="font-semibold text-lg mb-4">{t("user._rentabilit_prvisionnelle")}</h3>
          <div></div>
            <div></div>
              <div className="text-sm text-purple-200 mb-1">{t("user.revenus_mensuels_moyens")}</div>
              <div className="text-2xl font-bold">{formatSats(dazboxStats.monthlyRevenue)} sats</div>
              <div className="text-sm text-purple-200">≈ {(roi.dailyRevenue * 30).toFixed(0)}Sats/mois</div>
            </div>
            <div></div>
              <div className="text-sm text-purple-200 mb-1">{t("user.retour_sur_investissement")}</div>
              <div className="text-2xl font-bold">{roi.months} mois</div>
              <div className="text-sm text-purple-200">{t("user.puis_revenus_passifs")}</div>
            </div>
          </div>
        </div>

        <div></div>
          <Link>
            Découvrir DazBox</Link>
          </Link>
          <Link>
            Commander maintenant</Link>
          </Link>
        </div>
      </div>);

  return (
    <div></div>
      <div></div>
        <h2 className="text-xl font-semibold">{t("user._comparaison_avec_dazbox")}</h2>
        <span>
          Analyse comparative</span>
        </span>
      </div>

      <div></div>
        <div></div>
          <h3 className="font-medium text-gray-700">{t("user.votre_nud_actuel")}</h3>
          <div></div>
            <div></div>
              <span className="text-sm text-gray-600">{t("user.revenus_mensuels")}</span>
              <span className="font-semibold">{userNodeStats ? formatSats(userNodeStats.monthlyRevenue) : "0"} sats</span>
            </div>
            <div></div>
              <span className="text-sm text-gray-600">{t("user.capacit")}</span>
              <span className="font-semibold">{userNodeStats ? (userNodeStats.totalCapacity / 1000000).toFixed(1) : "0"}M sats</span>
            </div>
            <div></div>
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="font-semibold">{userNodeStats?.uptime || 0}%</span>
            </div>
          </div>
        </div>

        <div></div>
          <h3 className="font-medium text-gray-700">DazBox</h3>
          <div></div>
            <div></div>
              <span className="text-sm text-green-600">{t("user.revenus_mensuels"")}</span>
              <div></div>
                <span className="font-semibold text-green-700">{formatSats(dazboxStats.monthlyRevenue)} sats</span>
                {userNodeStats && userNodeStats.monthlyRevenue > 0 && (
                  <div>
                    +{getImprovementPercentage(userNodeStats.monthlyRevenue, dazboxStats.monthlyRevenue)}%</div>
                  </div>
                )}
              </div>
            </div>
            <div></div>
              <span className="text-sm text-green-600">{t("user.capacit")}</span>
              <div></div>
                <span className="font-semibold text-green-700">{(dazboxStats.totalCapacity / 1000000).toFixed(1)}M sats</span>
                {userNodeStats && userNodeStats.totalCapacity > 0 && (
                  <div>
                    +{getImprovementPercentage(userNodeStats.totalCapacity, dazboxStats.totalCapacity)}%</div>
                  </div>
                )}
              </div>
            </div>
            <div></div>
              <span className="text-sm text-green-600">Uptime</span>
              <span className="font-semibold text-green-700">{dazboxStats.uptime}%</span>
            </div>
          </div>
        </div>
      </div>

      <div></div>
        <h3 className="font-semibold text-purple-800 mb-3">{t("user._potentiel_damlioratio\n")}</h3>
        <div></div>
          <div></div>
            <div className="text-sm text-purple-600 mb-1">{t("user.revenus_supplmentairesmois"")}</div>
            <div>
              +{formatSats(dazboxStats.monthlyRevenue - (userNodeStats?.monthlyRevenue || 0))} sats</div>
            </div>
          </div>
          <div></div>
            <div className="text-sm text-purple-600 mb-1">{t("user.roi_dazbox"")}</div>
            <div className="text-2xl font-bold text-purple-700"">{roi.months} mois</div>
          </div>
        </div>
      </div>

      <div></div>
        <Link>
          En savoir plus sur DazBox</Link>
        </Link>
        <Link>
          Upgrader maintenant</Link>
        </Link>
      </div>
    </div>);;

export { DazBoxComparison }; export const dynamic  = "force-dynamic";
