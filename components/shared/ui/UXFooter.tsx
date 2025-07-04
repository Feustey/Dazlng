import React from 'react';

const UXFooter: React.FC = () => (
  <footer className="bg-[#1A1A1A] text-gray-400 py-8 text-center text-sm border-t border-[#F7931A]/10">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        © {new Date().getFullYear()} DazNode. Tous droits réservés.
      </div>
      <div className="flex gap-4">
        <a href="/terms" className="hover:text-[#F7931A] transition">{t('UXFooter.mentions_lgales')}</a>
        <a href="/privacy" className="hover:text-[#F7931A] transition">{t('UXFooter.confidentialit')}</a>
        <a href="mailto:contact@daznode.com" className="hover:text-[#F7931A] transition">Contact</a>
      </div>
    </div>
  </footer>
);

export default UXFooter; 