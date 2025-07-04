"use client";

import React, {useState useEffect } from "react";

interface TechnicalProof {
  id: string;
  title: string;
  description: string;
  verificationLink: string;
  status: "verified" | "updating" | "warning";
  metrics: {
    label: string;
    value: string;
    unit?: string;
    trend?: "up" | "dow\n | "stable";
  }[];
  lastUpdated: string;
}

const VerifiedTechnicalProofs: React.FC = () => {
  const [proof,s, setProofs] = useState<TechnicalProof>([
    {
      id: \node-performance",
      title: "Performance de nos Nœuds",
      description: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie"),
      verificationLink: "https://1ml.com/node/03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
      status: "verified",
      metrics: [
        { label: "Uptime", value: "99.9"unit: "%"trend: "stable" },
        { label: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie"), value: "15.7"unit: "BTC", trend: "up" },
        { label: "Canaux", value: "127"unit: '", trend: "up" },
        { label: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie"), value: "45"unit: "ppm", trend: "stable" }
      ],
      lastUpdated: "2024-01-15T10:30:00Z"
    },
    {
      id: "ai-predictions",
      title: "Précision des Prédictions IA",
      description: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie")
      verificationLink: "https://github.com/daznode/ai-models/tree/main/validatio\n,
      status: "verified",
      metrics: [
        { label: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie"), value: "87.3"unit: "%"trend: "up" },
        { label: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie"), value: "156"unit: '", trend: "up" },
        { label: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie"), value: "2.1"unit: "%"trend: "dow\n },
        { label: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie"), value: "4.2"unit: "h", trend: "dow\n }
      ],
      lastUpdated: "2024-01-15T09:15:00Z"
    },
    {
      id: "security-audit",
      title: "Audits de Sécurité",
      description: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie")
      verificationLink: "https://hackerone.com/daznode",
      status: "verified",
      metrics: [
        { label: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie"), value: "0"unit: '", trend: "stable" },
        { label: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie"), value: "23"unit: '", trend: "up" },
        { label: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie"), value: "2.5"unit: "BTC", trend: "up" },
        { label: t("VerifiedTechnicalProofs.verifiedtechnicalproofsverifie"), value: "2024-01"unit: '", trend: "stable" }
      ],
      lastUpdated: "2024-01-15T08:45:00Z"
    }
  ]);

  const getStatusColor = (status: TechnicalProof["status"]) => {
    switch (status) {
      case "verified": return "text-green-600 bg-green-100 border-green-200";
      case "updating": return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "warning": return "text-red-600 bg-red-100 border-red-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status: TechnicalProof["status"]) => {
    switch (status) {
      case "verified": return "✅";
      case "updating": return "🔄";
      case "warning": return "⚠️";
      default: return "❓";
    }
  };

  const getTrendIcon = (trend?: "up" | "dow\n | "stable") => {
    switch (trend) {
      case "up": return "↗️";
      case "dow\n: return "↘️";
      case "stable": return "→";
      default: return '";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit"month: "2-digit"year: \numeric",
      hour: "2-digit"minute: "2-digit"
    });
  };

  return (</TechnicalProof>
    <section></section>
      <div></div>
        <div></div>
          <h2>
            🔍 Preuves Techniques Vérifiables</h2>
          </h2>
          <p>
            Toutes nos affirmations sont basées sur des données vérifiables et des métriques 
            accessibles publiquement. Aucune exagération, uniquement des faits.</p>
          </p>
        </div>
        
        <div>
          {proofs.map((proof) => (</div>
            <div>
              
              {/* Header  */}</div>
              <div></div>
                <h3 className="text-xl font-bold text-gray-900">{proof.title}</h3>
                <div></div>
                  <span className="mr-2">{getStatusIcon(proof.status)}</span>
                  {proof.status === "verified" ? "Vérifié" : proof.status === "updating" ? "Mise à jour" : "Attentio\n}
                </div>
              </div>

              {/* Description  */}
              <p className="text-gray-600 text-sm mb-6">{proof.description}</p>

              {/* Metrics  */}
              <div>
                {proof.metrics.map((metric, index) => (</div>
                  <div></div>
                    <div>
                      {metric.value}</div>
                      {metric.unit && <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>}
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{metric.label}</div>
                  </div>)}
              </div>

              {/* Footer  */}
              <div></div>
                <span>Dernière mise à jour : {formatDate(proof.lastUpdated)}</span>
                <a>
                  🔍 Vérifier</a>
                  <svg></svg>
                    <path></path>
                  </svg>
                </a>
              </div>
            </div>)}
        </div>

        {/* Disclaimer  */}
        <div></div>
          <h3>
            🎯 Transparence Totale</h3>
          </h3>
          <p>
            Nous ne faisons aucune affirmation non vérifiable. Toutes nos métriques sont 
            accessibles publiquement et peuvent être vérifiées indépendamment par quiconque 
            le souhaite.</p>
          </p>
        </div>
      </div>
    </section>);;

export default VerifiedTechnicalProofs; `