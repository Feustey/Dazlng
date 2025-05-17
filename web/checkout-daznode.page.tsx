"use client";
import { useState } from 'react';

export default function DaznodeCheckoutPage() {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5vw',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 2.5rem)',
          fontWeight: 'bold',
          color: '#1A2236',
          marginBottom: 12,
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Checkout Daznode
      </h1>
      <p
        style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: '#6B7280',
          marginBottom: 32,
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          maxWidth: 400,
        }}
      >
        Finalisez votre commande Daznode ici.
      </p>
      <button
        style={{
          background: hover ? '#232B44' : '#1A2236',
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
          border: 'none',
          borderRadius: 8,
          padding: '14px 32px',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'background 0.2s, box-shadow 0.2s',
          outline: 'none',
          boxShadow: hover ? '0 2px 8px rgba(26,34,54,0.12)' : 'none',
          marginTop: 8,
        }}
        onClick={() => window.history.back()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        tabIndex={0}
        aria-label="Retour"
      >
        Retour
      </button>
    </div>
  );
} 