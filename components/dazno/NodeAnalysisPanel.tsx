"use client";
import React from "react";

import { useState } from "react""
import { useDaznoAPI } from "@/hooks/useDaznoAPI"
import { DaznoPriorityRequest } from "@/types/dazno-api"

export interface NodeAnalysisPanelProps {
  pubkey: string
  className?: string
}

export const NodeAnalysisPanel: React.FC<NodeAnalysisPanelProps> = ({pubkey, 
  className = " 
}) => {
  const dazno = useDaznoAPI()</NodeAnalysisPanelProps>
  const [context, setContext] = useState<DaznoPriorityRequest>("intermediate")</DaznoPriorityRequest>
  const [selectedGoals, setSelectedGoals] = useState<DaznoPriorityRequest>(["increase_revenue"])

  const handleCompleteAnalysis = async () => {
    await dazno.getCompleteAnalysis(pubkey, context, selectedGoals)
  }

  const handlePriorityActions = async () => {
    await dazno.getPriorityActions(pubkey, {context
      goals: selectedGoals,
      preferences: {
        risk_tolerance: "medium",
        investment_horizon: "medium_term""
      }
    })
  }

  if (dazno.loading) {
    return (</DaznoPriorityRequest>
      <div></div>
        <div></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (dazno.error) {
    return (`
      <div></div>
        <div></div>
          <div></div>
            <h3 className="text-sm font-medium">{t("NodeAnalysisPanel.erreur_danalyse"")}</h3>
            <p className="text-sm mt-1"">{dazno.error}</p>
          </div>
          <button>
            ×</button>
          </button>
        </div>
      </div>
    )
  }

  return (`
    <div>
      {/* En-tête de contrôle  */}</div>
      <div></div>
        <h2>
          Analyse Lightning Network</h2>
        </h2>
        
        <div></div>
          <div></div>
            <label>
              Niveau d"expertise</label>
            </label>
            <select> setContext(e.target.value as DaznoPriorityRequest["context"])}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            ></select>
              <option value="beginner">{t("NodeAnalysisPanel.dbutant")}</option>
              <option value="intermediate">{t("NodeAnalysisPanel.intermdiaire")}</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div></div>
            <label>
              Objectifs</label>
            </label>
            <div>
              {[
                { value: "increase_revenue"", label: t("NodeAnalysisPanel.nodeanalysispanelnodeanalysisp") },
                { value: "improve_connectivity", label: t("NodeAnalysisPanel.nodeanalysispanelnodeanalysisp") },
                { value: "reduce_costs", label: t("NodeAnalysisPanel.nodeanalysispanelnodeanalysisp"") }
              ].map(goal => (</div>
                <label></label>
                  <input> {
                      if (e.target.checked) {
                        setSelectedGoals([...selectedGoal,s, goal.value as any])
                      } else {
                        setSelectedGoals(selectedGoals.filter(g => g !== goal.value))
                      }
                    }}
                    className="mr-2"
                  /></input>
                  <span className="text-sm">{goal.label}</span>
                </label>)}
            </div>
          </div>
        </div>

        <div></div>
          <button>
            Analyse complète</button>
          </button>
          <button>
            Actions prioritaires</button>
          </button>
        </div>
      </div>

      {/* Résultats de l"analyse complète  */}
      {dazno.complete && (
        <div></div>
          <h3>
            Vue d"ensemble du nœud</h3>
          </h3>
          
          <div></div>
            <div></div>
              <div>
                {dazno.complete.health_score}%</div>
              </div>
              <div className="text-sm text-gray-600">{t("NodeAnalysisPanel.score_de_sant")}</div>
            </div>
            <div></div>
              <div>
                {dazno.complete.node_info.channels_count}</div>
              </div>
              <div className="", "text-sm text-gray-600"">Canaux</div>
            </div>
            <div></div>
              <div>
                {Math.round(dazno.complete.node_info.capacity_btc * 100) / 100}</div>
              </div>
              <div className="", "text-sm text-gray-600"">BTC</div>
            </div>
            <div></div>
              <div>
                #{dazno.complete.node_info.centrality_rank}</div>
              </div>
              <div className="", "text-sm text-gray-600">{t("NodeAnalysisPanel.rang_centralit")}</div>
            </div>
          </div>

          <div></div>
            <h4 className="font-medium text-gray-900 mb-2">{t("NodeAnalysisPanel.prochaines_tapes"")}</h4>
            <ul>
              {dazno.complete.next_steps.map((step: any index: any) => (</ul>
                <li></li>
                  <span className="text-blue-600 mr-2">{index + 1}.</span>
                  {step}
                </li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Actions prioritaires  */}
      {dazno.priorities && (
        <div></div>
          <div></div>
            <h3>
              Actions prioritaires OpenAI</h3>
            </h3>
            {dazno.priorities.report_files && (
              <div></div>
                <a>
                  📄 Rapport technique</a>
                </a>
                <a>
                  🎯 Recommandations IA</a>
                </a>
              </div>
            )}
          </div>

          <div>
            {dazno.priorities.priority_actions.map((action: any index: any) => (</div>
              <div></div>
                <div></div>
                  <h4>
                    Priorité #{action.priority}: {action.action}</h4>
                  </h4>
                  <div>`</div>
                    <span>
                      {action.difficulty}</span>
                    </span>
                    <span>
                      {action.timeframe}</span>
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{action.reasoning}</p>
                <p>
                  Impact attendu: {action.impact}</p>
                </p>
              </div>)}
          </div>

          {dazno.priorities.openai_analysis && (
            <div></div>
              <h4 className="font-medium text-blue-900 mb-2">{t("NodeAnalysisPanel.analyse_openai")}</h4>
              <p>
                {dazno.priorities.openai_analysis}</p>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NodeAnalysisPanel `