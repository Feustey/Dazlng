import React from 'react';

const socialLinks = [
  {
    url: 'nostr:d2d8186182cce5d40e26e7db23ea38d3bf4e10dd98642cc4f5b1fb38efaf438e',
    title: 'Suivez-nous sur Nostr',
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 2a8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8zm0 2a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 2a4 4 0 1 1-4 4 4 4 0 0 1 4-4z" />
      </svg>
    ),
  },
  {
    url: 'https://t.me/daznode_bot',
    title: 'Rejoignez-nous sur Telegram',
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
        <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
      </svg>
    ),
  },
  {
    url: 'https://linkedin.com/company/daznode',
    title: 'Suivez-nous sur LinkedIn',
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="flex-1 mb-6 md:mb-0">
            <img src="/assets/images/logo-daznode.svg" alt="Daz3 Logo" className="h-10 mb-4" />
            <p className="text-gray-600 max-w-xs">Où l'imagination rencontre l'innovation - libérez votre créativité avec nous!</p>
         
          </div>
          <div className="flex flex-row gap-12">
            <div>
              <h4 className="font-semibold mb-2">Produit</h4>
              <ul className="space-y-1 text-gray-700">
                <li><a href="https://docs.dazno.de" target="_blank" rel="noopener noreferrer">DazDocs</a></li>
                <li><a href="/app/token-for-good">Token for Good</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Entreprise</h4>
              <ul className="space-y-1 text-gray-700">
                <li><a href="/app/about">À propos de nous</a></li>
                <li><a href="/app/contact">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Aide</h4>
              <ul className="space-y-1 text-gray-700">
                <li><a href="/app/help">Support</a></li>
                <li><a href="/app/terms">Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>
      
        <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 sm:mb-0">
            © 2025 - Réalisé avec 💙 par <a href="https://inoval.io" target="_blank" rel="noopener noreferrer">Inoval</a>
          </div>
          <div className="flex flex-row gap-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                title={link.title}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-primary transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 