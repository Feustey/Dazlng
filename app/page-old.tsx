"use client";
import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import DazBoxOffer from "@/components/shared/ui/DazBoxOffer";
import PricingCard from "@/components/shared/ui/PricingCard";
import { OptimizedImage, LazyList, useCache } from "@/components/shared/ui";
import { FaServer, FaBox, FaCreditCard } from "react-icons/fa";

// Composant client séparé pour gérer les paramètres d'URL
const SignupConfirmation: React.FC = () => {
  const [showSignupConfirmation, setShowSignupConfirmation] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Utiliser URLSearchParams directement côté client pour éviter les erreurs d'hydratation
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      setShowSignupConfirmation(true);
    }
  }, []);
  
  const closeConfirmation = (): void => {
    setShowSignupConfirmation(false);
  };
  
  // Ne pas rendre pendant l'hydratation côté serveur
  if (!mounted || !showSignupConfirmation) return null;
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
  
  // Cache des données de testimonials et autres contenus dynamiques
  const { data: testimonials, loading: testimonialsLoading } = useCache(
    'home-testimonials',
    async () => {
      // Simulation d'API call pour les témoignages
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 1,
          name: "Marie Dubois",
          title: "Entrepreneur",
          content: "La DazBox a transformé ma façon de gérer mes paiements Bitcoin. Installation en 5 minutes, tout fonctionne parfaitement !",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 2,
          name: "Thomas Martin",
          title: "Développeur",
          content: "DazNode m'aide à optimiser mon nœud Lightning. L'IA anticipe les besoins de routing, c'est impressionnant !",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 3,
          name: "Sophie Leroy",
          title: "Commerçante",
          content: "DazPay a révolutionné mon commerce. Paiements instantanés et frais dérisoires, mes clients adorent !",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
      ];
    },
    { ttl: 10 * 60 * 1000 } // 10 minutes de cache
  );

  useEffect(() => {
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
          const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
          const offset = 80; // Décalage de 80px vers le haut
          window.scrollTo({
            top: elementTop - offset,
            behavior: 'smooth'
          });
        });
      }
    });
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
          {/* Logo et titre principal alignés */}
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Logo centré avec effet zoom */}
            <div className="flex justify-center" data-aos="zoom-in" data-aos-duration="800">
              <Image
                src="/assets/images/logo-daznode.svg"
                alt="Daznode"
                width={280}
                height={110}
                className="h-20 md:h-28 w-auto transform hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            
            {/* Titre principal */}
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white animate-fade-in">
                <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">l'accès Lightning</span> pour tous
              </h1>
            </div>
          </div>
          
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
                const element = document.getElementById('discover');
                if (element) {
                  const elementTop = element.offsetTop;
                  const offset = 80; // Décalage de 80px vers le haut
                  window.scrollTo({
                    top: elementTop - offset,
                    behavior: 'smooth'
                  });
                }
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
              <p className="text-xl md:text-2xl mb-8">La DazBox vous offre tout le pouvoir du Bitcoin sans aucune complexité. <br />Plug & Play, elle vous garantit le contrôle total avec une sécurité maximale.</p>
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
                  <span className="text-base sm:text-lg text-yellow-50">400 000 satoshis, soit 0,004 BTC(≈ 399 €) – livraison incluse</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 relative" data-aos="fade-left">
              <DazBoxOffer />
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
                      <OptimizedImage
                        alt="Illustration DazNode"
                        src="/assets/images/dazia-illustration.png"
                        width={400}
                        height={250}
                        className="w-full h-auto object-contain"
                        priority={true}
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
                      <OptimizedImage
                        alt="Illustration DazPay"
                        src="/assets/images/dazpay-illustration.png"
                        width={400}
                        height={250}
                        className="w-full h-auto object-contain"
                        priority={true}
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
            <div className="grid md:grid-cols-3 gap-8">
              <PricingCard
                title="DazNode"
                price="10K"
                unit="sats/mois"
                features={[
                  "Statistiques et monitoring avancés",
                  "Routing optimisé par IA",
                  "Analyses et recommandations"
                ]}
                cta="Découvrir DazNode"
                ctaHref="/daznode"
                color="from-green-400 via-cyan-500 to-indigo-500"
                icon={<FaServer />}
                microcopy="1 semaine offerte, sans engagement"
              />
              <PricingCard
                title="DazBox"
                price="400K"
                unit="sats"
                features={[
                  "Simplicité absolue : prêt en 5 min",
                  "Protection maximale",
                  "Paiements instantanés",
                  "Assistant IA inclus"
                ]}
                cta="Commander ma DazBox"
                ctaHref="/checkout/dazbox"
                highlight
                color="from-orange-400 via-pink-500 to-purple-600"
                icon={<FaBox />}
                microcopy="Livraison rapide et paiement sécurisé"
              />
              <PricingCard
                title="DazPay"
                price="set up offert"
                features={[
                  "Terminal de paiement Lightning",
                  "Dashboard de gestion complet",
                  "Master your node DazBox"
                ]}
                cta="Parlons ensemble"
                ctaHref="/contact"
                color="from-emerald-400 to-emerald-600"
                icon={<FaCreditCard />}
                microcopy="Accompagnement personnalisé"
              />
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
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-indigo-100" data-aos="fade-up" data-aos-delay="100">Pourquoi attendre pour découvrir la liberté financière ? La DazBox vous est livrée prête à l'emploi, avec 3 mois d'assistance premium inclus. En quelques minutes, vous ferez partie de la révolution financière qui change déjà le monde.</p>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-indigo-100" data-aos="fade-up" data-aos-delay="100">Rejoignez les milliers d'utilisateurs qui ont fait le pas vers leur indépendance financière. Commandez votre DazBox aujourd'hui et découvrez pourquoi nos clients la considèrent comme l'investissement le plus intelligent et le plus simple pour entrer dans le monde du Bitcoin.</p>
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
        
        {/* SECTION 5 - Témoignages */}
        <section className="py-20 bg-gray-50 rounded-2xl">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text" data-aos="fade-up">
              Ce que disent nos utilisateurs
            </h2>
            
            {testimonialsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : testimonials && testimonials.length > 0 ? (
              <LazyList
                items={testimonials}
                pageSize={3}
                renderItem={(testimonial, index) => (
                  <div 
                    key={testimonial.id} 
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    data-aos="fade-up" 
                    data-aos-delay={index * 100}
                  >
                    <div className="flex items-start space-x-4">
                      <OptimizedImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg text-gray-900">{testimonial.name}</h4>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{testimonial.title}</p>
                        <p className="text-gray-700 leading-relaxed">"{testimonial.content}"</p>
                      </div>
                    </div>
                  </div>
                )}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                emptyComponent={
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucun témoignage disponible pour le moment.</p>
                  </div>
                }
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun témoignage disponible pour le moment.</p>
              </div>
            )}
          </div>
        </section>
        <br/>
        
        {/* SECTION 6 - Partenaires */}
        <section className="bg-black-20 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1 duration-300" data-aos="fade-up" data-aos-delay="200">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text mb-10">Partenaires :</h2>
            <div className="flex flex-wrap justify-center items-center gap-12">
              <a href="https://blockchainforgood.fr" target="_blank" rel="noopener noreferrer"><Image alt="Blockchain for Good" src="/assets/images/logo-blockchain_for_good.svg" width={120} height={60} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" /></a>
              <a href="https://inoval.fr" target="_blank" rel="noopener noreferrer"><OptimizedImage alt="Inoval" src="/assets/images/logo-inoval.png" width={120} height={60} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" loading="lazy" /></a>
              <a href="https://nantesbitcoinmeetup.notion.site/Nantes-Bitcoin-Meetup-c2202d5100754ad1b57c02c83193da96" target="_blank" rel="noopener noreferrer"><OptimizedImage alt="Nantes Bitcoin Meetup" src="/assets/images/logo-meetup.jpg" width={120} height={60} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" loading="lazy" /></a>
              <br/>
            </div>
          </div>
        </section>

      </main>
    </>
  );
} 