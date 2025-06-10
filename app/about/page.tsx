"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos | DazNode - Notre mission Lightning Network',
  description: 'Découvrez l\'histoire de DazNode, notre équipe d\'experts Bitcoin et notre mission : démocratiser l\'accès au Lightning Network avec des solutions innovantes et sécurisées.',
  keywords: ['à propos DazNode', 'équipe Bitcoin', 'mission Lightning Network', 'histoire crypto', 'experts blockchain', 'innovation Bitcoin', 'startup Lightning'],
  openGraph: {
    title: 'À propos de DazNode | Notre mission Lightning Network',
    description: 'Découvrez notre équipe d\'experts Bitcoin et notre mission : démocratiser l\'accès au Lightning Network avec des solutions innovantes.',
    url: 'https://dazno.de/about',
    images: [
      {
        url: 'https://dazno.de/assets/images/about-og.png',
        width: 1200,
        height: 630,
        alt: 'À propos de DazNode'
      }
    ]
  },
  alternates: {
    canonical: 'https://dazno.de/about'
  }
};

export default function AboutPage(): React.ReactElement {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      AOS.init({ 
        once: false,
        duration: 800,
        easing: 'ease-out-cubic',
        mirror: true,
        anchorPlacement: 'top-bottom'
      });
    }
  }, []);

  return (
    <>
      {/* HERO */}
      <div className="min-h-[60vh] relative bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="relative z-8 text-center space-y-8 max-w-4xl">
          <Image
            src="/assets/images/logo-daznode.svg"
            alt="Daznode"
            width={200}
            height={80}
            className="h-16 md:h-20 w-auto mx-auto"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-white animate-fade-in">
            À propos de <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">Dazno.de</span>
          </h1>
          
          {/* Bloc texte d'introduction avec zoom-in */}
          <div 
            className="max-w-3xl mx-auto bg-indigo-700/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-indigo-500/50" 
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            <p className="text-lg md:text-xl leading-relaxed text-white">
              Bienvenue sur <strong>Dazno.de</strong>, la plateforme innovante dédiée à la simplification de vos paiements et de votre gestion financière.
              Notre mission est de rendre les transactions numériques accessibles, sécurisées et transparentes pour tous, particuliers comme professionnels.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="min-h-screen w-full overflow-x-hidden font-sans pb-20">
        <div className="container mx-auto px-4 py-16">
          <section className="mb-16" data-aos="fade-up">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 md:mb-12 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-3xl font-bold text-indigo-600 mb-6">Notre histoire</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Fondée en 2024 par une équipe passionnée de technologie et de finance, Dazno.de est née d'un constat simple : les solutions de paiement existantes étaient souvent complexes, coûteuses ou peu adaptées aux besoins réels des utilisateurs.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Nous avons donc décidé de créer une plateforme moderne, intuitive et fiable, qui place l'utilisateur au centre de ses priorités.
                  </p>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-100 rounded-2xl transform -rotate-6"></div>
                  <div className="relative bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center">
                    <Image
                      alt="Notre équipe"
                      src="/assets/images/dazia-illustration.png"
                      width={400}
                      height={250}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16" data-aos="fade-up" data-aos-delay="100">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-purple-600 mb-6">Nos valeurs</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-600" data-aos="fade-up" data-aos-delay="200">
                    <h3 className="font-bold text-xl mb-2 text-purple-900">Innovation</h3>
                    <p className="text-gray-700">Nous investissons continuellement dans la recherche et le développement pour offrir des fonctionnalités à la pointe de la technologie.</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-indigo-600" data-aos="fade-up" data-aos-delay="300">
                    <h3 className="font-bold text-xl mb-2 text-indigo-900">Sécurité</h3>
                    <p className="text-gray-700">La protection de vos données et de vos transactions est notre priorité absolue.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-pink-600" data-aos="fade-up" data-aos-delay="400">
                    <h3 className="font-bold text-xl mb-2 text-pink-900">Transparence</h3>
                    <p className="text-gray-700">Pas de frais cachés, pas de mauvaises surprises. Nous croyons en une communication claire et honnête.</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-yellow-600" data-aos="fade-up" data-aos-delay="500">
                    <h3 className="font-bold text-xl mb-2 text-yellow-900">Accessibilité</h3>
                    <p className="text-gray-700">Notre interface est pensée pour être simple d'utilisation, quel que soit votre niveau d'expertise.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16" data-aos="fade-up" data-aos-delay="100">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-emerald-600 mb-8">Notre équipe</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-100 rounded-2xl transform -rotate-6"></div>
                  <div className="relative bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center h-full">
                    <Image
                      alt="Notre équipe"
                      src="/assets/images/dazia-illustration.png"
                      width={400}
                      height={250}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Dazno.de, c'est avant tout une équipe soudée, composée d'experts en développement logiciel, en cybersécurité et en expérience utilisateur.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Nous sommes à votre écoute pour améliorer sans cesse nos services.
                  </p>
                  <div className="pt-6">
                    <a className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors duration-200 shadow-lg" href="/contact">
                      <span>Rejoindre l'équipe</span>
                      <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section data-aos="fade-up" data-aos-delay="100">
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white overflow-hidden rounded-2xl shadow-xl">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
              </div>
              <div className="relative p-8">
                <h2 className="text-3xl font-bold mb-6">Nous contacter</h2>
                <p className="text-xl mb-8">
                  Une question ? Une suggestion ? N'hésitez pas à nous écrire ou utiliser notre formulaire de contact.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-900 bg-white rounded-xl hover:bg-indigo-50 transition-all duration-200" href="mailto:contact@dazno.de">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    contact@dazno.de
                  </a>
                  <a className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white/10 rounded-xl transition-all duration-200" href="/contact">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    Formulaire de contact
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
