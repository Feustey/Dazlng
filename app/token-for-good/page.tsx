"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

export default function TokenForGoodPage(): React.ReactElement {
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
    <div className="overflow-hidden">
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
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12" data-aos="fade-up" data-aos-delay="100">
            La blockchain au service de l'impact social et environnemental positif
          </p>
          
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

      {/* Section verte avec le contenu principal */}
      <section id="why-join" className="bg-[#2b7a43] py-20 text-white pt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center" data-aos="fade-up">
            Pourquoi rejoindre Token for Good ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-[#3b8953]/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl font-bold mb-4 text-yellow-300">Étudiants</h3>
              <p className="text-lg">Rejoignez un réseau engagé et développez vos compétences tout en contribuant à des causes importantes.</p>
            </div>
            
            <div className="bg-[#3b8953]/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-2xl font-bold mb-4 text-yellow-300">Alumni</h3>
              <p className="text-lg">Restez connectés à votre communauté et soutenez la nouvelle génération d'innovateurs sociaux.</p>
            </div>
            
            <div className="bg-[#3b8953]/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-2xl font-bold mb-4 text-yellow-300">Corporate / Écoles</h3>
              <p className="text-lg">Valorisez votre impact RSE et engagez vos collaborateurs dans des actions concrètes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="bg-gradient-to-r from-orange-400 to-[#F7931A] py-12 rounded-2xl mb-10 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ils ont rejoint Token for Good</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {/* Témoignage 1 */}
            <div className="bg-white/20 rounded-2xl p-6 shadow flex-1">
              <p className="italic mb-4 text-white/90">"Je trouve l'initiative Token for Good intéressante d'utiliser des technologies digitales pour permettre au plus grand nombre des acteurs du réseau lightning de participer à la décentralisation et faciliter les paiements sans contrainte"</p>
              <div className="flex items-center gap-3">
                <Image src="/assets/images/avatar-jerome.png" alt="Avatar Jérôme" width={40} height={40} className="rounded-full" />
                <div>
                  <div className="font-bold text-white">Edouard Minaget</div>
                  <div className="text-sm text-white/80">Node owner</div>
                </div>
              </div>
            </div>
            {/* Témoignage 2 */}
            <div className="bg-white/20 rounded-2xl p-6 shadow flex-1">
              <p className="italic mb-4 text-white/90">"Le mentoring est un accélérateur de compétences. Cela permet de se connecter par rapport à des besoins spécifiques et d'aller chercher de manière plus directe les expériences des autres."</p>
              <div className="flex items-center gap-3">
                <Image src="/assets/images/avatar-leaticia.png" alt="Avatar Leaticia" width={40} height={40} className="rounded-full" />
                <div>
                  <div className="font-bold text-white">Laeticia de Centralise</div>
                  <div className="text-sm text-white/80">Network & Development Expert</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Communauté engagée */}
      <section className="container mx-auto py-12 px-4 rounded-2xl mb-10 bg-white shadow">
        <h2 className="text-3xl font-bold text-center mb-8">Une communauté engagée</h2>
        <p className="text-center max-w-2xl mx-auto mb-8">
          En faisant partie et en contribuant à la plateforme Token For Good, vous aiderez d'autres utilisateurs et acteurs de la décentralisation du réseau lightning : Créez un profil, collectez des tokens, gagnez en visibilité, obtenez des certifications et bien d'autres avantages encore.
        </p>
        <div className="flex justify-center">
          <a href="#" className="bg-[#1a1a1a] text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-[#333] transition">S'inscrire</a>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white py-8 rounded-2xl mb-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">Newsletter</h2>
          <p className="text-center mb-6">Chaque semaine, toute l'actualité de la communauté !</p>
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