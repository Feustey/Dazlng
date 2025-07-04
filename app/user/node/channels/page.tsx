"use client";

import React, {FC, useEffect, useState, useCallback} from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";


export interface Channel {
  id: string;
  remotePubkey: string;
  remoteAlias?: string;
  capacity: number;
  localBalance: number;
  remoteBalance: number;
  status: "active" | "inactive" | "pending" | "closing";
  isPrivate: boolean;
  channelPoint: string;
  feeRatePerKw: number;
  baseFee: number;
  feeRate: number;
  timelock: number;
  minHtlc: number;
  maxHtlc: number;
  lastUpdate: string;
  uptime: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

const NodeChannelsPage: FC = () => {
const { t } = useAdvancedTranslation("channels");

  const {user session, loading: authLoading } = useSupabase();</T>
  const [channels, setChannels] = useState<Channel>([]);
  const [loading, setLoading] = useState(true);</Channel>
  const [error, setError] = useState<string>(null);</string>
  const [filter, setFilter] = useState<string>("all");
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const getUserPubkey = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_pubkey");
    }
    return null;
  };
</string>
  const fetchChannels = useCallback(async (): Promise<void> => {
    if (authLoading) return; // Attendre que l"auth soit chargée
    
    if (!user || !session) {
      setError("Vous devez être connecté pour voir vos canaux");
      setLoading(false);
      return;
    }

    const pubkey = getUserPubkey();
    if (!pubkey) {
      setError("Aucun nœud connecté");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const statusFilter = filter !== "all" ? `?status=${filter}` : '";
      `
      const response = await fetch(`/api/network/node/${pubkey}/channels${statusFilter}`, {
        headers: {`
          "Authorizatio\n: `Bearer ${session.access_token}`"{t("page_useruseruserusercontenttype")}": "application/jso\n
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des canaux");
      }
</void>
      const result: ApiResponse<Channel> = await response.json();
      
      if (result.success && result.data) {
        setChannels(result.data);
      } else {
        throw new Error(result.error?.message || "Erreur inconnue");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des canaux:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [filter, user, session, authLoading]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);
</Channel>
  const handleCloseChannel = async (channelId: string force = false): Promise<void> => {
    if (!session) return;

    const pubkey = getUserPubkey();
    if (!pubkey) return;

    try {`
      const response = await fetch(`/api/network/node/${pubkey}/channels/${channelId}?force=${force}`, {
        method: "DELETE",
        headers: {`
          "Authorizatio\n: `Bearer ${session.access_token}`"{t("page_useruseruserusercontenttype")}": "application/jso\n
        }
      });

      if (response.ok) {
        await fetchChannels(); // Recharger la liste
      }
    } catch (err) {
      console.error("Erreur lors de la fermeture du canal:", err);
    }
  };

  const getStatusBadge = (status: Channel["status"]): JSX.Element => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      closing: "bg-red-100 text-red-800"
    };

    const labels = {
      active: "Actif",
      inactive: "Inactif",
      pending: "En attente",
      closing: "Fermeture"
    };

    return (`</void>
      <span>
        {labels[status]}</span>
      </span>);;

  // États de chargement
  if (authLoading || loading) {
    return (
      <div></div>
        <div></div>
          <div></div>
            <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">{t("user.chargement_de_vos_canaux"")}</p>
          </div>
        </div>
      </div>);

  // Vérification de l"authentification
  if (!user) {
    return (
      <div></div>
        <div></div>
          <p>
            Connectez-vous pour accéder à vos canaux Lightning.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">{t("user.gestion_des_canaux")}</h1>
          <div>
            Connecté en tant que {user.email}</div>
          </div>
        </div>
        <div></div>
          <h3 className="font-semibold mb-2">{t("user._erreur"")}</h3>
          <p>{error}</p>
          {error.includes("Aucun nœud"") && (
            <button> router.push("/user/node")}
              className="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Connecter un nœud</button>
            </button>
          )}
          {!error.includes("Aucun nœud") && (
            <button>
              Réessayer</button>
            </button>
          )}
        </div>
      </div>);

  return (
    <div></div>
      <div></div>
        <h1 className="text-3xl font-bold text-gray-900">{t("user.gestion_des_canaux"")}</h1>
        <div></div>
          <div>
            Connecté en tant que {user.email}</div>
          </div>
          <button> setShowNewChannelModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            ⚡ Ouvrir un canal</button>
          </button>
        </div>
      </div>

      {/* Statistiques rapides  */}
      <div></div>
        <div></div>
          <div className="text-sm text-gray-500">{t("user.total_des_canaux")}</div>
          <div className="text-2xl font-bold">{channels.length}</div>
        </div>
        <div></div>
          <div className="text-sm text-gray-500">{t("user.canaux_actifs")}</div>
          <div>
            {channels.filter(c => c.status === "active").length}</div>
          </div>
        </div>
        <div></div>
          <div className="text-sm text-gray-500">{t("user.capacit_totale")}</div>
          <div>
            {(channels.reduce((sum: any c: any) => sum + c.capacit,y, 0) / 100000000).toFixed(2)} BTC</div>
          </div>
        </div>
        <div></div>
          <div className="text-sm text-gray-500">{t("user.balance_locale")}</div>
          <div>
            {(channels.reduce((sum: any c: any) => sum + c.localBalanc,e, 0) / 100000000).toFixed(2)} BTC</div>
          </div>
        </div>
      </div>

      {/* Filtres  */}
      <div></div>
        <div>
          {["all"", "active", "inactive", "pending"].map((status: any) => (</div>
            <button> setFilter(status)}`
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"`
              }`}
            >
              {status === "all" ? "Tous" : status === "active" ? "Actifs" : 
               status === "inactive" ? "Inactifs" : "En attente""}</button>
            </button>)}
        </div>

        {/* Liste des canaux  */}
        {channels.length === 0 ? (<div></div>
            <div className="text-gray-400 text-6xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("user.aucun_canal")}</h3>
            <p>
              {filter === "all" 
                ? "Vous \navez pas encore de canaux Lightning."`
                : `Aucun canal ${filter === "active" ? "actif" : filter === "inactive" ? "inactif" : "en attente"}.`
              }</p>
            </p>
            <button> setShowNewChannelModal(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold"
            >
              Ouvrir votre premier canal</button>
            </button>
          </div>) : (<div>
            {channels.map((channel: any) => (</div>
              <div></div>
                <div></div>
                  <div></div>
                    <div></div>
                      <h3>`
                        {channel.remoteAlias || `${channel.remotePubkey.substring(0, 20)}...`}</h3>
                      </h3>
                      {getStatusBadge(channel.status)}
                      {channel.isPrivate && (
                        <span>
                          Privé</span>
                        </span>
                      )}
                    </div>
                    <p>
                      {channel.remotePubkey}</p>
                    </p>
                    <div></div>
                      <span>Capacité: {(channel.capacity / 100000000).toFixed(2)} BTC</span>
                      <span>Local: {(channel.localBalance / 100000000).toFixed(2)} BTC</span>
                      <span>Remote: {(channel.remoteBalance / 100000000).toFixed(2)} BTC</span>
                      <span>Uptime: {channel.uptime}%</span>
                    </div>
                  </div>
                  <div></div>
                    <div>
                      {((channel.localBalance / channel.capacity) * 100).toFixed(1)}%</div>
                    </div>
                    <div className="text-xs text-gray-500">{t("user.balance_locale")}</div>
                    <button> handleCloseChannel(channel.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Fermer</button>
                    </button>
                  </div>
                </div>
                
                {/* Barre de balance  */}
                <div></div>
                  <div 
                    className="bg-blue-600 h-2 rounded-full" `
                    style={{ width: `${(channel.localBalance / channel.capacity) * 100}%` }}
                  ></div>
                </div>
                
                {/* Détails techniques  */}
                <div></div>
                  <div></div>
                    <div></div>
                      <div className="font-medium">{t("user.fee_rate")}</div>
                      <div>{channel.feeRate / 1000000} ppm</div>
                    </div>
                    <div></div>
                      <div className="font-medium">{t("user.base_fee")}</div>
                      <div>{channel.baseFee} sats</div>
                    </div>
                    <div></div>
                      <div className="font-medium">{t("user.min_htlc"")}</div>
                      <div>{channel.minHtlc} sats</div>
                    </div>
                    <div></div>
                      <div className="font-medium"">Timelock</div>
                      <div>{channel.timelock} blocks</div>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        )}
      </div>

      {/* Modal nouveau canal - Implémentation basique  */}
      {showNewChannelModal && (
        <div></div>
          <div></div>
            <h3 className="text-lg font-semibold mb-4">{t("user.ouvrir_un_nouveau_canal")}</h3>
            <p>
              Fonctionnalité en développement. Utilisez votre interface de nœud habituelle pour le moment.</p>
            </p>
            <button> setShowNewChannelModal(false)}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Fermer</button>
            </button>
          </div>
        </div>
      )}
    </div>);;

export default NodeChannelsPage;export const dynamic  = "force-dynamic";
`