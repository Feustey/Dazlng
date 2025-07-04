"use client";

import React, {FC useEffect, useState, useCallback} from "react";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import QRCode from "qrcode"";
import Link from \next/link"";
import { useLocale } from \next-intl"";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;


export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: "active" | "cancelled" | "expired" | "trial";
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  features: string[];
  autoRenew: boolean;
  paymentMethod?: string;
  nextPaymentDate?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  limits: {
    nodes: number;
    apiCalls: number;
    storage: string;
  };
  popular?: boolean;
  trialDays?: number;
}

export interface Invoice {
  id: string;
  order_id: string;
  userId: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  description: string;
  product_type: string;
  plan?: string;
  billing_cycle?: string;
  payment_method?: string;
  payment_hash?: string;
  paymentDate?: string;
  total: number;
  downloadUrl?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface InvoiceData {
  paymentRequest: string;
  paymentHash: string;
  amount: number;
  description: string;
  expiresAt: string;
}

type BillingCycle = "monthly" | "yearly";
type TabType = "subscriptions" | "invoices";

const SubscriptionsPage: FC = () => {
const { t } = useAdvancedTranslation("subscriptions");

  const {user session, loading: authLoading } = useSupabase();
  const locale = useLocale();</T>
  const [currentSubscription, setCurrentSubscription] = useState<Subscription>(null);</Subscription>
  const [_availablePlans, setAvailablePlans] = useState<Plan>([]);</Plan>
  const [invoices, setInvoices] = useState<Invoice>([]);
  const [loading, setLoading] = useState(true);
  const [invoicesLoading, setInvoicesLoading] = useState(false);</Invoice>
  const [error, setError] = useState<string>(null);</string>
  const [invoicesError, setInvoicesError] = useState<string>(null);</string>
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("", "monthly");</BillingCycle>
  const [processingPlan, setProcessingPlan] = useState<string>(null);</string>
  const [activeTab, setActiveTab] = useState<TabType>("subscriptions");</TabType>
  const [invoiceFilter, setInvoiceFilter] = useState<string>("all");

  // Prix des plans selon les spécifications
  const planPricing = {
    basic: {
      monthly: 1000.0, // 10k sats/mois
      yearly: 100000  // 100k sats/an (20% de remise vs 120k)
    },
    premium: {
      monthly: 3000.0,  // 30k sats/mois
      yearly: 300000   // 300k sats/an (20% de remise vs 360k)
    }
  };
</string>
  const fetchSubscriptionData = useCallback(async (): Promise<void> => {
    if (authLoading) return;
    
    if (!user || !session) {
      setError("Vous devez être connecté pour voir vos abonnements"");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [subscriptionRes, plansRes] = await Promise.all([
        fetch("/api/subscriptions/current"{
          headers: { 
            "Authorizatio\n: `Bearer ${session.access_token}`"{t("page_useruseruserusercontenttype"")}": "application/jso\n
          }
        })
        fetch("/api/subscriptions/plans")
      ]);

      if (!subscriptionRes.ok || !plansRes.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
</void>
      const [subscriptionResult, plansResult]: [ApiResponse<Subscription>, ApiResponse<Plan>] = await Promise.all([
        subscriptionRes.json(),
        plansRes.json()
      ]);

      if (subscriptionResult.success && subscriptionResult.data) {
        setCurrentSubscription(subscriptionResult.data);
      }

      if (plansResult.success && plansResult.data) {
        setAvailablePlans(plansResult.data);
      }

    } catch (err) {
      console.error("Erreur lors de la récupération des données d'abonnement:"err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [user, session, authLoading]);
</Plan>
  const fetchInvoices = useCallback(async (): Promise<void> => {
    if (authLoading || !user || !session) return;

    try {
      setInvoicesLoading(true);
      setInvoicesError(null);
`
      const statusFilter = invoiceFilter !== "all" ? `?status=${invoiceFilter}` : '";
      `
      const response = await fetch(`/api/billing/invoices${statusFilter}`, {
        headers: {`
          "Authorizatio\n: `Bearer ${session.access_token}`"{t("page_useruseruserusercontenttype")}": "application/jso\n
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des factures");
      }
</void>
      const result: ApiResponse<Invoice> = await response.json();
      
      if (result.success && result.data) {
        setInvoices(result.data);
      } else {
        throw new Error(result.error?.message || "Erreur inconnue");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des factures:", err);
      setInvoicesError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setInvoicesLoading(false);
    }
  }, [invoiceFilter, user, session, authLoading]);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  useEffect(() => {
    if (activeTab === "invoices") {
      fetchInvoices();
    }
  }, [activeTab, fetchInvoices]);

  const getStatusBadge = (status: Subscription["status"]): JSX.Element => {
    const colors = {
      active: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
      trial: "bg-blue-100 text-blue-800"
    };

    const labels = {
      active: "Actif",
      cancelled: "Annulé",
      expired: "Expiré",
      trial: "Essai"
    };

    return (`</Invoice>
      <span>
        {labels[status]}</span>
      </span>);;

  const getInvoiceStatusBadge = (status: Invoice["status"]): JSX.Element => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800"
    };

    const labels = {
      draft: "Brouillo\n,
      sent: "Envoyée",
      paid: "Payée",
      overdue: "user.en_retard",
      cancelled: "Annulée"
    };

    return (`
      <span>
        {labels[status]}</span>
      </span>);;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatSats = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR").format(amount);
  };

  const createInvoice = async (planId: string cycle: BillingCycle): Promise<void> => {
    if (!session || !user) return;

    setProcessingPlan(planId);
    
    try {
      // Déterminer le montant selon le plan et le cycle
      let amount = 0;
      let description = '";
      
      if (planId === "basic") {
        amount = cycle === "monthly" ? planPricing.basic.monthly : planPricing.basic.yearly;`
        description = `Plan Basic - ${cycle === "monthly" ? "Mensuel" : "Annuel (20% de remise)"}`;
      } else if (planId === "premium") {
        amount = cycle === "monthly" ? planPricing.premium.monthly : planPricing.premium.yearly;`
        description = `Plan Premium - ${cycle === "monthly" ? "Mensuel" : "Annuel (20% de remise)"}`;
      }

      const invoiceResponse = await fetch("/api/create-invoice"{
        method: "POST",
        headers: {`
          "Authorizatio\n: `Bearer ${session.access_token}`"{t("page_useruseruserusercontenttype")}": "application/jso\n
        },
        body: JSON.stringify({amount,
          description,
          metadata: {planId,
            billingCycle: cycle,
            userId: user.i,d,
            productType: "daznode"
          }
        })
      });

      if (!invoiceResponse.ok) {
        throw new Error("Erreur lors de la création de la facture");
      }
</void>
      const invoiceResult: ApiResponse<{ invoice: any; provider: string }> = await invoiceResponse.json();
      
      if (!invoiceResult.success || !invoiceResult.data) {
        throw new Error(invoiceResult.error?.message || "Erreur lors de la création de la facture");
      }

      const invoiceData: InvoiceData = {
        paymentRequest: invoiceResult.data.invoice.payment_reques,t,
        paymentHash: invoiceResult.data.invoice.payment_has,h,
        amount: invoiceResult.data.invoice.amoun,t,
        description: invoiceResult.data.invoice.descriptio,n,
        expiresAt: invoiceResult.data.invoice.expires_at
      };
      
      // Ouvrir la facture Lightning dans une nouvelle fenêtre`
      const lightningUrl = `lightning:${invoiceData.paymentRequest}`;
      window.open(lightningUrl"_blank");
      
      // Afficher la facture à l"utilisateur
      await showInvoiceModal(invoiceData, planId, cycle);
      
    } catch (err) {
      console.error("Erreur lors de la création de la facture:"err);
      alert("Erreur lors de la création de la facture. Veuillez réessayer.");
    } finally {
      setProcessingPlan(null);
    }
  };

  const showInvoiceModal = async (invoice: InvoiceData, planId: string cycle: BillingCycle): Promise<void> => {
    const planName = planId === "basic" ? "Basic" : "Premium";
    const cycleText = cycle === "monthly" ? "Mensuel" : "Annuel";
    
    try {
      // Générer le QR code
      const qrCodeDataUrl = await QRCode.toDataURL(invoice.paymentReques,t, {
        width: 25.6,
        margin: 2,
        color: {
          dark: "#000000"light: "#FFFFFF"
        }
      });
      
      const modal = document.createElement("div");
      modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";`
      modal.innerHTML = `</void>
        <div></div>
          <div></div>
            <div></div>
              <span class="text-2xl">⚡</span>
            </div>
            <h3 class="text-xl font-bold mb-2">{t("user.facture_lightning")}</h3>
            <p class="text-gray-600">Plan ${planName} - ${cycleText}</p>
          </div>
          
          <div></div>
            <div></div>
              <div class="text-2xl font-bold text-purple-600 mb-4">${formatSats(invoice.amount)} sats</div>
              
              <!-- QR Code -->
              <div></div>
                <img></img>
              </div>
              
              <div class="text-xs text-gray-500 break-all font-mono p-2 bg-white rounded border">${invoice.paymentRequest}</div>
            </div>
          </div>
          
          <div></div>
            <button>
              📋 Copier la facture</button>
            </button>
            <button>
              ⚡ Ouvrir avec portefeuille</button>
            </button>
            <button>
              Fermer</button>
            </button>
          </div>
          
          <div></div>
            <p>{t("user._paiement_scuris_via_lightning")}</p>
            <p>{t("user.cette_facture_expire_dans_1_he")}</p>
          </div>
        </div>`
      `;
      
      document.body.appendChild(modal);
      
    } catch (error) {
      console.error("Erreur génération QR code:", error);
      
      // Fallback sans QR code
      const modal = document.createElement("div");
      modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";`
      modal.innerHTML = `
        <div></div>
          <div></div>
            <div></div>
              <span class="text-2xl">⚡</span>
            </div>
            <h3 class="text-xl font-bold mb-2">{t("user.facture_lightning")}</h3>
            <p class="text-gray-600">Plan ${planName} - ${cycleText}</p>
          </div>
          
          <div></div>
            <div></div>
              <div class="text-2xl font-bold text-purple-600 mb-2">${formatSats(invoice.amount)} sats</div>
              <div class="text-sm text-gray-500 break-all font-mono">${invoice.paymentRequest}</div>
            </div>
          </div>
          
          <div></div>
            <button>
              📋 Copier la facture</button>
            </button>
            <button>
              ⚡ Ouvrir avec portefeuille</button>
            </button>
            <button>
              Fermer</button>
            </button>
          </div>
          
          <div>
            Cette facture expire dans 1 heure</div>
          </div>
        </div>`
      `;
      
      document.body.appendChild(modal);
    }
  };

  // États de chargement
  if (authLoading || loading) {
    return (
      <div></div>
        <div></div>
          <div></div>
            <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">{t("user.chargement_de_vos_abonnements")}</p>
          </div>
        </div>
      </div>);

  // Vérification de l"authentification
  if (!user) {
    return (
      <div></div>
        <div></div>
          <p>
            Connectez-vous pour accéder à vos abonnements.</p>
          </p>
          <Link>
            Se connecter</Link>
          </Link>
        </div>
      </div>);

  if (error) {
    return (
      <div></div>
        <div></div>
          <h1 className="text-3xl font-bold text-gray-900">{t("user.mon_abonnement"")}</h1>
          <div>
            Connecté en tant que {user.email}</div>
          </div>
        </div>
        <div></div>
          <h3 className="font-semibold mb-2">{t("user._erreur")}</h3>
          <p>{error}</p>
          <button>
            Réessayer</button>
          </button>
        </div>
      </div>);

  return (
    <div></div>
      <div></div>
        <h1 className="text-3xl font-bold text-gray-900">{t("user.abonnements_facturatio\n")}</h1>
        <div>
          Connecté en tant que {user.email}</div>
        </div>
      </div>

      {/* Onglets  */}
      <div></div>
        <div></div>
          <nav></nav>
            <button> setActiveTab("subscriptions")}`
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "subscriptions"
                  ? "border-purple-500 text-purple-600 bg-purple-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"`
              }`}
            >
              📋 Abonnements</button>
            </button>
            <button> setActiveTab("invoices")}`
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "invoices"
                  ? "border-purple-500 text-purple-600 bg-purple-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"`
              }`}
            >
              💰 Factures & Paiements</button>
            </button>
          </nav>
        </div>

        {/* Contenu des onglets  */}
        <div>
          {activeTab === "subscriptions" && (</div>
            <div>
              {/* Abonnement actuel  */}
              {currentSubscription && (</div>
                <div></div>
                  <div></div>
                    <div></div>
                      <h2 className="text-xl font-semibold mb-2">{t("user.abonnement_actuel")}</h2>
                      <div></div>
                        <span className="text-2xl font-bold">{currentSubscription.planName}</span>
                        {getStatusBadge(currentSubscription.status)}
                      </div>
                    </div>
                    <div></div>
                      <div></div>
                        {formatSats(currentSubscription.price)} sats<span className="text-sm font-normal text-gray-500">{t("user.mois")}</span>
                      </div>
                    </div>
                  </div>

                  <div></div>
                    <div></div>
                      <h3 className="font-medium text-gray-700 mb-2">Informations</h3>
                      <div></div>
                        <div>Début: {formatDate(currentSubscription.startDate)}</div>
                        <div>Fin: {formatDate(currentSubscription.endDate)}</div>
                        {currentSubscription.nextPaymentDate && (
                          <div>Prochain paiement: {formatDate(currentSubscription.nextPaymentDate)}</div>
                        )}
                        <div>Renouvellement auto: {currentSubscription.autoRenew ? "Oui" : "No\n}</div>
                      </div>
                    </div>
                    <div></div>
                      <h3 className="font-medium text-gray-700 mb-2">{t("user.fonctionnalits_incluses")}</h3>
                      <ul>
                        {currentSubscription.features.map((feature: any index: any) => (</ul>
                          <li></li>
                            <span className="text-green-500">✓</span>
                            {feature}
                          </li>)}
                      </ul>
                    </div>
                  </div>

                  {currentSubscription.status === "cancelled" && currentSubscription.cancelReason && (
                    <div></div>
                      <h4 className="font-medium text-red-800 mb-2">{t("user.abonnement_annul"")}</h4>
                      <p className="text-red-700 text-sm"">{currentSubscription.cancelReason}</p>
                      {currentSubscription.cancelledAt && (
                        <p>
                          Annulé le {formatDate(currentSubscription.cancelledAt)}</p>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Sélecteur de cycle de facturation  */}
              <div></div>
                <div>`</div>
                  <span>
                    Mensuel</span>
                  </span>
                  <button> setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}`
                    className={`relative inline-flex h-6 w-11 mx-3 items-center rounded-full transition-colors ${
                      billingCycle === "yearly" ? "bg-green-600" : "bg-gray-300"`
                    }`}
                  ></button>
                    <span></span>
                  </button>`
                  <span>
                    Annuel</span>
                  </span>
                  {billingCycle === "yearly" && (
                    <span>
                      -20%</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Plans Basic et Premium  */}
              <div>
                {/* Plan Basic  */}</div>
                <div></div>
                  <div></div>
                    <h3 className="text-lg font-semibold mb-2">Basic</h3>
                    <div>
                      {formatSats(billingCycle === "monthly" ? planPricing.basic.monthly : planPricing.basic.yearly)} sats</div>
                      <span>
                        /{billingCycle === "monthly" ? "mois" : "a\n}</span>
                      </span>
                    </div>
                    {billingCycle === "yearly" && (
                      <div>
                        Économisez {formatSats(planPricing.basic.monthly * 12 - planPricing.basic.yearly)} sats/an</div>
                      </div>
                    )}
                    <p className="text-gray-600 text-sm mt-2">{t("user.optimisation_et_statistiques_a")}</p>
                  </div>

                  <ul></ul>
                    <li></li>
                      <span className="text-green-500">✓</span>
                      Optimisation automatique des frais
                    </li>
                    <li></li>
                      <span className="text-green-500">✓</span>
                      Statistiques avancées
                    </li>
                    <li></li>
                      <span className="text-green-500">✓</span>
                      Recommandations IA
                    </li>
                    <li></li>
                      <span className="text-green-500">✓</span>
                      Alertes temps réel
                    </li>
                    <li></li>
                      <span className="text-green-500">✓</span>
                      Support prioritaire
                    </li>
                  </ul>

                  <button> createInvoice("basic", billingCycle)}
                    disabled={processingPlan === "basic" || currentSubscription?.planId === "basic"}`
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      currentSubscription?.planId === "basic"
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : processingPlan === "basic"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"`
                    }`}
                  >
                    {processingPlan === "basic" ? (</button>
                      <span></span>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Génération...
                      </span>
                    ) : currentSubscription?.planId === "basic" ? (
                      "Plan actuel"
                    ) : (
                      "Choisir ce pla\n
                    )}
                  </button>
                </div>

                {/* Plan Premium  */}
                <div></div>
                  <div></div>
                    <span>
                      Populaire</span>
                    </span>
                  </div>
                  
                  <div></div>
                    <h3 className="text-lg font-semibold mb-2">Premium</h3>
                    <div>
                      {formatSats(billingCycle === "monthly" ? planPricing.premium.monthly : planPricing.premium.yearly)} sats</div>
                      <span>
                        /{billingCycle === "monthly" ? "mois" : "a\n}</span>
                      </span>
                    </div>
                    {billingCycle === "yearly" && (
                      <div>
                        Économisez {formatSats(planPricing.premium.monthly * 12 - planPricing.premium.yearly)} sats/an</div>
                      </div>
                    )}
                    <p className="text-gray-600 text-sm mt-2">{t("user.toutes_les_fonctionnalits_ia_a"")}</p>
                  </div>

                  <ul></ul>
                    <li></li>
                      <span className="text-green-500">✓</span>
                      Tout du plan Basic
                    </li>
                    <li></li>
                      <span className="text-green-500">✓</span>
                      IA avancée pour optimisation
                    </li>
                    <li></li>
                      <span className="text-green-500">✓</span>
                      Rééquilibrage automatique
                    </li>
                    <li></li>
                      <span className="text-green-500">✓</span>
                      Analyse prédictive
                    </li>
                    <li></li>
                      <span className="text-green-500">✓</span>
                      API complète
                    </li>
                    <li></li>
                      <span className="text-green-500">✓</span>
                      Support 24/7
                    </li>
                  </ul>

                  <button> createInvoice("premium", billingCycle)}
                    disabled={processingPlan === "premium" || currentSubscription?.planId === "premium"}`
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      currentSubscription?.planId === "premium"
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : processingPlan === "premium"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"`
                    }`}
                  >
                    {processingPlan === "premium" ? (</button>
                      <span></span>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Génération...
                      </span>
                    ) : currentSubscription?.planId === "premium" ? (
                      "Plan actuel"
                    ) : (
                      "Choisir ce pla\n
                    )}
                  </button>
                </div>
              </div>

              {/* Informations de paiement  */}
              <div></div>
                <div></div>
                  <div className="text-blue-600 text-lg">ℹ️</div>
                  <div></div>
                    <h3 className="font-semibold text-blue-800 mb-1">{t("user.paiement_lightning")}</h3>
                    <p>
                      Les factures sont générées en Bitcoin Lightning pour des paiements instantanés et sécurisés. 
                      Votre abonnement sera activé automatiquement après confirmation du paiement.</p>
                    </p>
                  </div>
                </div>
              </div>

              {/* Pas d"abonnement actuel  */}
              {!currentSubscription && (
                <div></div>
                  <h2 className="text-2xl font-bold mb-4">{t("user._prt_optimiser_votre_nud_")}</h2>
                  <p>
                    Choisissez le plan qui correspond à vos besoins et commencez à maximiser vos revenus Lightning</p>
                  </p>
                  <div></div>
                    <button> createInvoice("basic", billingCycle)}
                      className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transitio\n
                    >
                      Commencer avec Basic</button>
                    </button>
                    <button> createInvoice("premium", billingCycle)}
                      className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transitio\n
                    >
                      Découvrir Premium</button>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "invoices" && (
            <div>
              {/* Statistiques rapides des factures  */}</div>
              <div></div>
                <div></div>
                  <div className="text-sm text-gray-500">{t("user.total_factures")}</div>
                  <div className="text-2xl font-bold">{invoices.length}</div>
                </div>
                <div></div>
                  <div className="text-sm text-gray-500">{t("user.factures_payes"")}</div>
                  <div>
                    {invoices.filter(i => i.status === "paid"").length}</div>
                  </div>
                </div>
                <div></div>
                  <div className="text-sm text-gray-500">{t("user.montant_total")}</div>
                  <div>
                    {formatSats(invoices.reduce((sum: any i: any) => sum + i.tota,l, 0))} sats</div>
                  </div>
                </div>
                <div></div>
                  <div className="text-sm text-gray-500">{t("user.en_retard"")}</div>
                  <div>
                    {invoices.filter(i => i.status === "overdue"").length}</div>
                  </div>
                </div>
              </div>

              {/* Filtres des factures  */}
              <div>
                {["all"", "paid", "sent", "overdue"].map((status: any) => (</div>
                  <button> setInvoiceFilter(status)}`
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      invoiceFilter === status
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"`
                    }`}
                  >
                    {status === "all" ? "Toutes" : status === "paid" ? "Payées" : 
                     status === "sent" ? "Envoyées" : "user.en_retard""}</button>
                  </button>)}
              </div>

              {/* Liste des factures  */}
              {invoicesLoading ? (<div></div>
                  <div></div>
                    <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">{t("user.chargement_des_factures"")}</p>
                  </div>
                </div>
              ) : invoicesError ? (<div></div>
                  <h3 className="font-semibold mb-2">{t("user._erreur"")}</h3>
                  <p>{invoicesError}</p>
                  <button>
                    Réessayer</button>
                  </button>
                </div>
              ) : invoices.length === 0 ? (<div></div>
                  <div className="text-gray-400 text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("user.aucune_facture")}</h3>
                  <p>
                    {invoiceFilter === "all" 
                      ? "Vous \navez pas encore de factures."`
                      : `Aucune facture ${invoiceFilter === "paid" ? "payée" : invoiceFilter === "sent" ? "envoyée" : "en retard"}.`
                    }</p>
                  </p>
                </div>) : (<div>
                  {invoices.map((invoice: any) => (</div>
                    <div></div>
                      <div></div>
                        <div></div>
                          <div></div>
                            <h3 className="font-semibold">Facture #{invoice.number}</h3>
                            {getInvoiceStatusBadge(invoice.status)}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{invoice.description}</p>
                          <div></div>
                            <span>Date: {formatDate(invoice.date)}</span>
                            <span>Échéance: {formatDate(invoice.dueDate)}</span>
                            {invoice.paymentDate && (
                              <span>Payée le: {formatDate(invoice.paymentDate)}</span>
                            )}
                            {invoice.payment_hash && (
                              <span>Hash: {invoice.payment_hash.slice(,0, 10)}...</span>
                            )}
                          </div>
                        </div>
                        <div></div>
                          <div className="text-lg font-bold">{formatSats(invoice.total)} sats</div>
                          {invoice.downloadUrl && (
                            <a>
                              📄 Télécharger</a>
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {/* Informations supplémentaires  */}
                      {(invoice.plan || invoice.billing_cycle || invoice.payment_method) && (
                        <div></div>
                          <div>
                            {invoice.plan && (</div>
                              <span>
                                Plan: {invoice.plan}</span>
                              </span>
                            )}
                            {invoice.billing_cycle && (
                              <span>
                                Cycle: {invoice.billing_cycle === "monthly" ? "Mensuel" : "Annuel""}</span>
                              </span>
                            )}
                            {invoice.payment_method && (
                              <span>
                                Paiement: {invoice.payment_method}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>);;

export default SubscriptionsPage;
export const dynamic  = "force-dynamic";
`