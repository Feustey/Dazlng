"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

export default function TokenForGoodPage(): React.FC {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      AOS.init({ 
        once: true, 
        duration: 800
      });

      // Script pour le défilement fluide
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(this: HTMLAnchorElement, e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (targetId) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              window.scrollTo({
                top: targetElement.getBoundingClientRect().top + window.scrollY,
                behavior: 'smooth'
              });
            }
          }
        });
      });
    }
  }, []);

  return (
    <div className="overflow-hidden relative">
      {/* CTA sticky */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="https://app.token-for-good.com/login" target="_blank" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-indigo-900 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition text-lg flex items-center gap-2">
          🚀 Rejoindre la communauté
        </Link>
      </div>
      {/* Hero Section avec fond violet */}
      <section className="bg-gradient-to-b from-indigo-600 to-indigo-700 text-white pb-24 pt-10 relative">
        <div className="container mx-auto px-4 text-center">
          {/* Logo SVG */}
          <div className="flex justify-center mb-8" data-aos="fade-down">
            <Image
              src="/assets/images/logo-token-for-good.jpeg"
              alt="Token for Good Logo"
              width={180}
              height={60}
              className="h-14 w-auto"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6" data-aos="fade-up">
            Token for Good
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
            La plus grande communauté francophone de node runners Bitcoin
          </p>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6 text-indigo-200" data-aos="fade-up" data-aos-delay="200">
            Rejoignez +500 passionnés qui s'entraident pour maximiser leurs revenus Lightning Network
          </p>
          {/* Teasing gamification */}
          <div className="mb-6" data-aos="fade-up" data-aos-delay="250">
            <span className="inline-block bg-yellow-400 text-indigo-900 font-bold px-4 py-2 rounded-full shadow">
              🎁 1 T4G offert à l'inscription &nbsp;|&nbsp; 🏅 Débloquez votre premier badge dès l'inscription !
            </span>
          </div>
          {/* CTA principal Hero */}
          <Link href="https://app.token-for-good.com/login" target="_blank" className="inline-flex items-center justify-center w-auto h-14 rounded-full bg-white text-indigo-700 shadow-lg hover:bg-opacity-90 transition-all duration-300 text-xl font-bold px-8 mb-4">
            🚀 Rejoindre la communauté
          </Link>
          {/* Flèche de défilement vers la section "Pourquoi rejoindre" */}
          <a 
            href="#why-join" 
            className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-indigo-700 shadow-lg hover:bg-opacity-90 transition-all duration-300 animate-bounce"
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
        
        {/* Vague de transition violet → blanc */}
        <div className="absolute bottom-0 left-0 right-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,128L80,112C160,96,320,64,480,64C640,64,800,96,960,106.7C1120,117,1280,107,1360,101.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Section blanche minimisée */}
      <section className="bg-white" style={{ height: '60px' }}>
        <div className="container mx-auto relative">
          {/* Vague de transition blanc → vert */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160" className="w-full absolute bottom-0 left-0">
            <path fill="#2b7a43" fillOpacity="1" d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Section verte avec le contenu principal amélioré */}
      <section id="why-join" className="bg-[#2b7a43] py-20 text-white pt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center" data-aos="fade-up">
            Pourquoi rejoindre Token for Good ?
          </h2>
          
          {/* Teasing gamification section avantages */}
          <div className="flex justify-center mb-8">
            <span className="inline-block bg-yellow-400 text-indigo-900 font-bold px-4 py-2 rounded-full shadow">
              🏅 Débloquez votre premier badge dès l'inscription !
            </span>
          </div>
          {/* CTA section avantages */}
          <div className="flex justify-center mb-8">
            <Link href="https://app.token-for-good.com/login" target="_blank" className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl shadow hover:bg-gray-100 transition text-lg">
              🚀 Rejoindre la communauté
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-[#3b8953]/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">💰</span>
                <h3 className="text-2xl font-bold text-yellow-300">Node Runners Débutants</h3>
              </div>
              <p className="text-lg mb-4">Apprenez à générer vos premiers revenus passifs avec Bitcoin Lightning.</p>
              <ul className="text-sm space-y-2 text-green-200">
                <li>• Formation complète de A à Z</li>
                <li>• Mentor personnel assigné</li>
                <li>• Objectif : 50€/mois en 3 mois</li>
              </ul>
            </div>
            
            <div className="bg-[#3b8953]/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🚀</span>
                <h3 className="text-2xl font-bold text-yellow-300">Node Runners Experts</h3>
              </div>
              <p className="text-lg mb-4">Maximisez vos revenus et partagez votre expertise avec la communauté.</p>
              <ul className="text-sm space-y-2 text-green-200">
                <li>• Stratégies avancées de routing</li>
                <li>• Programme de mentorat</li>
                <li>• Revenus moyens : 200€+/mois</li>
              </ul>
            </div>
            
            <div className="bg-[#3b8953]/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🏢</span>
                <h3 className="text-2xl font-bold text-yellow-300">Entreprises</h3>
              </div>
              <p className="text-lg mb-4">Intégrez Bitcoin Lightning dans votre infrastructure avec notre support.</p>
              <ul className="text-sm space-y-2 text-green-200">
                <li>• Solutions sur mesure</li>
                <li>• Formation équipes</li>
                <li>• Support technique dédié</li>
              </ul>
            </div>
          </div>
          
          {/* Nouvelles métriques communauté */}
          <div className="mt-16 bg-[#1f5f32] rounded-2xl p-8" data-aos="fade-up">
            <h3 className="text-2xl font-bold text-center mb-8 text-yellow-300">
              La communauté en chiffres
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-green-200 text-sm">Membres actifs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">127€</div>
                <div className="text-green-200 text-sm">Revenus moyens/mois</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400">15min</div>
                <div className="text-green-200 text-sm">Temps de réponse</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <div className="text-green-200 text-sm">Support Discord</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages améliorés */}
      <section className="bg-gradient-to-r from-orange-400 to-[#F7931A] py-12 rounded-2xl mb-10 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Témoignages de la communauté</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Témoignage 1 */}
            <div className="bg-white/20 rounded-2xl p-6 shadow">
              <p className="italic mb-4 text-white/90">"Revenus moyens : 127€/mois. La communauté DazNode m'a aidé à optimiser mes canaux dès le premier mois. L'entraide est exceptionnelle !"</p>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/assets/images/avatar-male.svg" alt="Avatar Jean" width={40} height={40} className="rounded-full" />
                <div>
                  <div className="font-bold text-white">Jean D.</div>
                  <div className="text-sm text-white/80">Node Runner depuis 8 mois</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <div>
                  <div className="font-bold text-yellow-300">127€</div>
                  <div className="text-white/70">Revenus/mois</div>
                </div>
                <div>
                  <div className="font-bold text-green-300">19.2%</div>
                  <div className="text-white/70">ROI annuel</div>
                </div>
              </div>
            </div>
            
            {/* Témoignage 2 */}
            <div className="bg-white/20 rounded-2xl p-6 shadow">
              <p className="italic mb-4 text-white/90">"J'ai quitté mon job grâce aux revenus de mes 3 nœuds DazNode. La communauté partage toutes les stratégies gagnantes."</p>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/assets/images/avatar-female.svg" alt="Avatar Marie" width={40} height={40} className="rounded-full" />
                <div>
                  <div className="font-bold text-white">Marie L.</div>
                  <div className="text-sm text-white/80">Ex-développeuse devenue node runner</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <div>
                  <div className="font-bold text-yellow-300">340€</div>
                  <div className="text-white/70">Revenus/mois</div>
                </div>
                <div>
                  <div className="font-bold text-green-300">3 nœuds</div>
                  <div className="text-white/70">Portfolio</div>
                </div>
              </div>
            </div>
            
            {/* Témoignage 3 */}
            <div className="bg-white/20 rounded-2xl p-6 shadow">
              <p className="italic mb-4 text-white/90">"Le mentoring est un accélérateur de compétences. Cela permet de se connecter par rapport à des besoins spécifiques et d'aller chercher de manière plus directe les expériences des autres."</p>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/assets/images/avatar-leaticia.png" alt="Avatar Leaticia" width={40} height={40} className="rounded-full" />
                <div>
                  <div className="font-bold text-white">Laeticia de Centralise</div>
                  <div className="text-sm text-white/80">Network & Development Expert</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <div>
                  <div className="font-bold text-yellow-300">Expert</div>
                  <div className="text-white/70">Niveau</div>
                </div>
                <div>
                  <div className="font-bold text-green-300">Mentor</div>
                  <div className="text-white/70">Rôle</div>
                </div>
              </div>
            </div>
          </div>
          {/* CTA sous témoignages */}
          <div className="flex justify-center mt-8">
            <Link href="https://app.token-for-good.com/login" target="_blank" className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl shadow hover:bg-gray-100 transition text-lg">
              🚀 Rejoindre la communauté
            </Link>
          </div>
          {/* Mini-leaderboard public */}
          <div className="mt-12 bg-white/20 rounded-2xl p-6 shadow text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">Top mentors du mois</h3>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="flex flex-col items-center">
                <Image src="/assets/images/avatar-male.svg" alt="Avatar Jean" width={40} height={40} className="rounded-full mb-1" />
                <span className="font-bold text-white">Jean D.</span>
                <span className="text-yellow-200 text-sm">12 aides</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src="/assets/images/avatar-female.svg" alt="Avatar Marie" width={40} height={40} className="rounded-full mb-1" />
                <span className="font-bold text-white">Marie L.</span>
                <span className="text-yellow-200 text-sm">10 aides</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src="/assets/images/avatar-leaticia.png" alt="Avatar Leaticia" width={40} height={40} className="rounded-full mb-1" />
                <span className="font-bold text-white">Laeticia</span>
                <span className="text-yellow-200 text-sm">8 aides</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Communauté engagée améliorée */}
      <section className="container mx-auto py-12 px-4 rounded-2xl mb-10 bg-white shadow">
        <h2 className="text-3xl font-bold text-center mb-8">Comment fonctionne la communauté ?</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📚</span>
              <h3 className="text-xl font-bold text-indigo-900">Formation & Mentorat</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Formations vidéo exclusives</li>
              <li>• Mentorat 1-on-1 personnalisé</li>
              <li>• Webinaires mensuels avec experts</li>
              <li>• Base de connaissances collaborative</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">💬</span>
              <h3 className="text-xl font-bold text-green-900">Entraide & Support</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Discord privé 24/7</li>
              <li>• Réponse moyenne : 15 minutes</li>
              <li>• Experts bénévoles disponibles</li>
              <li>• Canaux spécialisés par niveau</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📊</span>
              <h3 className="text-xl font-bold text-orange-900">Partage de Stratégies</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Stratégies de routing en temps réel</li>
              <li>• Alertes opportunités de marché</li>
              <li>• Analyses de performance</li>
              <li>• Retours d'expérience détaillés</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🏆</span>
              <h3 className="text-xl font-bold text-purple-900">Reconnaissance & Rewards</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Programme de parrainage (10%)</li>
              <li>• Badges de progression</li>
              <li>• Challenges mensuels</li>
              <li>• Certifications officielles</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Prêt à rejoindre +500 node runners ?</h3>
          <p className="text-lg mb-6 text-indigo-100">
            Commencez votre parcours vers l'indépendance financière avec Bitcoin Lightning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://app.token-for-good.com/login" className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 transition">
              🚀 Rejoindre gratuitement
            </a>
            <a href="https://discord.gg/daznode" className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition">
              💬 Discord Communauté
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white py-8 rounded-2xl mb-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">Newsletter</h2>
          <p className="text-center mb-6 font-semibold text-indigo-700">Rejoignez +500 node runners et recevez chaque semaine les meilleures astuces Lightning !</p>
          <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
            <input type="email" placeholder="Votre email" className="flex-1 px-4 py-2 border rounded" />
            <button type="submit" className="bg-[#1a1a1a] text-white px-6 py-2 rounded font-semibold">S'inscrire</button>
          </form>
        </div>
      </section>

      {/* Partenaires */}
 
    </div>
  );
}
