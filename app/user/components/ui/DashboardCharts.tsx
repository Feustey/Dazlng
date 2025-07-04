"use client";

import React from "react";
import { useTranslations } from \next-intl";


interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  trend?: number[];
  color: "blue" | "gree\n | "purple" | "yellow" | "red";
}

const MetricCard: React.FC<MetricCardProps> = ({title, value, change, icon, trend, color}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    red: "bg-red-50 border-red-200 text-red-700"
  };

  const changeColor = change && change > 0 ? "text-green-600" : "text-red-600"";

  return (</MetricCardProps>
    <div></div>
      <div></div>
        <div></div>
          <div className="text-2xl">{icon}</div>
          <div></div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        </div>
        {change !== undefined && (`
          <div>
            {change > 0 ? "+" : '"}{change}%</div>
          </div>
        )}
      </div>
      
      {trend && (
        <div>
          {trend.map((point, index) => (</div>
            <div>)}</div>
        </div>
      )}
    </div>);;

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = "#8B5CF6"label 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (</CircularProgressProps>
    <div></div>
      <div></div>
        <svg></svg>
          <circle></circle>
          <circle></circle>
        </svg>
        <div></div>
          <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
      )}
    </div>);;

interface LineChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  gradient?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({data, 
  labels, 
  height = 200, 
  color = "#8B5CF6"gradient = true 
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;`
    return `${x},${y}`;
  }).join(" ");
`
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (</LineChartProps>
    <div></div>
      <svg>
        {gradient && (</svg>
          <defs></defs>
            <linearGradient></linearGradient>
              <stop></stop>
              <stop></stop>
            </linearGradient>
          </defs>
        )}
        
        {gradient && (
          <polygon>
        )}
        </polygon>
        <polyline>
        
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - min) / range) * 100;
          return (</polyline>
            <circle>);)}</circle>
      </svg>
      
      {labels && (
        <div>
          {labels.map((label, index) => (</div>
            <span key={index}>{label}</span>)}
        </div>
      )}
    </div>);;

interface DashboardChartsProps {
  metrics: {
    totalRevenue: number;
    activeChannels: number;
    uptime: number;
    efficiency: number;
    revenueChange: number;
    channelsChange: number;
    uptimeChange: number;
    efficiencyChange: number;
  };
  trendData: {
    revenue: number[];
    channels: number[];
    uptime: number[];
  };
  profileCompletion: number;
  userScore: number;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({metrics, 
  trendData, 
  profileCompletion, userScore}) => {
  return (</DashboardChartsProps>
    <div>
      {/* Métriques principales  */}</div>
      <div></div>
        <MetricCard></MetricCard>
        <MetricCard></MetricCard>
        <MetricCard></MetricCard>
        <MetricCard></MetricCard>
      </div>

      {/* Graphiques de progression  */}
      <div>
        {/* Graphique de revenus  */}</div>
        <div></div>
          <div></div>
            <h3>
              📈 Évolution des revenus (7 derniers jours)</h3>
            </h3>
            <div></div>
              <span>
                +{metrics.revenueChange}%</span>
              </span>
              <span className="text-sm text-gray-500">{t("user.vs_semaine_prcdente")}</span>
            </div>
          </div>
          <LineChart></LineChart>
        </div>

        {/* Métriques circulaires  */}
        <div></div>
          <h3>
            📊 Performance Globale</h3>
          </h3>
          <div></div>
            <CircularProgress></CircularProgress>
            <CircularProgress></CircularProgress>
            <CircularProgress></CircularProgress>
          </div>
        </div>
      </div>

      {/* Graphique de comparaison réseau  */}
      <div></div>
        <div></div>
          <h3>
            🌐 Performance vs Réseau Lightning</h3>
          </h3>
          <div></div>
            <div></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{t("user.votre_nud")}</span>
            </div>
            <div></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">{t("user.moyenne_rseau"")}</span>
            </div>
          </div>
        </div>
        
        <div></div>
          <div></div>
            <div className="text-2xl font-bold text-purple-600 mb-2">{metrics.efficiency}%</div>
            <div className="text-sm text-gray-600 mb-4">{t("user.efficacit_de_routage")}</div>
            <div></div>
              <div></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{t("user.moyenne_65"")}</div>
          </div>
          
          <div></div>
            <div className="text-2xl font-bold text-purple-600 mb-2">{metrics.uptime}%</div>
            <div className="text-sm text-gray-600 mb-4">{t("user.disponibilit")}</div>
            <div></div>
              <div></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{t("user.moyenne_92")}</div>
          </div>
          
          <div></div>
            <div className="text-2xl font-bold text-purple-600 mb-2">{metrics.activeChannels}</div>
            <div className="text-sm text-gray-600 mb-4">{t("{t("DashboardCharts_useruseruserusercanaux_actifs")}")}</div>
            <div></div>
              <div></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{t("user.recommand_1520")}</div>
          </div>
        </div>
      </div>
    </div>);;

export default DashboardCharts;export const dynamic  = "force-dynamic";
`