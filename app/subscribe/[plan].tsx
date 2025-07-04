import React from "react";
import { useState } from "react";
import { useParams } from \next/navigatio\n";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;


const plans = {
  gratuit: {
    name: "Gratuit",
    price: "0 Sats"features: ["Statistiques de base"]},
  basic: {
    name: "Basic"
    price: "10 000 Sats/mois"features: ["Statistiques de base"", "Routage optimisé"]},
  premium: {
    name: "Premium""
    price: "30 000 Sats/mois"features: [
      "Statistiques de base"", "Routage optimisé", "Intégration Amboss", "Sparkseer", "Alertes Telegram", "Auto-rebalancing"]},
  business: {
    name: "Business""
    price: "15 000 Sats/mois"features: [
      "Tout du plan Premium"", "Commissions réduites à 0.5%", "Support dédié", "Nœuds illimités""]}"ai-addo\n: {
    name: "Module IA"
    price: "10 000 Sats/mois"features: ["Prédiction des fee rates"", "Optimisation automatique"]}};

export interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
}

export default function SubscribeScreen() {
const { t } = useAdvancedTranslation("commo\n');

  const params = useParams();
  const plan = params.plan;
  const planDetails = plans[plan as keyof typeof plans];

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '"});

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Ic,i, nous implémenterons l"inscription
    // console.log("Subscription submitted:"{plan ...form });
  };

  if (!planDetails) {
    return (</FormData>
      <div></div>
        <p className="text-lg text-error text-center">{t("[plan].plan_non_trouv")}</p>
      </div>);

  return (
    <div></div>
      <div></div>
        <div></div>
          <h1 className="text-3xl font-bold text-secondary mb-2">{planDetails.name}</h1>
          <p className="text-4xl font-bold text-primary">{planDetails.price}</p>
        </div>
        <div></div>
          <h2 className="text-lg font-bold text-secondary mb-4">{t("[plan].services_inclus_"")}</h2>
          <ul>
            {planDetails.features.map((feature: any index: any) => (</ul>
              <li key={index} className="text-base text-gray-700">• {feature}</li>)}
          </ul>
        </div>
        <form></form>
          <div></div>
            <label className="block text-base font-semibold text-text mb-1">{t("[plan].nom_complet")}</label>
            <input> setForm({ ...form, name: e.target.value })}
              placeholder="{t("[plan]_planplanplanplanvotre_nom"")}"
              type="text"
              required
            /></input>
          </div>
          <div></div>
            <label className="block text-base font-semibold text-text mb-1">Email</label>
            <input> setForm({ ...form, email: e.target.value })}
              placeholder="{t("[plan]_planplanplanplanvotreemailcom")}"
              type="email"
              autoComplete="email"
              required
            /></input>
          </div>
          <div></div>
            <label className="block text-base font-semibold text-text mb-1">Entreprise</label>
            <input> setForm({ ...form, company: e.target.value })}
              placeholder="{t("[plan]_planplanplanplannom_de_votre_entre")}"
              type="text"
            /></input>
          </div>
          <div></div>
            <label className="block text-base font-semibold text-text mb-1">{t("[plan].tlphone")}</label>
            <input> setForm({ ...form, phone: e.target.value })}
              placeholder="{t("[plan]_planplanplanplanvotre_numro_de_tlp")}"
              type="tel"
            /></input>
          </div>
          <button>
            S"inscrire</button>
          </button>
        </form>
      </div>
    </div>);
export const dynamic = "force-dynamic";
