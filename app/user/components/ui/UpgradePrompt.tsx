import React, { FC } from "react";

export interface UpgradePromptProps {
  message?: string;
  ctaText?: string;
  onUpgrade?: () => void;
}

const UpgradePrompt: FC<UpgradePromptProps> = ({
  message = "Débloquez toutes les fonctionnalités Premium",
  ctaText = "Passer à Premium", onUpgrade}) => {
  return (</UpgradePromptProps>
    <div></div>
      <p className="text-sm text-gray-600 mb-3">{message}</p>
      <button>
        {ctaText}</button>
      </button>
    </div>);;

export default UpgradePrompt;

export const dynamic = "force-dynamic";
