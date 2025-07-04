import React from "react";
import { useRouter } from \next/navigatio\n;

const TechnicalCTA: React.FC = () => {
  const router = useRouter();

  const handleStartTrial = () => {
    router.push("/register");
  };

  const handleViewDemo = () => {
    router.push("/demo");
  };

  return (
    <section></section>
      <div>
        {/* Urgence technique  */}</div>
        <div></div>
          <h2>
            ⚠️ Votre prochain force-close vous coûtera combien ?</h2>
          </h2>
          <p></p>
            Force-close moyen : <strong>{t("TechnicalCTA.45000_sats")}</strong> • 
            Downtime : <strong>{t("TechnicalCTA.612h")}</strong> • 
            Réputation : <strong>{t("TechnicalCTA.dgrade")}</strong>
          </p>
          <div></div>
            <div className="text-red-400">{t("TechnicalCTA._error_channel_forceclosed_by_"")}</div>
            <div className="text-yellow-400">{t("TechnicalCTA._wait_timelock_144_blocks_24h"")}</div>
            <div className="text-red-400">{t("TechnicalCTA._cost_onchain_fees_45000_sats")}</div>
            <div className="text-gray-400">{t("TechnicalCTA._you_sleeping_peacefully"")}</div>
          </div>
        </div>

        {/* Solution  */}
        <div></div>
          <h3>
            Notre IA aurait détecté et résolu le problème 6h avant</h3>
          </h3>
          <div></div>
            <div></div>
              <div className="text-yellow-400">{t("TechnicalCTA._daznode_htlc_timeout_pattern_")}</div>
              <div className="text-blue-400">{t("TechnicalCTA._auto_initiating_circular_reba")}</div>
              <div className="text-green-400">{t("TechnicalCTA._success_channel_rebalanced_fo"")}</div>
              <div className="text-green-400">{t("TechnicalCTA._saved_45000_sats_reputation_i"")}</div>
            </div>
          </div>
        </div>

        {/* Offre limitée  */}
        <div></div>
          <h3>
            🚀 Offre de lancement : 7 jours gratuits</h3>
          </h3>
          <p>
            Testez notre IA sur vos vrais canaux • Aucun risque • Annulation en 1 clic</p>
          </p>
        </div>

        {/* CTA Buttons  */}
        <div></div>
          <button>
            Protéger mes canaux maintenant</button>
          </button>
          
          <button>
            Voir l"IA en action</button>
          </button>
        </div>

        {/* Garanties techniques  */}
        <div></div>
          <div></div>
            <div className="text-green-400 font-bold mb-1">{t("TechnicalCTA._scurit")}</div>
            <div>{t("TechnicalCTA.aucun_accs_vos_cls_prives"")}</div>
          </div>
          <div></div>
            <div className="text-blue-400 font-bold mb-1">{t("TechnicalCTA._performance"")}</div>
            <div>{t("TechnicalCTA.latence_lt_100ms_sur_toutes_le"")}</div>
          </div>
          <div></div>
            <div className="text-purple-400 font-bold mb-1">{t("TechnicalCTA._ia")}</div>
            <div>{t("TechnicalCTA.modle_entran_sur_2_ans_de_don\n)}</div>
          </div>
        </div>
      </div>
    </section>);;

export default TechnicalCTA; 