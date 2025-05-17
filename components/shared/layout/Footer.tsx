import React from 'react';
import Colors from '../../../constants/Colors';
import styles from './Footer.module.css';


export default function Footer() {
  const socialLinks = [
    {
      url: 'nostr:d2d8186182cce5d40e26e7db23ea38d3bf4e10dd98642cc4f5b1fb38efaf438e',
      title: 'Suivez-nous sur Nostr',
      icon: (
        <svg width={28} height={28} viewBox="0 0 24 24" fill={Colors.secondary}>
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 2a8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8zm0 2a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 2a4 4 0 1 1-4 4 4 4 0 0 1 4-4z" />
        </svg>
      ),
    },
    {
      url: 'https://t.me/daznode_bot',
      title: 'Rejoignez-nous sur Telegram',
      icon: (
        <svg width={28} height={28} viewBox="0 0 24 24" fill={Colors.secondary}>
          <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
        </svg>
      ),
    },
    {
      url: 'https://linkedin.com/company/daznode',
      title: 'Suivez-nous sur LinkedIn',
      icon: (
        <svg width={28} height={28} viewBox="0 0 24 24" fill={Colors.secondary}>
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
  ];

  const pageLinks = [
    { label: 'Aide', path: '/help' },
    { label: 'À propos', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'CGU', path: '/terms' },
  ];

  return (
    <footer
      className={`footer-root ${styles.footerRoot}`}
    >
      <div className={`footer-links ${styles.footerLinks}`}>
        <a href="/about" className={styles.footerLink}>À propos</a>
        <a href="/contact" className={styles.footerLink}>Contact</a>
        <a href="/help" className={styles.footerLink}>Aide</a>
        <a href="/terms" className={styles.footerLink}>Terms</a>
      </div>
      <div className={`footer-social ${styles.footerSocial}`}>
        {socialLinks.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" title={link.title} className={styles.footerSocialLink}>
            {link.icon}
          </a>
        ))}
      </div>
    </footer>
  );
}
