import React from 'react';
import { FaRocket, FaShieldAlt, FaClock } from 'react-icons/fa';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-400/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center space-y-8">
          {/* Titre principal */}
          <div data-aos="fade-up">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Prêt à rejoindre la révolution{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-pink-400 text-transparent bg-clip-text">
                Lightning ?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-indigo-100 leading-relaxed">
              Ne laissez pas la complexité technique vous freiner. 
              <br className="hidden md:block" />
              <strong className="text-yellow-300">Commencez maintenant</strong> et rejoignez l'économie Bitcoin.
            </p>
          </div>

          {/* Avantages rapides */}
          <div className="grid md:grid-cols-3 gap-6 my-12" data-aos="fade-up" data-aos-delay="200">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <FaRocket className="text-white text-2xl" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Démarrage Express</h3>
              <p className="text-indigo-200 text-sm">Installation en 5 minutes chrono</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Sécurité Maximale</h3>
              <p className="text-indigo-200 text-sm">Vos clés, votre contrôle total</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                <FaClock className="text-white text-2xl" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Support 24/7</h3>
              <p className="text-indigo-200 text-sm">Notre équipe vous accompagne</p>
            </div>
          </div>

          {/* CTA principal */}
          <div className="space-y-6" data-aos="fade-up" data-aos-delay="400">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-bold px-10 py-5 rounded-2xl text-xl shadow-2xl hover:from-yellow-500 hover:to-pink-600 transition-all transform hover:scale-105 hover:shadow-3xl">
                <span className="flex items-center gap-3">
                  <FaRocket className="group-hover:animate-bounce" />
                  Commander ma DazBox
                </span>
              </button>
              
              <button className="border-3 border-white text-white font-bold px-10 py-5 rounded-2xl text-xl hover:bg-white hover:text-indigo-600 transition-all">
                Planifier une Démo
              </button>
            </div>

            {/* Urgence et garantie */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="text-yellow-300 font-bold text-lg">
                    🔥 Offre limitée : 14 jours gratuits
                  </p>
                  <p className="text-indigo-100 text-sm">
                    + Livraison offerte partout en France
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-white font-bold">
                    ✅ Satisfait ou remboursé
                  </p>
                  <p className="text-indigo-200 text-sm">
                    Garantie 30 jours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact alternatif */}
          <div className="pt-8 border-t border-white/20" data-aos="fade-up" data-aos-delay="600">
            <p className="text-indigo-200 mb-4">
              Des questions ? Notre équipe est là pour vous aider
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
              <a href="mailto:contact@daznode.com" className="text-yellow-300 hover:text-yellow-200 font-medium">
                📧 contact@daznode.com
              </a>
              <span className="hidden sm:block text-indigo-300">•</span>
              <a href="tel:+33123456789" className="text-yellow-300 hover:text-yellow-200 font-medium">
                📞 +33 1 23 45 67 89
              </a>
              <span className="hidden sm:block text-indigo-300">•</span>
              <span className="text-indigo-200">
                💬 Chat en direct 24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 