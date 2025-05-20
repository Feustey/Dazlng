"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from 'next/image';
import Link from "next/link";
import { CTASection } from './components/home/CTASection';

export default function HomePage(): React.ReactElement {
  useEffect(() => {
    AOS.init({ 
      once: true, 
      duration: 800,
      initClassName: 'mobile-aos'
    });
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden font-sans bg-gradient-to-b from-white to-gray-50">
      {/* HERO SECTION */}
      <section className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0" data-aos="fade-right">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Votre Nœud Lightning<br />
              <span className="text-yellow-300">Clé en Main</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Rejoignez la révolution Bitcoin Lightning avec une solution plug & play complète. Commencez en 5 minutes, sans connaissance technique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="bg-transparent hover:bg-white/20 border-2 border-white py-4 px-8 rounded-lg text-center text-lg transition-all">
                Démonstration gratuite
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative" data-aos="fade-left">
            <div className="relative w-full max-w-md mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-2xl bg-white p-4">
                <Image 
                  src="/assets/images/dazbox.png" 
                  alt="DazBox Device" 
                  width={500} 
                  height={500} 
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 rounded-full p-6 shadow-lg">
                <span className="font-bold text-gray-900 text-xl">Nouveau</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* PRODUITS SECTION */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-center mb-10 md:mb-16 text-gray-900 px-4"
            data-aos="fade-down"
            data-aos-delay="100"
          >
            Notre Suite de Solutions
          </h2>
          
          <div className="max-w-7xl mx-auto">
            {/* DazBox */}
            <div 
              id="dazbox"
              className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-8 md:mb-12 hover:shadow-2xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="grid md:grid-cols-2 gap-6 md:gap-12">
                <div className="space-y-4 md:space-y-6 order-2 md:order-1" data-aos="fade-right" data-aos-delay="300">
                  <h3 className="text-2xl sm:text-3xl font-bold text-indigo-600">DazBox</h3>
                  <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                    Votre nœud Lightning personnel, prêt à l'emploi
                  </p>
                  <ul className="space-y-3 md:space-y-4">
                    <li className="flex items-start" data-aos="fade-up" data-aos-delay="400">
                      <span className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-base sm:text-lg text-gray-700">Installation plug & play en 5 minutes</span>
                    </li>
                    <li className="flex items-start" data-aos="fade-up" data-aos-delay="500">
                      <span className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-base sm:text-lg text-gray-700">3 mois de Daznode Premium inclus</span>
                    </li>
                    <li className="flex items-start" data-aos="fade-up" data-aos-delay="600">
                      <span className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-base sm:text-lg text-gray-700">Support technique 24/7</span>
                    </li>
                  </ul>
                  <div className="pt-6 md:pt-8" data-aos="fade-up" data-aos-delay="700">
                    <Link 
                      href="/checkout/dazbox" 
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      <span>Commander pour 400K sats</span>
                      <svg className="w-5 h-5 ml-2 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="relative order-1 md:order-2 mb-6 md:mb-0" data-aos="fade-left" data-aos-delay="300">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-2xl transform -rotate-6 hidden md:block"></div>
                  <div className="relative bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                    <Image 
                      src="/assets/images/dazbox.png"
                      alt="DazBox Device"
                      width={500}
                      height={500}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* DazNode */}
            <div 
              id="daznode"
              className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-8 md:mb-12 hover:shadow-2xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="grid md:grid-cols-2 gap-6 md:gap-12">
                <div className="space-y-4 md:space-y-6 order-2 md:order-1" data-aos="fade-left" data-aos-delay="300">
                  <h3 className="text-2xl sm:text-3xl font-bold text-purple-600">DazNode</h3>
                  <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                    Optimisez votre nœud Lightning avec l'intelligence artificielle
                  </p>
                  <div className="space-y-4 md:space-y-6">
                    <div 
                      className="bg-purple-50 rounded-xl p-4 sm:p-6 border-l-4 border-purple-600"
                      data-aos="fade-left"
                      data-aos-delay="400"
                    >
                      <h4 className="text-base sm:text-lg font-semibold text-purple-900 mb-2">Gratuit</h4>
                      <p className="text-sm sm:text-base text-gray-700">Statistiques de base et monitoring essentiel</p>
                    </div>
                    <div 
                      className="bg-purple-50 rounded-xl p-4 sm:p-6 border-l-4 border-purple-600"
                      data-aos="fade-left"
                      data-aos-delay="500"
                    >
                      <h4 className="text-base sm:text-lg font-semibold text-purple-900 mb-2">Premium - 10K sats/mois</h4>
                      <p className="text-sm sm:text-base text-gray-700">Routing optimisé et analyses avancées</p>
                    </div>
                    <div 
                      className="bg-purple-50 rounded-xl p-4 sm:p-6 border-l-4 border-purple-600"
                      data-aos="fade-left"
                      data-aos-delay="600"
                    >
                      <h4 className="text-base sm:text-lg font-semibold text-purple-900 mb-2">Pro - 30K sats/mois</h4>
                      <p className="text-sm sm:text-base text-gray-700">Intégration Amboss, Sparkseer, alertes Telegram et auto-rebalancing</p>
                    </div>
                  </div>
                  <div className="pt-6 md:pt-8" data-aos="fade-up" data-aos-delay="700">
                    <Link 
                      href="/daznode" 
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      <span>Découvrir DazNode</span>
                      <svg className="w-5 h-5 ml-2 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="relative order-1 md:order-2 mb-6 md:mb-0" data-aos="fade-left" data-aos-delay="300">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl transform -rotate-6 hidden md:block"></div>
                  <div className="relative bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex items-center justify-center">
                    <Image
                      src="/assets/images/dazia-illustration.png"
                      alt="Illustration DazNode"
                      width={400}
                      height={250}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* DazPay */}
            <div 
              id="dazpay"
              className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-8 md:mb-12 hover:shadow-2xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="grid md:grid-cols-2 gap-6 md:gap-12">
                <div className="space-y-4 md:space-y-6 order-2 md:order-1" data-aos="fade-right" data-aos-delay="300">
                  <h3 className="text-2xl sm:text-3xl font-bold text-emerald-600">DazPay</h3>
                  <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                    Solution de paiement Lightning pour les commerces
                  </p>
                  <ul className="space-y-3 md:space-y-4">
                    <li className="flex items-start" data-aos="fade-up" data-aos-delay="400">
                      <span className="bg-emerald-100 p-1 rounded-full mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-base sm:text-lg text-gray-700">Terminal de paiement Lightning intuitif</span>
                    </li>
                    <li className="flex items-start" data-aos="fade-up" data-aos-delay="500">
                      <span className="bg-emerald-100 p-1 rounded-full mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-base sm:text-lg text-gray-700">Dashboard de gestion complet</span>
                    </li>
                    <li className="flex items-start" data-aos="fade-up" data-aos-delay="600">
                      <span className="bg-emerald-100 p-1 rounded-full mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-base sm:text-lg text-gray-700">Compatible avec votre DazBox existante</span>
                    </li>
                  </ul>
                  <div className="pt-6 md:pt-8" data-aos="fade-up" data-aos-delay="700">
                    <Link 
                      href="/contact" 
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      <span>Demander un devis</span>
                      <svg className="w-5 h-5 ml-2 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="relative order-1 md:order-2 mb-6 md:mb-0" data-aos="fade-left" data-aos-delay="300">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl transform -rotate-6 hidden md:block"></div>
                  <div className="relative bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                    <Image
                      src="/assets/images/dazpay-illustration.png"
                      alt="Illustration DazPay"
                      width={400}
                      height={250}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ajout d'une navigation rapide pour mobile */}
        <div className="fixed bottom-4 left-0 right-0 md:hidden z-50 px-4">
          <div className="bg-white rounded-full shadow-lg p-2 flex justify-around max-w-md mx-auto">
            <a href="#dazbox" className="p-2 text-indigo-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </a>
            <a href="#daznode" className="p-2 text-purple-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </a>
            <a href="#dazpay" className="p-2 text-emerald-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* AVANTAGES SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Pourquoi choisir Daz ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Simple et Rapide</h3>
              <p className="text-gray-600">
                Installation en 5 minutes, sans configuration complexe. Commencez à utiliser Lightning immédiatement.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Sécurisé et Fiable</h3>
              <p className="text-gray-600">
                Infrastructure robuste et sécurisée. Vos fonds sont toujours sous votre contrôle.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Support Communautaire</h3>
              <p className="text-gray-600">
                Accès à notre communauté d'experts et support technique 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <CTASection />


      {/* LOGO PARTNERS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-gray-600 mb-10">Nos partenaires :</h2>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <Image src="/assets/images/logo-blockchain_for_good.svg" alt="Blockchain for Good" width={120} height={60} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" />
            <Image src="/assets/images/logo-inoval.png" alt="Inoval" width={120} height={60} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" />
            <Image src="/assets/images/logo-Meetup.jpg" alt="Bitcoin Meetup" width={120} height={60} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </section>

      {/* Scroll Padding Adjustment */}
      <div className="scroll-padding-container">
        <style>{`
          .scroll-padding-container {
            scroll-padding-top: 1rem;
          }
          @media (min-width: 768px) {
            .scroll-padding-container {
              scroll-padding-top: 4rem;
            }
          }
        `}</style>
      </div>
    </main>
  );
} 