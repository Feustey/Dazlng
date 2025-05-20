"use client";
import React from "react";
import Link from "next/link";

export default function DazboxDaziaPage(): React.ReactElement {
  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f7f8fa 60%, #f3e8ff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 0"
    }}>
      <section style={{
        maxWidth: 900,
        width: "100%",
        margin: "0 auto",
        padding: 40,
        background: "#fff",
        borderRadius: 24,
        boxShadow: "0 4px 32px #0001",
        display: "flex",
        flexDirection: "row",
        gap: 48,
        alignItems: "flex-start",
        flexWrap: "wrap"
      }}>
        {/* Colonne Dazbox */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <h1 style={{
            fontSize: 36,
            fontWeight: 900,
            color: "#6366F1",
            marginBottom: 12,
            letterSpacing: -1
          }}>
            Dazbox&nbsp;
            <span style={{ fontSize: 22, color: "#232336", fontWeight: 500 }}>
              — Le Pass Web3
            </span>
          </h1>
          <p style={{
            fontSize: 18,
            color: "#232336",
            marginBottom: 24,
            lineHeight: 1.5
          }}>
            La Dazbox, c'est la clé pour découvrir le web3 sans prise de tête : 
            <b> sécurité, simplicité, et accès à l'IA DazIA inclus</b>. 
            Idéale pour débuter, stocker tes cryptos, et profiter de services innovants.
          </p>
          <ul style={{
            marginBottom: 24,
            color: "#6366F1",
            fontWeight: 600,
            fontSize: 16,
            paddingLeft: 20
          }}>
            <li>🔒 Sécurité maximale (matériel dédié)</li>
            <li>⚡️ Installation ultra-simple</li>
            <li>🤖 Accès à DazIA offert</li>
            <li>🌍 Compatible avec tous les profils</li>
          </ul>
          <Link href="/checkout/daznode?product=Dazbox&amount=199">
            <span style={{
              display: 'inline-block',
              background: '#facc15',
              color: '#232336',
              fontWeight: 700,
              fontSize: 20,
              padding: '16px 40px',
              borderRadius: 10,
              boxShadow: '0 2px 8px #facc1533',
              cursor: 'pointer',
              textAlign: 'center',
              transition: "background 0.2s"
            }}>
              Commander la Dazbox
            </span>
          </Link>
          <div style={{ marginTop: 18, fontSize: 15, color: "#EA580C" }}>
            <a href="#dazia" style={{ textDecoration: "underline" }}>
              Découvrir l'IA DazIA incluse
            </a>
          </div>
        </div>

        {/* Colonne Dazia */}
        <div id="dazia" style={{
          flex: 1,
          minWidth: 320,
          background: "#f7f8fa",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 1px 8px #c026d333"
        }}>
          <h2 style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#C026D3",
            marginBottom: 10,
            letterSpacing: -1
          }}>
            DazIA — L'IA qui t'accompagne dans le web3
          </h2>
          <p style={{
            fontSize: 16,
            color: "#232336",
            marginBottom: 18,
            lineHeight: 1.5
          }}>
            DazIA, c'est ton assistant personnel pour comprendre, explorer et utiliser le web3. 
            Pose-lui toutes tes questions, obtiens des conseils personnalisés, et avance à ton rythme.
          </p>
          <ul style={{
            color: "#C026D3",
            fontWeight: 600,
            fontSize: 15,
            paddingLeft: 20,
            marginBottom: 18
          }}>
            <li>💡 Explications simples et pédagogiques</li>
            <li>🧑‍💻 Assistance 24/7</li>
            <li>🔗 Connectée à ta Dazbox</li>
            <li>🎁 Inclus avec ta Dazbox</li>
          </ul>
          <div style={{
            background: "#fff",
            borderRadius: 8,
            padding: 12,
            color: "#6366F1",
            fontWeight: 500,
            fontSize: 15,
            textAlign: "center",
            boxShadow: "0 1px 4px #6366F133"
          }}>
            <span>
              Pour profiter de DazIA, il te suffit de commander ta Dazbox.<br />
              <span style={{ color: "#232336" }}>Aucune connaissance technique requise !</span>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}