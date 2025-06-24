"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from 'next/image';

export default function TermsPage(): React.FC {
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

  const termsSections = [
    {
      icon: <Image src="/assets/images/icon-file.svg" alt="Fichier" width={32} height={32} className="text-primary" />, 
      title: "Acceptation des Conditions",
      description:
        "En accédant et en utilisant les services DazLng, vous acceptez d'être lié par ces Conditions d'Utilisation. Si vous n'êtes pas d'accord, veuillez ne pas utiliser nos services.",
    },
    {
      icon: <Image src="/assets/images/icon-shield.svg" alt="Bouclier" width={32} height={32} className="text-secondary" />, 
      title: "Responsabilités de l'Utilisateur",
      description:
        "Vous êtes responsable de la sécurité de votre compte, de vos clés privées et de toutes les activités qui se produisent sous votre compte.",
    },
    {
      icon: <Image src="/assets/images/icon-alert.svg" alt="Alerte" width={32} height={32} className="text-warning" />, 
      title: "Limitations du Service",
      description:
        "Nos services sont fournis 'tels quels' sans garanties. Nous ne sommes pas responsables des pertes encourues lors de l'utilisation de notre plateforme.",
    },
  ];

  const allowedActivities = [
    {
      icon: <Image src="/assets/images/icon-check.svg" alt="Valide" width={22} height={22} className="text-green-500" />,
      text: "Utiliser la plateforme pour des transactions légitimes sur le Lightning Network",
    },
    {
      icon: <Image src="/assets/images/icon-check.svg" alt="Valide" width={22} height={22} className="text-green-500" />,
      text: "Gérer votre propre nœud et vos canaux",
    },
    {
      icon: <Image src="/assets/images/icon-check.svg" alt="Valide" width={22} height={22} className="text-green-500" />,
      text: "Participer à la communauté et fournir des retours d'expérience",
    },
  ];

  const prohibitedActivities = [
    {
      icon: <Image src="/assets/images/icon-x.svg" alt="Interdit" width={22} height={22} className="text-red-500" />,
      text: "S'engager dans des activités illégales ou le blanchiment d'argent",
    },
    {
      icon: <Image src="/assets/images/icon-x.svg" alt="Interdit" width={22} height={22} className="text-red-500" />,
      text: "Tenter de compromettre la sécurité du réseau",
    },
    {
      icon: <Image src="/assets/images/icon-x.svg" alt="Interdit" width={22} height={22} className="text-red-500" />,
      text: "Utiliser le service pour du spam ou des activités malveillantes",
    },
  ];

  return (
    <>
      {/* HERO */}
      <div className="min-h-screen relative bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="relative z-8 text-center space-y-8">
          <Image
            src="/assets/images/logo-daznode.svg"
            alt="Daznode"
            width={200}
            height={80}
            className="h-16 md:h-20 w-auto mx-auto"
          />
          
          <h1 className="text-4xl md:text-6xl font-bold text-white animate-fade-in">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">Conditions d'Utilisation</span>
          </h1>
          
          <div 
            className="max-w-3xl mx-auto bg-indigo-700/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-indigo-500/50" 
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">
              Veuillez lire attentivement
            </h3>
            
            <h4 className="text-lg md:text-xl leading-relaxed mb-4 bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">
              Ces conditions régissent votre utilisation des services DazLng et définissent vos droits et responsabilités.
            </h4>
          </div>
          
          <div className="mt-12 md:mt-16 flex justify-center">
            <button 
              onClick={() => {
                window.scrollTo({
                  top: document.getElementById('terms-content')?.offsetTop || 0,
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
      
      {/* CONTENU */}
      <main id="terms-content" className="min-h-screen w-full overflow-x-hidden font-sans">
        <section className="relative w-full bg-gradient-to-r from-yellow-600 to-purple-700 text-white rounded-xl p-6 shadow-lg border border-indigo-500/50">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text" data-aos="fade-up">
              Sections Principales
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {termsSections.map((section: any, idx: any) => (
                <div 
                  key={idx} 
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
                  data-aos="fade-up"
                  data-aos-delay={200 + idx * 100}
                >
                  <div className="mb-4 flex justify-center">{section.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-center text-yellow-300">{section.title}</h3>
                  <p className="text-white/90 text-center">{section.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-transparent">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-400 via-cyan-500 to-indigo-500 rounded-2xl shadow-xl overflow-hidden" data-aos="fade-right">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Activités Autorisées</h3>
                  <ul className="space-y-4">
                    {allowedActivities.map((item: any, idx: any) => (
                      <li key={idx} className="flex items-start bg-white/10 p-4 rounded-xl">
                        <span className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                        <span className="text-white">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-2xl shadow-xl overflow-hidden" data-aos="fade-left">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Activités Interdites</h3>
                  <ul className="space-y-4">
                    {prohibitedActivities.map((item: any, idx: any) => (
                      <li key={idx} className="flex items-start bg-white/10 p-4 rounded-xl">
                        <span className="bg-red-100 p-1 rounded-full mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </span>
                        <span className="text-white">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          </div>
          <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center" data-aos="fade-up">Modifications du Service</h2>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-indigo-100 text-center" data-aos="fade-up" data-aos-delay="100">
                Nous nous réservons le droit de modifier ou d'interrompre toute partie de nos services à tout moment. Nous informerons des changements importants via notre plateforme ou par email.
              </p>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-indigo-100 text-center" data-aos="fade-up" data-aos-delay="200">
                Votre utilisation continue de nos services après toute modification indique votre acceptation des conditions mises à jour.
              </p>
              <div className="flex justify-center mt-12" data-aos="fade-up" data-aos-delay="300">
                <p className="text-sm text-indigo-200">
                  Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
};
}
