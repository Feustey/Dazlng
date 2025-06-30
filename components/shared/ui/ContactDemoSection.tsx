import React from 'react';
import { Mail, MessageCircle, Calendar } from 'lucide-react';

const ContactDemoSection: React.FC = () => (
  <section id="contact-section" className="py-20 bg-gradient-to-br from-[#1A1A1A] to-[#232323]">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
        Une question ? <span className="text-[#F7931A]">Besoin d&apos;une démo ?</span>
      </h2>
      <p className="text-xl text-gray-300 mb-12">
        Notre équipe vous répond sous 24h. Réservez une démo personnalisée ou contactez-nous directement.
      </p>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <a
          href="mailto:contact@daznode.com"
          className="flex-1 bg-gradient-to-r from-[#F7931A] to-[#FFE500] text-black font-bold py-6 rounded-xl flex flex-col items-center hover:scale-105 transition-all"
        >
          <Mail className="h-8 w-8 mb-2" />
          contact@daznode.com
        </a>
        <a
          href="https://cal.com/daznode/demo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 border-2 border-[#00D4AA] text-[#00D4AA] font-bold py-6 rounded-xl flex flex-col items-center hover:bg-[#00D4AA] hover:text-black transition-all"
        >
          <Calendar className="h-8 w-8 mb-2" />
          Réserver une démo
        </a>
        <a
          href="https://t.me/tokenforgood"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 border-2 border-[#F7931A] text-[#F7931A] font-bold py-6 rounded-xl flex flex-col items-center hover:bg-[#F7931A] hover:text-black transition-all"
        >
          <MessageCircle className="h-8 w-8 mb-2" />
          Rejoindre le Telegram
        </a>
      </div>
    </div>
  </section>
);

export default ContactDemoSection; 