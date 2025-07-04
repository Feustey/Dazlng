"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const dynamic = "force-dynamic";

export default function TermsPage() {
  const { t } = useAdvancedTranslation("terms");

  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({ 
        once: false,
        duration: 800,
        easing: "ease-out-cubic",
        mirror: true,
        anchorPlacement: "top-bottom"
      });
    }
  }, []);

  const termsSections = [
    {
      icon: <div className="w-12 h-12 bg-yellow-300 rounded-lg flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>,
      title: "Acceptation des Conditions",
      description: "En utilisant nos services, vous acceptez d'être lié par ces Conditions d'Utilisation. Si vous n'êtes pas d'accord, veuillez ne pas utiliser nos services."
    },
    {
      icon: <div className="w-12 h-12 bg-yellow-300 rounded-lg flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>,
      title: "Responsabilités de l'Utilisateur",
      description: "Vous êtes responsable de maintenir la confidentialité de vos informations de connexion et de toutes les activités qui se produisent sous votre compte."
    },
    {
      icon: <div className="w-12 h-12 bg-yellow-300 rounded-lg flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>,
      title: "Limitations du Service",
      description: "Nos services sont fournis tels quels sans garanties. Nous ne sommes pas responsables des pertes encourues lors de l'utilisation de notre plateforme."
    }
  ];

  const allowedActivities = [
    {
      icon: <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>,
      text: "Utiliser la plateforme pour vos transactions Lightning"
    },
    {
      icon: <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>,
      text: "Gérer votre portefeuille et vos canaux"
    },
    {
      icon: <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>,
      text: "Participer à la communauté et partager votre expérience"
    }
  ];

  const prohibitedActivities = [
    {
      icon: <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>,
      text: "S'engager dans des activités illégales ou le blanchiment d'argent"
    },
    {
      icon: <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>,
      text: "Tenter de compromettre la sécurité de la plateforme"
    },
    {
      icon: <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>,
      text: "Utiliser le service pour harceler ou spammer d'autres utilisateurs"
    }
  ];

  return (
    <>
      {/* HERO */}
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <Image
            src="/assets/images/logo-daznode-white.svg"
            alt="DazNode"
            width={80}
            height={80}
            className="mx-auto mb-8"
          />
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">
              {t("common.conditions_dutilisation")}
            </span>
          </h1>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Veuillez lire attentivement
            </h3>
            
            <h4 className="text-lg text-gray-300 max-w-2xl mx-auto">
              Ces conditions régissent votre utilisation des services DazLng et définissent vos droits et responsabilités.
            </h4>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => {
                window.scrollTo({
                  top: document.getElementById("terms-content")?.offsetTop || 0,
                  behavior: "smooth"
                });
              }}
              className="group flex flex-col items-center text-yellow-300 hover:text-yellow-200 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <div className="relative overflow-hidden mb-2">
                <span className="inline-block transform group-hover:-translate-y-full transition-transform duration-300 ease-in-out">
                  {t("common.decouvrir")}
                </span>
                <span className="inline-block transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out absolute left-0 top-0">
                  Explorer
                </span>
              </div>
              <div className="animate-bounce">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* CONTENU */}
      <main id="terms-content" className="bg-gray-900 text-white">
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
              Sections Principales
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {termsSections.map((section: any, idx: number) => (
                <div key={idx} className="text-center" data-aos="fade-up" data-aos-delay={idx * 200}>
                  <div className="mb-4 flex justify-center">{section.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-center text-yellow-300">{section.title}</h3>
                  <p className="text-white/90 text-center">{section.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">{t("common.activites_autorisees")}</h3>
                  <ul className="space-y-4">
                    {allowedActivities.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <span className="flex-shrink-0">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                        <span className="text-white">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">{t("common.activites_interdites")}</h3>
                  <ul className="space-y-4">
                    {prohibitedActivities.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <span className="flex-shrink-0">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center" data-aos="fade-up">
                {t("common.modifications_du_service")}
              </h2>
              <p className="text-lg text-gray-300 mb-4">
                Nous nous réservons le droit de modifier ou d'interrompre toute partie de nos services à tout moment. Nous informerons des changements importants via notre plateforme ou par email.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Votre utilisation continue de nos services après toute modification indique votre acceptation des conditions mises à jour.
              </p>
              <div className="text-sm text-gray-400">
                <p>
                  Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
