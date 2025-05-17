"use client";
import React, { useState, useRef } from "react";
import Link from 'next/link';

function generateMessage() {
  // Génère un message unique à signer (ex: préfixe + hash ou timestamp)
  return "Dazia-" + Math.random().toString(36).substring(2, 15);
}

export default function DaziaPage() {
  const [showSignature, setShowSignature] = useState(false);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const copyRef = useRef<HTMLButtonElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handleCTA = () => {
    setMessage(generateMessage());
    setShowSignature(true);
    setSignature("");
    setCopied(false);
    setError("");
    setTimeout(() => {
      if (signatureInputRef.current) signatureInputRef.current.focus();
    }, 100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (copyRef.current) copyRef.current.focus();
  };

  const handleLogin = () => {
    if (!signature) {
      setError("Merci de coller la signature pour continuer.");
      if (signatureInputRef.current) signatureInputRef.current.focus();
      return;
    }
    setError("");
    window.location.href = "/dazia/preview";
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f7f8fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <section
        style={{
          maxWidth: 420,
          width: "100%",
          margin: "40px auto",
          padding: 32,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 16px #0002",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        aria-label="Connexion DazIA"
      >
        <Link href="/checkout/daznode?product=Dazia&amount=100">
          <span style={{
            display: 'inline-block',
            background: '#facc15',
            color: '#232336',
            fontWeight: 700,
            fontSize: 18,
            padding: '12px 32px',
            borderRadius: 8,
            marginBottom: 24,
            boxShadow: '0 1px 4px #facc1533',
            cursor: 'pointer',
            textAlign: 'center',
          }}>
            Commander la Dazia
          </span>
        </Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: "#C026D3", letterSpacing: -1, textAlign: "center" }}>DazIA</h1>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, color: "#232336", textAlign: "center" }}>
          Connecte-toi avec ta clé Lightning pour accéder à l'IA DazIA.
        </h2>
        {!showSignature ? (
          <button
            onClick={handleCTA}
            style={{
              background: "#6366F1",
              color: "#fff",
              padding: "16px 0",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 20,
              border: "none",
              cursor: "pointer",
              width: "100%",
              marginTop: 8,
              outline: "none",
              boxShadow: "0 1px 4px #6366F133",
              transition: "background 0.2s",
            }}
            aria-label="Se connecter avec Dazia"
          >
            Se connecter avec Dazia
          </button>
        ) : (
          <form
            style={{ width: "100%" }}
            onSubmit={e => { e.preventDefault(); handleLogin(); }}
            aria-label="Formulaire de signature DazIA"
          >
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="message-to-sign" style={{ fontWeight: 600, color: "#232336", display: "block", marginBottom: 6 }}>
                Message à signer
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 0 }}>
                <input
                  id="message-to-sign"
                  type="text"
                  value={message}
                  readOnly
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 6,
                    border: "1.5px solid #232336",
                    background: "#181825",
                    color: "#fff",
                    fontSize: 18,
                    letterSpacing: 1,
                  }}
                  aria-readonly="true"
                  aria-label="Message à signer"
                  tabIndex={0}
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    background: copied ? "#22c55e" : "#6366F1",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "0 20px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    outline: copied ? "2px solid #22c55e" : "none",
                    transition: "background 0.2s, outline 0.2s",
                  }}
                  aria-label="Copier le message à signer"
                  ref={copyRef}
                  tabIndex={0}
                >
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
              <div style={{ fontSize: 13, color: "#232336", marginTop: 6 }}>
                Expires dans 10 minutes
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="signature-input" style={{ fontWeight: 600, color: "#232336", display: "block", marginBottom: 6 }}>
                Signature
              </label>
              <input
                id="signature-input"
                ref={signatureInputRef}
                type="text"
                placeholder="Colle la signature ici"
                value={signature}
                onChange={e => setSignature(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 6,
                  border: error ? "2px solid #e11d48" : "1.5px solid #232336",
                  background: "#181825",
                  color: "#fff",
                  fontSize: 18,
                  outline: error ? "2px solid #e11d48" : "none",
                  marginBottom: 0,
                }}
                aria-label="Colle la signature ici"
                aria-invalid={!!error}
                tabIndex={0}
                autoComplete="off"
              />
              {error && (
                <div style={{ color: "#e11d48", fontWeight: 500, marginTop: 6 }} aria-live="polite">{error}</div>
              )}
            </div>
            <button
              type="submit"
              disabled={!signature}
              style={{
                width: "100%",
                background: signature ? "#22c55e" : "#ccc",
                color: "#fff",
                fontWeight: 700,
                fontSize: 20,
                padding: 14,
                border: "none",
                borderRadius: 8,
                cursor: signature ? "pointer" : "not-allowed",
                marginTop: 4,
                outline: "none",
                boxShadow: signature ? "0 1px 4px #22c55e33" : "none",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
              aria-label="Connexion"
              tabIndex={0}
            >
              Connexion
            </button>
            <div style={{ marginTop: 18, textAlign: "center", fontSize: 15, color: "#EA580C" }}>
              <a href="https://lnrouter.app/auth/login" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                Comment signer ce message ?
              </a>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}