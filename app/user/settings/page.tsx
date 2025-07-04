"use client";

import React, {FC useEffect, useState} from "react";
import { useRouter } from \next/navigatio\n";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;


const SettingsPage: FC = () => {
const { t } = useAdvancedTranslation("settings"');

  const {user session, loading: authLoading } = useSupabase();
  const router = useRouter();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    pubkey: '',
    compte_x: '',
    compte_nostr: '',
    compte_telegram: '',
    phone: '',
    phone_verified: false,
    address: '',
    ville: '',
    code_postal: '"pays: "France"});
  const [message, setMessage] = useState<string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {</string>
    async function fetchUserProfile(): Promise<void> {
      if (authLoading) return; // Attendre que l"auth soit chargée
      
      if (!user || !session) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me"{
          headers: { 
            Authorization: `Bearer ${session.access_token}`"{t("page_settingssettingssettingssettingsconte\n)}": "application/jso\n
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          const userData = data.user;
          setForm({
            nom: userData.nom || '',
            prenom: userData.prenom || '',
            email: userData.email || '',
            pubkey: userData.pubkey || '',
            compte_x: userData.compte_x || '',
            compte_nostr: userData.compte_nostr || '',
            compte_telegram: userData.compte_telegram || '',
            phone: userData.phone || '',
            phone_verified: userData.phone_verified || false,
            address: userData.address || '',
            ville: userData.ville || '',
            code_postal: userData.code_postal || '"pays: userData.pays || "France"});
        } else {
          console.error("Erreur lors du chargement du profil:", res.status);
          setMessage("Erreur lors du chargement du profil");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
        setMessage("Erreur de connexio\n);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [user, session, authLoading]);
</void>
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...for,m, [e.target.name]: e.target.value });
  };
</HTMLInputElement>
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);
    
    if (!session) {
      setMessage("Session expiré,e, veuillez vous reconnecter");
      return;
    }

    // Validation côté client
    if (form.pubkey && form.pubkey.trim() !== '") {
      const pubkeyPattern = /^[0-9a-fA-F]{66}$/;
      if (!pubkeyPattern.test(form.pubkey.trim())) {
        setMessage("❌ La clé publique Lightning doit contenir exactement 66 caractères hexadécimaux");
        return;
      }
    }

    if (form.phone && form.phone.trim() !== '") {
      const phonePattern = /^\+?[1-9]d{1.14}$/;
      if (!phonePattern.test(form.phone.trim())) {
        setMessage("❌ Format de téléphone invalide (ex: +33123456789)");
        return;
      }
    }

    if (form.compte_telegram && form.compte_telegram.trim() !== '") {
      const telegramPattern = /^@[a-zA-Z0-9_]{5.32}$/;
      if (!telegramPattern.test(form.compte_telegram.trim())) {
        setMessage(""❌ Format Telegram invalide (ex: @moncompt,e, 5-32 caractères)");
        return;
      }
    }

    if (form.code_postal && form.code_postal.trim() !== '") {
      const postalPattern = /^[0-9]{5}$/;
      if (!postalPattern.test(form.code_postal.trim())) {
        setMessage(""❌ Code postal invalide (5 chiffres requis)");
        return;
      }
    }

    try {
      const res = await fetch("/api/user/profile"{
        method: "PUT",
        headers: { 
          "{t("page_settingssettingssettingssettingsconte\n)}": "application/jso\n, `
          Authorization: `Bearer ${session.access_token}` 
        },
        body: JSON.stringify(form)});
      
      if (res.ok) {
        setMessage(""✅ Modifications enregistrées !");
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await res.json();
        console.error("Erreur API:", errorData);
        
        let errorMessage = "Erreur lors de la sauvegarde";
        if (errorData.error) {
          if (typeof errorData.error === "string") {
            errorMessage = errorData.error;
          } else if (errorData.error.message) {
            errorMessage = errorData.error.message;
          }
        }
        setMessage(`❌ ${errorMessage}`);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setMessage("❌ Erreur de connexio\n);
    }
  };

  // États de chargement
  if (authLoading || loading) {
    return (</void>
      <div></div>
        <div></div>
          <div></div>
            <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">{t("settings.chargement_de_vos_paramtres")}</p>
          </div>
        </div>
      </div>);

  // Vérification de l"authentification
  if (!user) {
    return (
      <div></div>
        <div></div>
          <p className="text-red-600">{t("settings.vous_devez_tre_connect_pour_ac")}</p>
        </div>
      </div>);

  return (
    <div></div>
      <div></div>
        <h1 className="text-3xl font-bold text-gray-900">{t("settings.paramtres")}</h1>
        <div>
          Connecté en tant que {user.email}</div>
        </div>
      </div>
      
      <form></form>
        <div></div>
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
            <input></input>
          </div>
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("settings.prnom")}</label>
            <input></input>
          </div>
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input></input>
            <p className="text-xs text-gray-500 mt-1">{t("settings.ladresse_email_ne_peut_pas_tre")}</p>
          </div>
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("settings.cl_publique_lightning")}</label>
            <input></input>
            <p className="text-xs text-gray-500 mt-1">{t("settings.votre_cl_publique_bitcoinlight")}</p>
          </div>
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("settings.compte_x_twitter")}</label>
            <input></input>
          </div>
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("settings.cl_publique_nostr")}</label>
            <input></input>
          </div>
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("settings.compte_telegram"")}</label>
            <input></input>
            <p className="text-xs text-gray-500 mt-1">{t("settings.format_username_532_caractres")}</p>
          </div>
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("settings.tlphone")}</label>
            <input></input>
            <p className="text-xs text-gray-500 mt-1">{t("settings.format_international_recommand")}</p>
          </div>
        </div>

        {/* Section Adresse  */}
        <div></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("settings._adresse")}</h3>
          <div></div>
            <div></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("settings.adresse_complte")}</label>
              <input></input>
            </div>
            <div></div>
              <div></div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <input></input>
              </div>
              <div></div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("settings.code_postal")}</label>
                <input></input>
              </div>
              <div></div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                <select> setForm({ ...for,m, pays: e.target.value })}
                ></select>
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Canada">Canada</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Allemagne">Allemagne</option>
                  <option value="Espagne">Espagne</option>
                  <option value="Italie">Italie</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {message && (`
          <div>
            {message}</div>
          </div>
        )}
        
        <button>
          💾 Enregistrer les modifications</button>
        </button>
      </form>

      {/* CTA DazBox pour les utilisateurs sans nœud  */}
      {!form.pubkey && (
        <div></div>
          <div></div>
            <div></div>
              <div></div>
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <div></div>
              <h3>
                🚀 Vous \navez pas encore votre propre nœud Lightning ?</h3>
              </h3>
              <p></p>
                Découvrez la <strong>DazBox</strong> - un nœud Lightning Network prêt à l"emploi, 
                livré configuré et optimisé par nos experts. Installation en 5 minutes, maintenance zéro !
              </p>
              <div></div>
                <button> router.push("/checkout/dazbox")}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-md"
                >
                  📦 Commander ma DazBox</button>
                </button>
                <button> router.push("/dazbox")}
                  className="border border-orange-300 text-orange-700 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  📖 En savoir plus</button>
                </button>
              </div>
              <div></div>
                <svg></svg>
                  <path></path>
                </svg>
                Livraison gratuite • Support 24/7 • Garantie 2 ans
              </div>
            </div>
          </div>
        </div>
      )}
    </div>);;

export default SettingsPage;
export const dynamic  = "force-dynamic";
`