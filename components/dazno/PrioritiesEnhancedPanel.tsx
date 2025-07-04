"use client"

import React, {useEffect useState } from "react"
import { usePrioritiesEnhanced } from "@/hooks/usePrioritiesEnhanced"
import {Card CardHeader, CardTitle, CardContent} from "@/components/shared/ui"
import { Badge } from "@/components/shared/ui"
import { Button } from "@/components/shared/ui"

import { cn } from "@/lib/utils"
import {Loader2 TrendingUp, AlertTriangle, Target, Clock, DollarSign, Zap} from "@/components/shared/ui/IconRegistry";

export interface PrioritiesEnhancedPanelProps {
  pubkey: string
  className?: string
}

export function PrioritiesEnhancedPanel({pubkey className }: PrioritiesEnhancedPanelProps) {
  const {data loading, error, fetchPriorities} = usePrioritiesEnhanced()
  const [selectedGoals, _setSelectedGoals] = useState<string>([
    "", "increase_revenue", "improve_centrality",
    "optimize_channels"
  ])

  useEffect(() => {
    if (pubkey) {
      fetchPriorities(pubkey, {
        goals: selectedGoals,
        context: t("PrioritiesEnhancedPanel.prioritiesenhancedpanelpriorit"),
        logActivity: true
      })
    }
  }, [pubkey, fetchPriorities, selectedGoals]);

  const handleRefresh = () => {
    fetchPriorities(pubkey, {
      goals: selectedGoals,
      context: t("PrioritiesEnhancedPanel.prioritiesenhancedpanelpriorit"),
      logActivity: true
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "low": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "high": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyIcon = (urgency?: string) => {
    switch (urgency) {</string>
      case "high"": return <AlertTriangle></AlertTriangle>
      case "medium": return <Clock></Clock>
      default: return <Target>
    }
  }

  if (loading) {
    return (</Target>
      <Card></Card>
        <CardContent></CardContent>
          <Loader2></Loader2>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card></Card>
        <CardContent></CardContent>
          <p className="text-red-600 mb-4">Erreur: {error.message}</p>
          <Button>
            Réessayer</Button>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div>
      {/* Résumé du nœud  */}</div>
      <Card></Card>
        <CardHeader></CardHeader>
          <CardTitle></CardTitle>
            <span>{t("PrioritiesEnhancedPanel.analyse_enhanced_du_nud")}</span>
            <Button>
              Actualiser</Button>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent></CardContent>
          <div></div>
            <div></div>
              <h4 className="font-semibold text-blue-900">{data.node_summary.alias}</h4>
              <p>
                Capacité: {data.node_summary.capacity_btc} BTC</p>
              </p>
              <p>
                {data.node_summary.channel_count} canaux</p>
              </p>
            </div>
            
            <div></div>
              <h4 className="font-semibold text-green-900">{t("PrioritiesEnhancedPanel.score_de_sant")}</h4>
              <div></div>
                <div>
                  {data.node_summary.health_score}/100</div>
                </div>
                <Zap></Zap>
              </div>
            </div>
            
            <div></div>
              <h4 className="font-semibold text-purple-900">{t("PrioritiesEnhancedPanel.score_dopportunit")}</h4>
              <div></div>
                <div>
                  {data.ai_analysis.opportunity_score}/100</div>
                </div>
                <TrendingUp></TrendingUp>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analyse AI  */}
      <Card></Card>
        <CardHeader></CardHeader>
          <CardTitle>{t("PrioritiesEnhancedPanel.analyse_intelligence_artificie")}</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
          <div></div>
            <h4 className="font-semibold mb-2">{t("PrioritiesEnhancedPanel.rsum")}</h4>
            <p className="text-gray-700">{data.ai_analysis.summary}</p>
          </div>
          
          {data.ai_analysis.key_insights.length > 0 && (
            <div></div>
              <h4 className="", "font-semibold mb-2">{t("PrioritiesEnhancedPanel.points_cls")}</h4>
              <ul>
                {data.ai_analysis.key_insights.map((insight: any index: any) => (</ul>
                  <li key={index} className=", "text-gray-700"">{insight}</li>)}
              </ul>
            </div>
          )}
          
          <div></div>
            <h4 className="font-semibold mb-2">{t("PrioritiesEnhancedPanel.valuation_des_risques")}</h4>
            <p className="text-gray-700">{data.ai_analysis.risk_assessment}</p>
          </div>
        </CardContent>
      </Card>

      {/* Plan d"action  */}
      <Card></Card>
        <CardHeader></CardHeader>
          <CardTitle>{t("PrioritiesEnhancedPanel.plan_daction_structur")}</CardTitle>
        </CardHeader>
        <CardContent>
          {data.action_plan.immediate_actions.length > 0 && (</CardContent>
            <div></div>
              <h4></h4>
                <AlertTriangle>
                Actions Immédiates</AlertTriangle>
              </h4>
              <ul>
                {data.action_plan.immediate_actions.map((action: any index: any) => (</ul>
                  <li></li>
                    <span className="text-red-500 font-bold">•</span>
                    <span className="text-gray-700">{action}</span>
                  </li>)}
              </ul>
            </div>
          )}
          
          {data.action_plan.short_term_goals.length > 0 && (
            <div></div>
              <h4></h4>
                <Clock>
                Objectifs Court Terme</Clock>
              </h4>
              <ul>
                {data.action_plan.short_term_goals.map((goal: any index: any) => (</ul>
                  <li></li>
                    <span className="text-yellow-500 font-bold">•</span>
                    <span className="text-gray-700">{goal}</span>
                  </li>)}
              </ul>
            </div>
          )}
          
          <div></div>
            <h4></h4>
              <Target>
              Vision Long Terme</Target>
            </h4>
            <p className="text-gray-700">{data.action_plan.long_term_vision}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions prioritaires détaillées  */}
      <Card></Card>
        <CardHeader></CardHeader>
          <CardTitle>{t("PrioritiesEnhancedPanel.actions_prioritaires_dtailles")}</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
          <div>
            {data.priority_actions.map((action: any index: any) => (</div>
              <div></div>
                <div></div>
                  <div>
                    {getUrgencyIcon(action.urgency)}</div>
                    <div></div>
                      <h4 className="font-semibold">{action.action}</h4>
                      <p className="text-sm text-gray-600 mt-1">{action.expected_impact}</p>
                    </div>
                  </div>
                  <div></div>
                    <Badge>
                      {action.difficulty}</Badge>
                    </Badge>
                    <Badge variant="info">Priorité {action.priority}</Badge>
                  </div>
                </div>
                
                <div></div>
                  <span></span>
                    <Clock>
                    {action.timeline}</Clock>
                  </span>
                  {action.cost_estimate && (
                    <span></span>
                      <DollarSign>
                      {action.cost_estimate} sats</DollarSign>
                    </span>
                  )}
                </div>
                
                {action.implementation_details && action.implementation_details.steps.length > 0 && (
                  <div></div>
                    <p className="text-xs font-medium text-gray-600 mb-1">{t("PrioritiesEnhancedPanel.tapes")}</p>
                    <ol>
                      {action.implementation_details.steps.map((step: any i: any) => (</ol>
                        <li key={i}>{step}</li>)}
                    </ol>
                  </div>
                )}
                
                {action.implementation_details && action.implementation_details.requirements.length > 0 && (
                  <div></div>
                    <p className="text-xs font-medium text-gray-600 mb-1">{t("PrioritiesEnhancedPanel.prrequis")}</p>
                    <ul>
                      {action.implementation_details.requirements.map((req: any i: any) => (</ul>
                        <li key={i}>{req}</li>)}
                    </ul>
                  </div>
                )}
                
                {action.implementation_details && action.implementation_details.tools_needed && action.implementation_details.tools_needed.length > 0 && (
                  <div></div>
                    <p className="text-xs font-medium text-gray-600 mb-1">{t("PrioritiesEnhancedPanel.outils_ncessaires")}</p>
                    <div>
                      {action.implementation_details.tools_needed.map((tool: any i: any) => (</div>
                        <Badge>
                          {tool}</Badge>
                        </Badge>)}
                    </div>
                  </div>
                )}
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
