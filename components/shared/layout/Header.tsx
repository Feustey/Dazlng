"use client";
import * as React from 'react';
import { useState } from 'react';
import Colors from '../../../constants/Colors';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;

  return (
    <header className={`header-root ${styles.headerRoot}`}>
      <nav className={`header-nav ${styles.headerNav}`}>
        <a href="/"> 
          <img src="/assets/images/logo.png" alt="DazNode Logo" height={40} style={{display: 'block', filter: 'drop-shadow(0 2px 8px #5d5dfc88)'}} />
        </a>
        <a href="#offre-dazbox" className="header-link">DazBox</a>
        <a href="#offre-dazia" className="header-link">DazIA</a>
        <a href="#offre-dazpay" className="header-link">DazPay</a>
        <a href="https://docs.dazno.de" target="_blank" rel="noopener noreferrer" className="header-link">Dazdocs</a>
      </nav>
      <a href="/account" className="header-account" title="Mon compte">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="8" r="4"/><path d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"/></svg>
      </a>
      <button className={styles.headerBurger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      {menuOpen && (
        <div className={`header-mobile-menu ${styles.headerMobileMenu}`}>
          <a href="#offre-dazbox" className="header-link">DazBox</a>
          <a href="#offre-dazia" className="header-link">DazIA</a>
          <a href="#offre-dazpay" className="header-link">DazPay</a>
          <a href="https://docs.dazno.de" target="_blank" rel="noopener noreferrer" className="header-link">Dazdocs</a>
        </div>
      )}
    </header>
  );
} 