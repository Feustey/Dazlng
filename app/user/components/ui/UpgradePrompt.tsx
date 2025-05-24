import React, { FC } from 'react';

interface RecommendationCardProps {
  recommendation: {
    id: string | number;
    title: string;
    description?: string;
    isFree?: boolean;
  };
  onApply?: () => void;
  onUpgrade?: () => void;
  isPremium?: boolean;
}

const RecommendationCard: FC<RecommendationCardProps> = ({ 
  recommendation, 
  onApply, 
  onUpgrade, 
  isPremium = false 
}) => {
  return (
    <div className={`border rounded-xl p-4 ${isPremium ? 'opacity-60' : ''} hover:shadow-md transition`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-sm">{recommendation.title}</h4>
            {recommendation.isFree ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Gratuit
              </span>
            ) : (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                ★ Premium
              </span>
            )}
          </div>
          
          {recommendation.description && (
            <p className="text-gray-600 text-sm mb-3">{recommendation.description}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {recommendation.isFree && onApply ? (
          <button 
            onClick={onApply}
            className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            Appliquer
          </button>
        ) : isPremium && onUpgrade ? (
          <button 
            onClick={onUpgrade}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-orange-600 transition"
          >
            Débloquer Premium
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default RecommendationCard;