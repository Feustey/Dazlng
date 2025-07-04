import React, { useState } from "react";
import {Gift, Copy, Check, Share2, Users, Info} from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

interface ReferralWidgetProps {
  referralCode: string;
  referralCount: number;
  referralCredits: number;
  referrals?: { email: string; joinedAt: string; paid: boolean }[];
}

export const ReferralWidget: React.FC<ReferralWidgetProps> = ({
  referralCode,
  referralCount,
  referralCredits,
  referrals = []
}) => {
  const { t } = useAdvancedTranslation();
  const [copied, setCopied] = useState(false);
  const referralLink = `https://daznode.com?ref=${referralCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Rejoins-moi sur DazNode !",
        text: "Inscris-toi et on gagne un abo gratuit !",
        url: referralLink
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <Gift className="w-6 h-6 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-800">{t("user.programme_de_parrainage")}</h3>
      </div>

      <div className="space-y-4">
        {/* Code de parrainage */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">{t("user.votre_code_de_parrainage")}</p>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono flex-1">
              {referralLink}
            </code>
            <button
              onClick={handleCopy}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{referralCount}</div>
            <div className="text-sm text-gray-600">{t("user.filleuls_actifs")}</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{referralCredits}</div>
            <div className="text-sm text-gray-600">{t("user.crdits_gagns")}</div>
          </div>
        </div>

        {/* Historique des filleuls */}
        {referrals && referrals.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-700 font-medium">{t("user.historique_de_vos_filleuls")}</span>
            </div>
            <ul className="space-y-2">
              {referrals.map((r, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span>{r.email}</span>
                  <span className="text-gray-400">({new Date(r.joinedAt).toLocaleDateString()})</span>
                  {r.paid ? (
                    <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700">{t("user.abonnement_pay")}</span>
                  ) : (
                    <span className="ml-2 px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">{t("user.en_attente")}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Message de motivation */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <span className="font-bold">{5 - referralCount > 0 ? 5 - referralCount : 0}</span> filleuls pour 1 mois bonus !
            </div>
          </div>
          {referralCount >= 5 && (
            <div className="mt-2 text-sm text-green-800 font-semibold">
              🎉 Super Parrain débloqué !
            </div>
          )}
        </div>
      </div>
    </div>
  );
};