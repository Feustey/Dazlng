import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { useState } from 'react';

export interface RecommendationCardProps {
  recommendation: {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  priority: number;
  estimated_gain: number;
  category: 'liquidity' | 'connectivity' | 'fees' | 'security';
  action_type: 'open_channel' | 'close_channel' | 'adjust_fees' | 'rebalance' | 'other';
  target_node?: {
  pubkey: string;
  alias: string;
  capacity: number;
  );
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
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500'
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge de priorité */}
      <div className="absolute -right-12 top-6 rotate-45 bg-yellow-500 px-12 py-1 text-xs font-semibold text-white">
        Priorité {recommendation.priority}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {recommendation.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {recommendation.description}
            </p>
          </div>
          {!recommendation.free && !isPremium && (
            <Lock className="h-5 w-5 text-gray-400" />
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${impactColors[recommendation.impact]}`}>
            Impact {recommendation.impact}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyColors[recommendation.difficulty]}`}>
            {recommendation.difficulty}
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
            +{recommendation.estimated_gain} sats
          </span>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          className="mt-4 overflow-hidden"
        >
          <div className="space-y-4">
            {recommendation.steps.map((step: any) => (
              <div key={step.order} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  {step.order}
                </div>
                <div>
                  <p className="text-sm text-gray-700">{step.description}</p>
                  {step.command && (
                    <div className="mt-1 rounded bg-gray-50 p-2 font-mono text-xs">
                      {step.command}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {isExpanded ? 'Voir moins' : 'Voir les étapes'}
            <ChevronRight
              className={`ml-1 h-4 w-4 transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          </button>

          {onComplete && (
            <button
              onClick={() => onComplete(recommendation.id)}
              className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
            >
              <CheckCircle2 className="h-4 w-4" />
              Marquer comme terminé
            </button>
          )}
        </div>
      </div>

      {/* Effet de hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
