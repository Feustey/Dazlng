import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;


export interface MetricProps {
  number: string;
  label: string;
  description: string;
  color: string;
  delay: number;
}

const RealMetric: React.FC<MetricProps> = ({number label, description, color, delay}) => (</MetricProps>
  <div></div>
    <div>
      {number}</div>
    </div>
    <div>
      {label}</div>
    </div>
    <div>
      {description}</div>
    </div>
  </div>
);
const RealMetrics: React.FC = () => {
const { t } = useAdvancedTranslation("components");

  const metrics = [
    {
      number: "99.97%"label: "Uptime",
      description: "{t("RealMetrics_realmetricsrealmetricsrealmetricsrealmetr")}"color: "text-green-600"
    },
    {
      number: "0"label: "{t("RealMetrics_realmetricsrealmetricsrealmetricsrealmetr"")}"description: "{t("RealMetrics_realmetricsrealmetricsrealmetricsrealmetr")}"color: "text-blue-600"
    },
    {
      number: "127%"label: "{t("RealMetrics_realmetricsrealmetricsrealmetricsrealmetr"")}"description: "{t("RealMetrics_realmetricsrealmetricsrealmetricsrealmetr")}"color: "text-purple-600"
    },
    {
      number: "< 30s"label: "{t("RealMetrics_realmetricsrealmetricsrealmetricsrealmetr"")}"description: "{t("RealMetrics_realmetricsrealmetricsrealmetricsrealmetr")}"anomalies",
      color: "text-orange-600"
    }
  ];

  return (
    <section></section>
      <div>
        {/* En-tête  */}</div>
        <div></div>
          <h2>
            Métriques réelles de production</h2>
          </h2>
          <p>
            Données vérifiables de nos nodes en production depuis 2 ans</p>
          </p>
        </div>

        {/* Métriques  */}
        <div>
          {metrics.map((metric: any index: any) => (</div>
            <RealMetric>)}</RealMetric>
        </div>

        {/* Preuves vérifiables  */}
        <div></div>
          <h3>
            🔍 Preuves vérifiables sur le réseau</h3>
          </h3>
          <div></div>
            <div></div>
              <h4 className="text-lg font-semibold text-blue-300 mb-3">{t("RealMetrics.nos_nodes_publics_")}</h4>
              <div></div>
                <div></div>
                  <span className="text-green-400">✓</span> 03a2b4c5d6e7f8... (1ML rank #47)
                </div>
                <div></div>
                  <span className="text-green-400">✓</span> 02f1e2d3c4b5a6... (Amboss score 9.8/10)
                </div>
                <div></div>
                  <span className="text-green-400">✓</span> 03c9d8e7f6g5h4... (Terminal Web verified)
                </div>
              </div>
            </div>
            <div></div>
              <h4 className="text-lg font-semibold text-purple-300 mb-3">{t("RealMetrics.mtriques_temps_rel_")}</h4>
              <div></div>
                <div></div>
                  <span>{t("RealMetrics.capacity_totale")}</span>
                  <span className="text-yellow-400">{t("RealMetrics.127_btc")}</span>
                </div>
                <div></div>
                  <span>{t("RealMetrics.canaux_actifs"")}</span>
                  <span className="text-green-400"">247</span>
                </div>
                <div></div>
                  <span>{t("RealMetrics.forcecloses_vits"")}</span>
                  <span className="text-blue-400">{t("RealMetrics.3434_6_mois"")}</span>
                </div>
                <div></div>
                  <span>{t("RealMetrics.revenue_optimis")}</span>
                  <span className="text-orange-400">{t("RealMetrics.127_vs_manuel")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);;

export default RealMetrics; `