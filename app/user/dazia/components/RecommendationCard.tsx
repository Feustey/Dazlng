import React, { useState } from "react";
import { motion } from "framer-motion";
import {CheckCircle2, ChevronRight, Lock} from "@/components/shared/ui/IconRegistry";

export interface RecommendationCardProps {
  recommendation: {
    id: string;
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    difficulty: "easy" | "medium" | "hard";
    priority: number;
    estimated_gain: number;
    category: "liquidity" | "connectivity" | "fees" | "security";
    action_type: "open_channel" | "close_channel" | "adjust_fees" | "rebalance" | "other";
    target_node?: {
      pubkey: string;
      alias: string;
      capacity: number;
    };
    steps: {
      order: number;
      description: string;
      command?: string;
    }[];
    free: boolean;
  };
  isPremium?: boolean;
  onComplete?: (id: string) => void;
}

export const RecommendationCard = ({
  recommendation, 
  isPremium = false, 
  onComplete
}: RecommendationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const impactColors = {
    high: "text-red-500",
    medium: "text-yellow-500",
    low: "text-green-500"
  };

  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800"
  };

  return (
    <motion.div
      className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 ${
        isHovered ? "border-blue-300 shadow-lg" : "border-gray-200"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
    >
      {/* En-tête de la carte */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500">
              Priorité {recommendation.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[recommendation.difficulty]}`}>
              {recommendation.difficulty}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {recommendation.title}
          </h3>
          <p className="text-gray-600 text-sm">
            {recommendation.description}
          </p>
        </div>
        
        {!recommendation.free && !isPremium && (
          <Lock className="w-5 h-5 text-amber-500 ml-2" />
        )}
      </div>

      {/* Métriques */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className={`flex items-center gap-1 ${impactColors[recommendation.impact]}`}>
          <span className="font-medium">Impact: {recommendation.impact}</span>
        </div>
        <div className="text-green-600">
          <span className="font-medium">+{recommendation.estimated_gain} sats/mois</span>
        </div>
      </div>

      {/* Étapes de mise en œuvre */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 pt-3 mt-3"
        >
          <h4 className="font-medium text-gray-800 mb-2">Étapes de mise en œuvre:</h4>
          <ol className="space-y-2">
            {recommendation.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {step.order}
                </span>
                <div>
                  <p className="text-gray-700">{step.description}</p>
                  {step.command && (
                    <code className="block mt-1 bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                      {step.command}
                    </code>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1"
        >
          {isExpanded ? "Réduire" : "Voir les détails"}
          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </button>

        {recommendation.free || isPremium ? (
          <button
            onClick={() => onComplete?.(recommendation.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Appliquer
          </button>
        ) : (
          <button
            disabled
            className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Premium requis
          </button>
        )}
      </div>
    </motion.div>
  );
};