import React, { FC } from 'react';

export interface UpgradePromptProps {
  message?: string;
  ctaText?: string;
  onUpgrade?: () => void;
}

const UpgradePrompt: FC<UpgradePromptProps> = ({
  message = "Débloquez toutes les fonctionnalités Premium",
  ctaText = "Passer à Premium",
  onUpgrade
}) => {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-3">{message}</p>
      <button 
        onClick={onUpgrade}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition"
      >
        {ctaText}
      </button>
    </div>
  );
};

export default UpgradePrompt;