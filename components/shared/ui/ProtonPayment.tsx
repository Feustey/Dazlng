import { useState } from 'react';

export interface ProtonPaymentProps {
  sats: number; // Montant en sats
  promoApplied?: boolean;
  onSuccess?: (txId: string) => void;
  onCancel?: () => void;
}

const BTC_ADDRESS = 'bc1qnap8sadc650h3a2w9s6z3chen3fzxftqnlr26h';

export default function ProtonPayment({ sats: _sats, promoApplied, onSuccess, onCancel }: ProtonPaymentProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);

  // Prix BTC de base pour DazBox (0.004 BTC)
  const basePriceBTC = 0.004;
  const baseDiscountedBTC = basePriceBTC * 0.9; // -10% de réduction
  const btcAmount = promoApplied ? baseDiscountedBTC.toFixed(8) : basePriceBTC.toFixed(8);

  // Simule l'envoi d'un email Proton Wallet (à remplacer par l'intégration réelle Proton API)
  const handlePay = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Ici, il faudrait appeler l'API Proton Wallet pour envoyer le paiement BTC
      // Par exemple :
      // await protonApi.sendPayment({
      //   to: email,
      //   amount: btcAmount,
      //   currency: 'BTC',
      //   memo: BTC_ADDRESS
      // });
      // Pour la démo, on simule une réussite :
      setTimeout(() => {
        setSuccess(true);
        setTxId('demo-txid-123456');
        if (onSuccess) onSuccess('demo-txid-123456');
        setIsLoading(false);
      }, 2000);
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'Erreur lors du paiement Proton Wallet');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-white rounded-xl shadow text-center">
        <h2 className="text-2xl font-bold mb-2 text-green-600">Paiement envoyé !</h2>
        <p className="mb-2">Votre paiement Proton Wallet a bien été envoyé.</p>
        <div className="text-xs text-gray-500 break-all mb-2">Transaction ID : {txId}</div>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={onCancel}>Fermer</button>
      </div>
};
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Payer par Proton Wallet</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Votre email Proton Wallet</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="votre@email.proton.me"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="mb-4">
        <div className="flex justify-between">
          <span>Montant à envoyer :</span>
          <span className="font-mono">{btcAmount} BTC</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Adresse BTC destinataire :</span>
          <span className="font-mono">{BTC_ADDRESS}</span>
        </div>
      </div>
      {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}
      <button
        className="w-full px-4 py-2 bg-purple-600 text-white rounded font-bold disabled:opacity-50"
        onClick={handlePay}
        disabled={!email || isLoading}
      >
        {isLoading ? 'Paiement en cours...' : 'Envoyer le paiement Proton Wallet'}
      </button>
      {onCancel && (
        <button className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded" onClick={onCancel} disabled={isLoading}>
          Annuler
        </button>
      )}
    </div>
};
}
