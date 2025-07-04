import React from "react";
import { Mail, MessageCircle, Calendar } from "@/components/shared/ui/IconRegistry";

const ContactDemoSection: React.FC = () => (
  <section className="py-16 bg-gray-50">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Une question ? <span className="text-[#F7931A]">Besoin d'une démo ?</span>
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Notre équipe vous répond sous 24h. Réservez une démo personnalisée ou contactez-nous directement.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="mailto:contact@daznode.com"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Mail className="w-5 h-5" />
          contact@daznode.com
        </a>
        <a 
          href="/contact"
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Calendar className="w-5 h-5" />
          Réserver une démo
        </a>
        <a 
          href="https://t.me/daznode"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Rejoindre le Telegram
        </a>
      </div>
    </div>
  </section>
);

export default ContactDemoSection; 