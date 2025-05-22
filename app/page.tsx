"use client";
import React, { useEffect, useState, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from 'next/image';

// Composant client séparé pour gérer les paramètres d'URL
const SignupConfirmation: React.FC = () => {
  const [showSignupConfirmation, setShowSignupConfirmation] = useState(false);
  // Import dynamique dans le corps du composant
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const useSearchParams = require('next/navigation').useSearchParams;
  const searchParams = useSearchParams();
  useEffect(() => {
    const code = searchParams?.get('code');
    if (code) {
      setShowSignupConfirmation(true);
    }
  }, [searchParams]);
  const closeConfirmation = (): void => {
    setShowSignupConfirmation(false);
  };
  if (!showSignupConfirmation) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-indigo-200 transform transition-all animate-fade-in-scale"
        data-aos="zoom-in"
        data-aos-duration="400"
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Inscription confirmée !</h2>
          <p className="text-gray-600 mb-6">
            Votre adresse email a été vérifiée avec succès. Votre compte est maintenant actif et vous pouvez profiter de tous les services de Daznode.
          </p>
          <button
            onClick={closeConfirmation}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Commencer l'aventure
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HomePage(): React.ReactElement {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      AOS.init({ 
        once: false,
        duration: 800,
        easing: 'ease-out-cubic',
        mirror: true,
        anchorPlacement: 'top-bottom'
      });
      // Script pour le défilement fluide
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const targetId = (anchor as HTMLAnchorElement).getAttribute('href');
        if (!targetId) return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          anchor.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY,
              behavior: 'smooth'
            });
          });
        }
      });
    }
  }, []);
  return (
    <>
      {/* Lightbox de confirmation d'inscription dans Suspense */}
      <Suspense fallback={null}>
        <SignupConfirmation />
      </Suspense>
      {/* HERO */}
      <div className="min-h-screen relative bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="relative z-8 text-center space-y-8">
            <Image
              src="/assets/images/logo-daznode.svg"
              alt="Daznode"
              width={230}
              height={90}
              className="h-16 md:h-20 w-auto mx-auto"
            />
     
          <h1 className="text-4xl md:text-6xl font-bold text-white animate-fade-in">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">l'accès Lightning</span> pour tous
          </h1>
          
          {/* Bloc texte d'introduction avec zoom-in */}
          <div 
            className="max-w-3xl mx-auto bg-indigo-700/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-indigo-500/50" 
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">
              Oubliez la complexité !
            </h3>
          
            <h4 className="text-lg md:text-xl leading-relaxed mb-4 bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">
              La blockchain, est l'écosystème où chaque utilisateur, entreprise ou particulier, devient acteur du réseau Bitcoin en utilisant la simplicité de lightning.
            </h4>
          </div>
          

          {/* Section de flèche de défilement */}
          <div className="mt-12 md:mt-16 flex justify-center">
            <button 
              onClick={() => {
                window.scrollTo({
                  top: document.getElementById('discover')?.offsetTop || 0,
                  behavior: 'smooth'
                });
              }}
              className="group flex flex-col items-center text-yellow-300 hover:text-yellow-200 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <div className="overflow-hidden relative h-6">
                <span className="inline-block transform group-hover:-translate-y-full transition-transform duration-300 ease-in-out">Découvrir</span>
                <span className="inline-block transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out absolute left-0 top-0">Explorer</span>
              </div>
              <div className="mt-3 w-12 h-12 rounded-full bg-yellow-300 text-indigo-700 flex items-center justify-center overflow-hidden group-hover:bg-yellow-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* SECTION 1 */}
      <main id="discover" className="min-h-screen w-full overflow-x-hidden font-sans">
        <section className="relative w-full bg-gradient-to-r from-yellow-600 to-purple-700 text-white rounded-xl p-6 shadow-lg border border-indigo-500/50">
          <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between">
            <div className="bg-orange md:w-1/2 mb-10 md:mb-0" data-aos="fade-right">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Votre Coffre-Fort Bitcoin Personnel<br/><span className="text-yellow-300">Simplicité, Sécurité, Autonomie</span></h1>
              <p className="text-xl md:text-2xl mb-8">Imaginez posséder votre propre banque Bitcoin, prête à l'emploi en 5 minutes ! La DazBox vous offre tout le pouvoir du Bitcoin sans aucune complexité. Plug & Play, elle vous garantit le contrôle total de vos finances numériques avec une sécurité maximale.</p>
              <ul className="space-y-3 md:space-y-4 from-white to-gray-50">
                <li className="flex items-start" data-aos="fade-up" data-aos-delay="400">
                  <span className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg text-yellow-50">Installation ultra-simple : branchez, connectez, c'est prêt !</span>
                </li>
                <li className="flex items-start" data-aos="fade-up" data-aos-delay="500">
                  <span className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg text-gray-50">Votre argent vous appartient vraiment – zéro intermédiaire</span>
                </li>
                <li className="flex items-start" data-aos="fade-up" data-aos-delay="600">
                  <span className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg text-red-50">Interface intuitive pensée pour tous</span>
                </li>
                <li className="flex items-start" data-aos="fade-up" data-aos-delay="700">
                  <span className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg text-red-1000">Assistant IA intégré pour vous guider</span>
                </li>
                <li className="flex items-start" data-aos="fade-up" data-aos-delay="800">
                  <span className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg text-yellow-50">400 000 satoshis, soit 0,004 BTC(≈ 399€) – livraison incluse</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 relative" data-aos="fade-left">
              <div className="relative w-full max-w-md mx-auto">
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-white p-4">
                  <Image
                    alt="DazBox Device"
                    src="/assets/images/dazbox.png"
                    width={500}
                    height={500}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="absolute -bottom-8 -right-4 p-6 shadow-lg">
                  <a className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl" href="/checkout/dazbox">
                    Je Prends le Contrôle !
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* SECTION 2 - Suite de Solutions */}
        <section >
      
        
           
              {/* DazNode */}
              <div id="daznode" className="bg-purple rounded-2xl shadow-xl p-4 sm:p-8 mb-8 md:mb-12 hover:shadow-2xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay="200">
                <div className="grid md:grid-cols-2 gap-6 md:gap-12">
                  {/* Illustration à gauche */}
                  <div className="relative order-1 mb-6 md:mb-0" data-aos="fade-right" data-aos-delay="300">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl transform -rotate-6 hidden md:block"></div>
                    <div className="relative bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex items-center justify-center h-full">
                      <Image
                        alt="Illustration DazNode"
                        src="/assets/images/dazia-illustration.png"
                        width={400}
                        height={250}
                        className="w-full h-auto object-contain"
                        priority
                      />
                    </div>
                  </div>
                  {/* Offres à droite */}
                  <div className="space-y-4 md:space-y-6 order-2" data-aos="fade-left" data-aos-delay="300">
                    <h3 className="text-2xl sm:text-3xl font-bold text-purple-600">DazNode</h3>
                    <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text leading-relaxed">Optimisez votre nœud Lightning avec l&apos;intelligence artificielle</p>
                    <ul className="space-y-4 md:space-y-6">
                      <li className="bg-purple-50 rounded-xl p-4 sm:p-6 border-l-4 border-purple-600 flex flex-col sm:flex-row sm:items-center sm:justify-between" data-aos="fade-left" data-aos-delay="400">
                        <span className="font-semibold text-purple-900">Statistiques de base et monitoring essentiel</span>
                        <span className="mt-2 sm:mt-0 sm:ml-4 font-bold text-purple-900 whitespace-nowrap">une semaine offerte</span>
                      </li>
                      <li className="bg-purple-50 rounded-xl p-4 sm:p-6 border-l-4 border-purple-600 flex flex-col sm:flex-row sm:items-center sm:justify-between" data-aos="fade-left" data-aos-delay="500">
                        <span className="font-semibold text-purple-900">Routing optimisé et analyses avancées</span>
                        <span className="mt-2 sm:mt-0 sm:ml-4 font-bold text-purple-900 whitespace-nowrap">10K sats/mois</span>
                      </li>
                      <li className="bg-purple-50 rounded-xl p-4 sm:p-6 border-l-4 border-purple-600 flex flex-col sm:flex-row sm:items-center sm:justify-between" data-aos="fade-left" data-aos-delay="600">
                        <span className="font-semibold text-purple-900">Toute la puissance de notre IA et son heuristic</span>
                        <span className="mt-2 sm:mt-0 sm:ml-4 font-bold text-purple-900 whitespace-nowrap">30K sats/mois</span>
                      </li>
                    </ul>
                    <div className="pt-6 md:pt-8" data-aos="fade-up" data-aos-delay="700">
                      <a className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl" href="/daznode">
                        <span>Découvrir DazNode</span>
                        <svg className="w-5 h-5 ml-2 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* DazPay */}
              <div id="dazpay" className="bg-emerald-400/80 rounded-2xl shadow-xl p-4 sm:p-8 mb-8 md:mb-12 hover:shadow-2xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay="200">
                <div className="grid md:grid-cols-2 gap-6 md:gap-12">
                  <div className="space-y-4 md:space-y-6 order-2 md:order-1" data-aos="fade-right" data-aos-delay="300">
                    <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-yellow-200 to-white text-transparent bg-clip-text">DazPay</h3>
                    <p className="text-lg sm:text-xl text-white leading-relaxed font-semibold">Solution de paiement Lightning pour les commerces</p>
                    <ul className="space-y-3 md:space-y-4">
                      <li className="flex items-start">
                        <span className="bg-white/80 p-1 rounded-full mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                        <span className="text-lg text-white font-medium">Terminal de paiement Lightning intuitif</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-white/80 p-1 rounded-full mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                        <span className="text-lg text-white font-medium">Dashboard de gestion complet</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-white/80 p-1 rounded-full mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                        <span className="text-lg text-white font-medium">Compatible avec votre DazBox existante</span>
                      </li>
                    </ul>
                    <div className="pt-6 md:pt-8" data-aos="fade-up" data-aos-delay="700">
                      <a className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-emerald-700 bg-white rounded-xl hover:bg-emerald-100 transition-colors duration-200 shadow-lg hover:shadow-xl" href="/contact">
                        <span>Une démo !</span>
                        <svg className="w-5 h-5 ml-2 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="relative order-1 md:order-2 mb-6 md:mb-0" data-aos="fade-left" data-aos-delay="300">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl transform -rotate-6 hidden md:block"></div>
                    <div className="relative bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                      <Image
                        alt="Illustration DazPay"
                        src="/assets/images/dazpay-illustration.png"
                        width={400}
                        height={250}
                        className="w-full h-auto object-contain"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
           
          
          {/* Menu mobile fixe en bas */}
          <div className="fixed bottom-4 left-0 right-0 md:hidden z-50 px-4">
            <div className="bg-white rounded-full shadow-lg p-2 flex justify-around max-w-md mx-auto">
              <a href="#dazbox" className="p-2 text-indigo-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </a>
              <a href="#daznode" className="p-2 text-purple-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </a>
              <a href="#dazpay" className="p-2 text-emerald-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </a>
            </div>
          </div>
        </section>
        {/* SECTION 3 - Pourquoi choisir Daz ? */}
        <section className="py-20 bg-transparent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-orange-600 text-center mb-6" data-aos="fade-up">La DazBox : Votre Première Étape vers la Liberté Financière</h2><br/>
            <div className="grid md:grid-cols-3 gap-4 md:gap-0 relative">
              {/* Carte DazBox - maintenant au centre et en avant */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative z-20 flex flex-col justify-between scale-110 md:scale-110 md:col-start-2 md:row-start-1 md:row-end-3 md:translate-y-[-5%]" style={{marginLeft: '-2rem', marginRight: '-2rem'}} data-aos="fade-up">
                <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 font-medium rounded-bl-lg">Populaire</div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-indigo-600 mb-4 text-center">DazBox</h3>
                  <div className="flex items-baseline mb-6 justify-center">
                    <span className="text-5xl font-bold">400K</span>
                    <span className="text-xl text-gray-500 ml-2">sats</span>
                  </div>
                  <p className="text-gray-600 mb-8 text-center">La DazBox transforme votre rapport à l'argent. Plus qu'un simple appareil, c'est votre porte d'entrée vers un monde où vous êtes aux commandes. Fini les banques qui décident pour vous, les frais cachés et les restrictions ! Avec la DazBox, vos bitcoins vous appartiennent vraiment, sont accessibles 24/7, et chaque transaction est instantanée et économique.\n\nNotre solution tout-en-un inclut un assistant virtuel qui vous accompagne et vous explique chaque étape en langage clair. Que vous soyez novice ou initié, la DazBox s'adapte à vos besoins et évolue avec vous.</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Simplicité absolue : Branchez, suivez le guide, c'est prêt en 5 minutes</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Protection maximale : Vos bitcoins sous votre contrôle, à l'abri des piratages</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Paiements facilités : Envoyez et recevez de l'argent instantanément, sans intermédiaire</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Assistant personnel : L'IA DazIA répond à toutes vos questions en langage simple</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Support humain : Une équipe réactive disponible 24/7 pour vous accompagner</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Évolutive : Commencez simplement et découvrez de nouvelles fonctionnalités à votre rythme</span>
                    </li>
                  </ul>
                  <div className="mt-auto"></div>
                </div>
                <div className="p-8 bg-gray-50 border-t">
                  <a href="/checkout/dazbox" className="block w-full bg-indigo-600 text-white text-center py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200">
                    Je Prends le Contrôle !
                  </a>
                </div>
              </div>
              {/* Carte DazNode - à gauche */}
              <div className="bg-gradient-to-br from-green-400 via-cyan-500 to-indigo-500 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1 duration-300 md:col-start-1 md:row-start-1 md:row-end-3" data-aos="fade-up" data-aos-delay="100">
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">DazNode</h3>
                  <div className="flex items-baseline mb-6 justify-center">
                    <span className="text-5xl font-bold text-white">10K</span>
                    <span className="text-xl text-white/80 ml-2">sats/mois</span>
                  </div>
                  <p className="text-white/80 mb-8 text-center">IA pour optimiser votre nœud Lightning</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-300 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Statistiques et monitoring avancés</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-300 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Routing optimisé par IA</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-300 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Analyses et recommandations</span>
                    </li>
                  </ul>
                  <div className="mt-auto"></div>
                </div>
                <div className="p-8 bg-indigo-800/30 border-t border-white/20">
                  <a href="/daznode" className="block w-full bg-white text-indigo-600 text-center py-4 rounded-xl font-semibold hover:bg-yellow-100 transition-colors duration-200">
                    Découvrir DazNode
                  </a>
                </div>
              </div>
              {/* Carte DazPay - à droite */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1 duration-300 md:col-start-3 md:row-start-1 md:row-end-3" data-aos="fade-up" data-aos-delay="200">
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-emerald-600 mb-4">DazPay</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold">set up offert</span>
                  </div>
                  <p className="text-gray-600 mb-8">Solution de paiement pour les commerces</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Terminal de paiement Lightning</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Dashboard de gestion complet</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Master your node DazBox</span>e
                    </li>
                  </ul>
                  <div className="mt-auto"></div>
                </div>
                <div className="p-8 bg-gray-50 t">
                  <a href="/contact" className="block w-full bg-emerald-600 text-white text-center py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors duration-200">
                    Parlons ensemble
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
   
        {/* SECTION 4 - CTA */}
        <section className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          </div>
          <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">Prenez le Contrôle Dès Maintenant</h2>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-indigo-100" data-aos="fade-up" data-aos-delay="100">Pourquoi attendre pour découvrir la liberté financière ? La DazBox vous est livrée prête à l'emploi, avec 3 mois d'assistance premium inclus. En quelques minutes, vous ferez partie de la révolution financière qui change déjà le monde.\n\nRejoignez les milliers d'utilisateurs qui ont fait le pas vers leur indépendance financière. Commandez votre DazBox aujourd'hui et découvrez pourquoi nos clients la considèrent comme l'investissement le plus intelligent et le plus simple pour entrer dans le monde du Bitcoin.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
                <a className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white/10 rounded-xl transition-all duration-200" href="/checkout/dazbox">Je Commande Ma DazBox</a>
              </div>
              <div className="mt-12 flex flex-wrap justify-center items-center gap-6" data-aos="fade-up" data-aos-delay="300">
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-sm">Installation 5 min</span>
                </div>
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-sm">Support 24/7</span>
                </div>
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-sm">3 mois Premium inclus</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <br/>
        {/* SECTION 5 - Partenaires */}
        <section className="bg-black-20 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1 duration-300" data-aos="fade-up" data-aos-delay="200">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text mb-10">Partenaires :</h2>
            <div className="flex flex-wrap justify-center items-center gap-12">
              <Image alt="Blockchain for Good" src="/assets/images/logo-blockchain_for_good.svg" width={120} height={60} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" />
              <Image alt="Inoval" src="/assets/images/logo-inoval.png" width={120} height={60} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" />
              <Image alt="Bitcoin Meetup" src="/assets/images/logo-Meetup.jpg" width={120} height={60} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" />
              <br/>
            </div>
          </div>
        </section>

      </main>
    </>
  );
} 