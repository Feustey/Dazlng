import React, { useState } from 'react';
import { Gift, Copy, Check, Share2, Users, Info } from '@/components/shared/ui/IconRegistry';


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
  referrals = [],
}) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://daznode.com/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Rejoins-moi sur DazNode !',
        text: "user.useruserinscristoi_et_on_gagne"abonnement !",
        url: referralLink,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-purple-200 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Gift className="w-5 h-5 text-purple-500" />
        <span className="font-medium text-purple-700">{t('user.parrainez_vos_amis')}</span>
        <span className="relative group">
          <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition whitespace-normal z-10 min-w-[180px] max-w-xs text-center">
            Gagnez 1 mois d'abonnement par filleul ayant payé !
          </span>
        </span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 w-full">
          <span className="text-xs text-gray-500">{t('user.votre_lien_')}</span>
          <span className="font-mono bg-purple-50 px-2 py-1 rounded text-purple-700 border border-purple-200 select-all break-all overflow-x-auto max-w-[180px] sm:max-w-xs">
            {referralLink}
          </span>
          <button
            onClick={handleCopy}
            className="px-2 py-1 rounded bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs flex items-center gap-1"
            title="user.userusercopier_le_lien"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié !' : 'Copier'}
          </button>
          <button
            onClick={handleShare}
            className="px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs flex items-center gap-1"
            title="Partager"
          >
            <Share2 className="w-4 h-4" /> Partager
          </button>
        </div>
        <div className="flex flex-row md:flex-col items-center md:items-end gap-1 w-full md:w-auto justify-between">
          <div className="text-xs text-gray-500">Filleuls : <span className="font-bold text-purple-700">{referralCount}</span></div>
          <div className="text-xs text-gray-500">Mois gagnés : <span className="font-bold text-green-700">{referralCredits}</span></div>
        </div>
      </div>
      {/* Historique des filleuls */}
      {referrals.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-700 font-medium">{t('user.historique_de_vos_filleuls')}</span>
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            {referrals.map((r, i) => (
              <li key={i} className="flex items-center gap-2">
                <span>{r.email}</span>
                <span className="text-gray-400">({new Date(r.joinedAt).toLocaleDateString()})</span>
                {r.paid ? (
                  <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700">{t('user.abonnement_pay')}</span>
                ) : (
                  <span className="ml-2 px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">{t('user.en_attente')}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Gamification paliers */}
      <div className="mt-2 flex gap-2">
        <div className="text-xs text-gray-500">
          Prochain palier : <span className="font-bold">{5 - referralCount > 0 ? 5 - referralCount : 0}</span> filleuls pour 1 mois bonus !
        </div>
        {referralCount >= 5 && (
          <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs font-bold ml-2">
            🎉 Super Parrain débloqué !
          </span>
        )}
      </div>
    </div>
  );
};
export default ReferralWidget; 