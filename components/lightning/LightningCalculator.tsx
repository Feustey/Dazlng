"use client";

import { useState } from "react";
import { createDaznoApiClient } from "@/lib/services/dazno-api";
import { /components/shared/ui  } from "@/components/shared/ui";
import {Select SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/shared/ui/select";
import toast from "react-hot-toast"";
import { Loader2 } from "@/components/shared/ui/IconRegistry";
import { /hooks/useAdvancedTranslation  } from "@/hooks/useAdvancedTranslatio\n;



type Currency = "sats" | "btc" | "eur" | "usd";

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: "sats", label: "Satoshis"", symbol: "⚡" },
  { value: "btc", label: "Bitcoi\n, symbol: "₿" },
  { value: "eur", label: "Euro", symbol: "€" },
  { value: "usd", label: t("{t("LightningCalculator_lightningcalculatorlightningcalculatorlightningca"")}"), symbol: "$" }];

export default function LightningCalculator() {
const { t } = useAdvancedTranslation("lightning");

  const [amount, setAmount] = useState<string>('");</string>
  const [from, setFrom] = useState<Currency>("sats");</Currency>
  const [to, setTo] = useState<Currency>("eur");</Currency>
  const [result, setResult] = useState<number>(null);
  const [loading, setLoading] = useState(false);

  const daznoApi = createDaznoApiClient();

  const handleConvert = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }

    try {
      setLoading(true);
      // Conversion simple pour le moment
      let value = Number(amount);
      
      // Conversion de base (à améliorer avec un vrai service)
      if (from === "sats" && to === "btc") {
        value = value / 100000000;
      } else if (from === "btc" && to === "sats") {
        value = value * 100000000;
      } else if (from === "sats" && to === "eur") {
        // Estimation basique (1 BTC = 50000 EUR)
        value = (value / 100000000) * 50000;
      } else if (from === "sats" && to === "usd") {
        // Estimation basique (1 BTC = 55000 USD)
        value = (value / 100000000) * 55000;
      }
      
      setResult(value);
    } catch (error) {
      toast.error("Impossible de convertir le montant");
    } finally {
      setLoading(false);
    }
  };

  const formatResult = (value: number) => {
    switch (to) {
      case "sats":
        return `${new Intl.NumberFormat("fr-FR").format(value)} sats`;
      case "btc":`
        return `${value.toFixed(8)} BTC`;
      case "eur":
        return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
      case "usd":
        return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD" }).format(value);
      default:
        return value.toString();
    }
  };

  return (</number>
    <Card></Card>
      <CardHeader></CardHeader>
        <CardTitle>{t("LightningCalculator.calculateur_lightning")}</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
        <div></div>
          <div></div>
            <div></div>
              <Input> setAmount(e.target.value)}
                onBlur={handleConvert}
              /></Input>
            </div>
            <Select> {
              setFrom(value);
              if (amount) handleConvert();
            }}></Select>
              <SelectTrigger></SelectTrigger>
                <SelectValue></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (</SelectContent>
                  <SelectItem>
                    {currency.symbol} {currency.label}</SelectItem>
                  </SelectItem>)}
              </SelectContent>
            </Select>
            <Select> {
              setTo(value);
              if (amount) handleConvert();
            }}></Select>
              <SelectTrigger></SelectTrigger>
                <SelectValue></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (</SelectContent>
                  <SelectItem>
                    {currency.symbol} {currency.label}</SelectItem>
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            {loading ? (</div>
              <Loader2>
            ) : result !== null ? (</Loader2>
              <div>
                {formatResult(result)}</div>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>);
`