"use client";
import React, { useState } from "react";

const options = [
  { value: "proposer-noeud", label: "Me proposer un noeud" },
  { value: "fermer-canal", label: "Fermer un mauvais canal" },
  { value: "verifier-fees", label: "Vérifier ma politique de fees" },
  { value: "faire-swap", label: "Faire un swap" },
];

export default function DaziaPreviewPage() {
  const [selected, setSelected] = useState(options[0].value);
  const [pubkey, setPubkey] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmail, setShowEmail] = useState(false);
  const [prospectEmail, setProspectEmail] = useState("");
  const [prospectSuccess, setProspectSuccess] = useState(false);
  const [prospectError, setProspectError] = useState<string | null>(null);

  React.useEffect(() => {
    setPubkey("PUBKEY_SIGNATURE_FAKE");
  }, []);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setShowEmail(false);
    setProspectSuccess(false);
    setProspectError(null);
    try {
      const subject = "Demande DazIA (RAG)";
      const choixLabel = options.find(o => o.value === selected)?.label;
      const body = `Bonjour,\n\nJe souhaite : ${choixLabel}\nEmail : ${email}\nPubkey : ${pubkey}\n\nMerci !`;
      const html = `<p>Bonjour,</p><p><b>Demande DazIA (RAG)</b> :</p><ul><li>Action : ${choixLabel}</li><li>Email : <code>${email}</code></li><li>Pubkey : <code>${pubkey}</code></li></ul><p>Merci !</p>`;
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "contact@dazno.de",
          subject,
          text: body,
          html,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setShowEmail(true);
      } else {
        setError("Erreur lors de l'envoi. Merci de réessayer.");
      }
    } catch (e) {
      setError("Erreur lors de l'envoi. Merci de réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleProspect = async () => {
    setProspectError(null);
    setProspectSuccess(false);
    try {
      const res = await fetch("/api/prospect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: prospectEmail,
          pubkey,
          choix: selected,
          source: "dazia-preview",
        }),
      });
      if (res.ok) {
        setProspectSuccess(true);
      } else {
        setProspectError("Erreur lors de l'enregistrement. Merci de réessayer.");
      }
    } catch (e) {
      setProspectError("Erreur lors de l'enregistrement. Merci de réessayer.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, textAlign: 'center', background: 'linear-gradient(90deg,#5d5dfc,#ff6bcb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DazIA - Preview</h1>
      <p style={{ marginBottom: 18, fontSize: 17, color: '#5d5dfc', fontWeight: 600 }}>
        🚀 Découvrez la puissance de l'IA DazIA avec notre technologie RAG (Retrieval Augmented Generation) !<br />
        <span style={{ color: '#222', fontWeight: 400 }}>
          Profitez d'une intelligence artificielle connectée à vos données Lightning, capable de vous assister sur mesure : gestion de noeud, optimisation de vos fees, analyse de canaux, et bien plus. <b>Disponible en abonnement pour booster votre expérience Lightning !</b>
        </span>
      </p>
      <p style={{ marginBottom: 24, color: '#888' }}>
        Choisissez une action à demander à l'IA :
      </p>
      {/* Affichage du formulaire uniquement si la demande n'a pas encore été envoyée */}
      {!success && (
        <>
          <div style={{ marginBottom: 18 }}>
            <select
              value={selected}
              onChange={e => setSelected(e.target.value)}
              style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #ddd", fontSize: 16 }}
            >
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 24 }}>
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #ddd", fontSize: 16 }}
            />
          </div>
          <input type="hidden" value={pubkey} readOnly />
          <button
            onClick={handleSend}
            disabled={loading || !email}
            style={{
              width: "100%",
              background: loading || !email ? "#ccc" : "#5d5dfc",
              color: "#fff",
              fontWeight: 600,
              fontSize: 18,
              padding: 12,
              border: "none",
              borderRadius: 6,
              cursor: loading || !email ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Envoi en cours..." : "Envoyer ma demande"}
          </button>
        </>
      )}
      {success && (
        <div style={{ color: '#5d5dfc', marginTop: 24, fontWeight: 500, fontSize: 18, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
          Merci pour votre demande&nbsp;!<br />
          <span style={{ color: '#222', fontWeight: 400, fontSize: 16 }}>
            Notre équipe vous répondra très bientôt par email.<br /><br />
            Retrouvez-nous sur notre canal Telegram&nbsp;:<br />
            <a href="https://t.me/+_tiT3od1q_Q0MjI0" target="_blank" rel="noopener noreferrer" style={{ color: '#229ED9', textDecoration: 'underline', fontWeight: 600, display: 'inline-block', marginTop: 12 }}>
              @https://t.me/+_tiT3od1q_Q0MjI0
            </a>
            <br /><br />Merci de votre confiance et à très vite&nbsp;!
          </span>
        </div>
      )}
      {error && (
        <div style={{ color: '#e11d48', marginTop: 18, fontWeight: 500 }}>
          {error}
        </div>
      )}
    </div>
  );
} 