'use client';

import { useState } from 'react';
import { createDaznoApiClient } from '@/lib/services/dazno-api';
import { Card, CardContent, CardHeader, CardTitle, Input } from '@/components/shared/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

type Currency = 'sats' | 'btc' | 'eur' | 'usd';

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: 'sats', label: 'Satoshis', symbol: '⚡' },
  { value: 'btc', label: 'Bitcoin', symbol: '₿' },
  { value: 'eur', label: 'Euro', symbol: '€' },
  { value: 'usd', label: 'Dollar US', symbol: '$' },
];

export default function LightningCalculator() {
  const [amount, setAmount] = useState<string>('');
  const [from, setFrom] = useState<Currency>('sats');
  const [to, setTo] = useState<Currency>('eur');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const daznoApi = createDaznoApiClient();

  const handleConvert = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    try {
      setLoading(true);
      // Conversion simple pour le moment
      let value = Number(amount);
      
      // Conversion de base (à améliorer avec un vrai service)
      if (from === 'sats' && to === 'btc') {
        value = value / 100000000;
      } else if (from === 'btc' && to === 'sats') {
        value = value * 100000000;
      } else if (from === 'sats' && to === 'eur') {
        // Estimation basique (1 BTC = 50000 EUR)
        value = (value / 100000000) * 50000;
      } else if (from === 'sats' && to === 'usd') {
        // Estimation basique (1 BTC = 55000 USD)
        value = (value / 100000000) * 55000;
      }
      
      setResult(value);
    } catch (error) {
      toast.error('Impossible de convertir le montant');
    } finally {
      setLoading(false);
    }
  };

  const formatResult = (value: number) => {
    switch (to) {
      case 'sats':
        return `${new Intl.NumberFormat('fr-FR').format(value)} sats`;
      case 'btc':
        return `${value.toFixed(8)} BTC`;
      case 'eur':
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
      case 'usd':
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value);
      default:
        return value.toString();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calculateur Lightning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Montant"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onBlur={handleConvert}
              />
            </div>
            <Select value={from} onValueChange={(value: Currency) => {
              setFrom(value);
              if (amount) handleConvert();
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="De..." />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.symbol} {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={to} onValueChange={(value: Currency) => {
              setTo(value);
              if (amount) handleConvert();
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Vers..." />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.symbol} {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-center py-4">
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            ) : result !== null ? (
              <div className="text-2xl font-bold">
                {formatResult(result)}
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
