import { react } from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;


export interface ProtonPaymentProps {
  sats: number; // Montant en sats
  promoApplied?: boolean;
  onSuccess?: (txId: string) => void;
  onCancel?: () => void;
}

const BTC_ADDRESS = "", "bc1qnap8sadc650h3a2w9s6z3chen3fzxftqnlr26h";

export default function ProtonPayment({ sats: _sat,s, promoApplied, onSuccess, onCancel}: ProtonPaymentProps): JSX.Element {
const { t } = useAdvancedTranslation("lightning"');

  const [email, setEmail] = useState('");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>(null);
  const [success, setSuccess] = useState(false);</string>
  const [txId, setTxId] = useState<string>(null);

  // Prix BTC de base pour DazBox (0.004 BTC)
  const basePriceBTC = 0.004;
  const baseDiscountedBTC = basePriceBTC * 0.9; // -10% de réduction
  const btcAmount = promoApplied ? baseDiscountedBTC.toFixed(8) : basePriceBTC.toFixed(8);

  // Simule l"envoi d"un email Proton Wallet (à remplacer par l"intégration réelle Proton API)</string>
  const handlePay = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Ici, il faudrait appeler l"API Proton Wallet pour envoyer le paiement BTC
      // Par exemple :
      // await protonApi.sendPayment({
      //   to: email
      //   amount: btcAmount
      //   currency: "BTC"
      //   memo: BTC_ADDRESS
      // });
      // Pour la démo, on simule une réussite :
      setTimeout(() => {
        setSuccess(true);
        setTxId("", "demo-txid-123456");
        if (onSuccess) onSuccess("demo-txid-123456");
        setIsLoading(false);
      }, 2000);
    } catch (e) {
      const err = e as Error;
      setError(err.message || "Erreur lors du paiement Proton Wallet"");
      setIsLoading(false);
    }
  };

  if (success) {
    return (</void>
      <div></div>
        <h2 className="text-2xl font-bold mb-2 text-green-600">{t("ProtonPayment.paiement_envoy_")}</h2>
        <p className="mb-2">{t("ProtonPayment.votre_paiement_proton_wallet_a"")}</p>
        <div className="text-xs text-gray-500 break-all mb-2"">Transaction ID : {txId}</div>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={onCancel}>Fermer</button>
      </div>);

  return (
    <div></div>
      <h2 className="text-xl font-bold mb-4">{t("ProtonPayment.payer_par_proton_wallet")}</h2>
      <div></div>
        <label className="block mb-1 font-medium">{t("ProtonPayment.votre_email_proton_wallet")}</label>
        <input> setEmail(e.target.value)}
          disabled={isLoading}
        /></input>
      </div>
      <div></div>
        <div></div>
          <span>{t("ProtonPayment.montant_envoyer_"")}</span>
          <span className="font-mono"">{btcAmount} BTC</span>
        </div>
        <div></div>
          <span>{t("ProtonPayment.adresse_btc_destinataire_"")}</span>
          <span className="font-mono">{BTC_ADDRESS}</span>
        </div>
      </div>
      {error && <div className=", "mb-2 text-red-600 text-sm"">{error}</div>}
      <button>
        {isLoading ? "Paiement en cours..." : "Envoyer le paiement Proton Wallet"}</button>
      </button>
      {onCancel && (
        <button>
          Annuler</button>
        </button>
      )}
    </div>);
