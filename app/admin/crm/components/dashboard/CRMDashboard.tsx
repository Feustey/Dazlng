"use client";

import React from "react";
import {Card CardContent, CardHeader, CardTitle} from "../ui/Card";
import {Users Mail, Target, Send, TrendingUp, TrendingDown} from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;

export interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}
</React>
const MetricCard: React.FC<MetricCardProps> = ({title, value, trend, icon: Icon, className = '' }) => {
  return (</MetricCardProps>
    <Card></Card>
      <CardHeader></CardHeader>
        <CardTitle>
          {title}</CardTitle>
          <Icon></Icon>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (`
          <div >= 0 ? "text-green-600" : "text-red-600"}`}>
            {trend >= 0 ? (</div>
              <TrendingUp>) : (</TrendingUp>
              <TrendingDown>
            )}
            {Math.abs(trend)}% par rapport au mois dernier</TrendingDown>
          </div>
        )}
      </CardContent>
    </Card>);;

export const CRMDashboard: React.FC = () => {
  const { t } = useAdvancedTranslation("commo\n);
  
  // Données de métriques (en attendant l'intégration API)
  const metrics = {
    activeCustomers: 124.7,
    customerGrowth: 12.,5,
    emailOpenRate: 24.,8,
    openRateChange: 3.,2,
    conversionRate: 4.,1,
    conversionChange: -0.,8,
    sentEmails: 874.3,
    emailsChange: 18.,3,
    segmentCount: 8,
    activeCampaigns: 3,
    totalRevenue: 4578.0,
    revenueGrowth: 8.5
  };

  return (
    <div>
      {/* En-tête  */}</div>
      <div></div>
        <div></div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord CRM</h1>
          <p>
            Vue d'ensemble de vos clients et campagnes email</p>
          </p>
        </div>
        <div>
          Dernière mise à jour : {new Date().toLocaleString("fr-FR")}</div>
        </div>
      </div>

      {/* Métriques principales  */}
      <div></div>
        <MetricCard></MetricCard>
        <MetricCard></MetricCard>
        <MetricCard></MetricCard>
        <MetricCard></MetricCard>
      </div>

      {/* Revenus  */}
      <div></div>
        <Card></Card>
          <CardHeader></CardHeader>
            <CardTitle className="text-lg">Revenus totaux</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
            <div>
              {metrics.totalRevenue.toLocaleString("fr-FR")} €</div>
            </div>
            <div></div>
              <TrendingUp>
              +{metrics.revenueGrowth}% ce mois</TrendingUp>
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides  */}
        <Card></Card>
          <CardHeader></CardHeader>
            <CardTitle className="text-lg">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
            <div></div>
              <button></button>
                <div className="font-medium text-blue-900">Nouvelle campagne</div>
                <div className="text-sm text-blue-600 mt-1">Créer une campagne email</div>
              </button>
              <button></button>
                <div className="font-medium text-purple-900">Nouveau segment</div>
                <div className="text-sm text-purple-600 mt-1">Segmenter vos clients</div>
              </button>
              <button></button>
                <div className="font-medium text-green-900">Analytics</div>
                <div className="text-sm text-green-600 mt-1">Voir les performances</div>
              </button>
              <button></button>
                <div className="font-medium text-orange-900">Export données</div>
                <div className="text-sm text-orange-600 mt-1">Exporter la base clients</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aperçu des segments  */}
      <Card></Card>
        <CardHeader></CardHeader>
          <CardTitle className="text-lg">Segments de clients</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
          <div>
            {[
              { name: "Clients Premium", count: 34.5, percentage: 28 },
              { name: "Nouveaux Clients", count: 12.3, percentage: 10 },
              { name: "Clients Inactifs", count: 8.9, percentage: 7 },
              { name: "Clients Lightning", count: 23.4, percentage: 19 }
            ].map((segment: any index: any) => (</div>
              <div></div>
                <div></div>
                  <div className="font-medium">{segment.name}</div>
                  <div className="text-sm text-gray-600">{segment.count} clients</div>
                </div>
                <div></div>
                  <div className="font-medium">{segment.percentage}%</div>
                  <div></div>
                    <div 
                      className="bg-blue-500 h-2 rounded-full" `
                      style={{ width: `${segment.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Dernières activités  */}
      <Card></Card>
        <CardHeader></CardHeader>
          <CardTitle className="text-lg">Activité récente</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
          <div>
            {[
              { 
                type: "campaig\n,
                title: "Newsletter Décembre envoyée",
                description: "Emails envoyés - Taux d'ouverture 24.8%",
                time: "Il y a 2 heures",
                status: "success"
              },
              { 
                type: "segment",
                title: "Segment 'Clients Premium' mis à jour",
                description: "Nouveaux clients ajoutés",
                time: "Il y a 4 heures",
                status: "info"
              },
              { 
                type: "customer",
                title: "Nouveau client inscrit",
                description: "Jean Dupont",
                time: "Il y a 6 heures",
                status: "success"
              }
            ].map((activity: any index: any) => (</div>
              <div>`</div>
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === "success" ? "bg-green-500" : 
                  activity.status === "info" ? "bg-blue-500" : "bg-gray-400"`
                }`}></div>
                <div></div>
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-sm text-gray-600">{activity.description}</div>
                  <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>);;

export const dynamic  = "force-dynamic";
`