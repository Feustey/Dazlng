"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from 'next/image';

export default function HelpPage(): React.ReactElement {
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

  const faqCategories = [
    {
      icon: <Image src="/assets/images/icon-box.svg" alt="Boîte" width={32} height={32} className="text-primary object-contain" />, 
      title: "Dazbox",
      description: "Questions sur l'installation et l'utilisation de votre nœud Lightning clé en main",
    },
    {
      icon: <Image src="/assets/images/icon-node.svg" alt="Nœud" width={32} height={32} className="text-secondary object-contain" />, 
      title: "Umbrel",
      description: "Aide sur le système d'exploitation et les applications disponibles",
    },
    {
      icon: <Image src="/assets/images/icon-lightning.svg" alt="Lightning" width={32} height={32} className="text-warning object-contain" />, 
      title: "Lightning Network",
      description: "Comprendre et optimiser vos canaux et transactions sur le Lightning Network",
    },
  ];

  const faqQuestions = [
    {
      question: "Qu'est-ce que Dazbox et à quoi ça sert ?",
      answer: "Dazbox est un nœud Lightning Network prêt à l'emploi qui vous permet de participer au réseau Bitcoin sans expertise technique. Il vous permet de recevoir et envoyer des paiements en bitcoin rapidement et à faible coût, de gérer vos canaux Lightning simplement, et d'accéder à votre nœud depuis n'importe quel appareil connecté à Internet.",
      category: "Dazbox"
    },
    {
      question: "Comment installer ma Dazbox ?",
      answer: "L'installation de Dazbox est ultra simple : branchez l'alimentation, connectez le câble Ethernet à votre box internet, et attendez que les LED s'allument. Ensuite, suivez le guide de configuration initial en vous connectant à l'interface web via l'adresse affichée sur l'écran de votre Dazbox. L'installation complète prend environ 5 minutes.",
      category: "Dazbox"
    },
    {
      question: "Comment ouvrir mon premier canal Lightning ?",
      answer: "Pour ouvrir votre premier canal, accédez à l'interface de gestion de Dazbox, allez dans la section 'Lightning', puis 'Canaux'. Cliquez sur 'Ouvrir un canal', entrez l'adresse du nœud avec lequel vous souhaitez vous connecter, définissez le montant à allouer au canal, et confirmez. Daznode peut automatiquement suggérer des nœuds fiables pour vos premiers canaux.",
      category: "Lightning Network"
    },
    {
      question: "Comment recevoir un paiement avec ma Dazbox ?",
      answer: "Pour recevoir un paiement, accédez à l'interface Lightning, cliquez sur 'Recevoir', puis définissez le montant souhaité. Un QR code et une adresse Lightning seront générés. Partagez-les avec la personne qui doit vous payer. Important : vous devez disposer de capacité entrante suffisante dans vos canaux pour recevoir des paiements.",
      category: "Lightning Network"
    },
    {
      question: "Qu'est-ce qu'Umbrel et comment fonctionne-t-il avec Dazbox ?",
      answer: "Umbrel est le système d'exploitation qui équipe votre Dazbox. Il offre une interface conviviale pour gérer votre nœud Bitcoin et Lightning, ainsi qu'un magasin d'applications pour installer facilement des services supplémentaires. Dazbox utilise Umbrel en arrière-plan, mais avec des optimisations personnalisées et l'intégration de Dazia, notre assistant IA.",
      category: "Umbrel"
    },
    {
      question: "Quelles applications puis-je installer sur ma Dazbox ?",
      answer: "Grâce à Umbrel, vous pouvez installer de nombreuses applications : BTCPay Server pour les paiements marchands, Ride The Lightning ou Thunderhub pour la gestion avancée de Lightning, Mempool pour visualiser les transactions Bitcoin, ou encore des applications comme NextCloud pour le stockage de fichiers, et bien d'autres. Toutes sont accessibles depuis le magasin d'applications intégré.",
      category: "Umbrel"
    },
    {
      question: "Comment sécuriser mon nœud Dazbox ?",
      answer: "Pour sécuriser votre nœud : utilisez un mot de passe fort, conservez votre phrase de récupération (seed) dans un endroit sûr et hors ligne, activez l'authentification à deux facteurs, effectuez régulièrement des sauvegardes de vos canaux, et maintenez votre Dazbox à jour. N'oubliez pas que la sécurité de vos bitcoins dépend de ces précautions.",
      category: "Dazbox"
    },
    {
      question: "Comment optimiser mes canaux Lightning pour maximiser les revenus ?",
      answer: "Pour optimiser vos canaux : diversifiez vos connexions avec des nœuds bien connectés, équilibrez la capacité entrante et sortante, ajustez vos frais en fonction de l'activité du réseau, et utilisez la fonctionnalité Dazia qui analyse automatiquement le réseau et suggère des optimisations pour votre nœud. Les revenus dépendent de la qualité de vos canaux et du volume de transactions qu'ils traitent.",
      category: "Lightning Network"
    },
    {
      question: "Comment gérer les mises à jour de ma Dazbox ?",
      answer: "Les mises à jour de Dazbox se font automatiquement ou manuellement depuis l'interface web. Accédez à 'Paramètres', puis 'Mises à jour' pour vérifier si une nouvelle version est disponible. Il est recommandé de sauvegarder vos données avant toute mise à jour importante. Daznode envoie des notifications par email pour les mises à jour critiques.",
      category: "Dazbox"
    },
    {
      question: "Comment lier ma Dazbox à mon application mobile ?",
      answer: "Pour lier votre Dazbox à l'application mobile, ouvrez l'application Daznode sur votre smartphone, allez dans 'Ajouter un nœud', puis scannez le QR code disponible dans l'interface web de votre Dazbox (section 'Paramètres' > 'Accès distant'). Vous pourrez ainsi gérer votre nœud et vos paiements en déplacement.",
      category: "Dazbox"
    },
    {
      question: "Comment installer de nouvelles applications sur Umbrel ?",
      answer: "Pour installer de nouvelles applications, connectez-vous à l'interface web de votre Dazbox, accédez à la section 'App Store', parcourez les applications disponibles ou utilisez la recherche, puis cliquez sur 'Installer' pour l'application désirée. L'installation se fait automatiquement et l'application sera disponible dans votre tableau de bord une fois terminée.",
      category: "Umbrel"
    },
    {
      question: "Que faire en cas de problème avec ma Dazbox ?",
      answer: "En cas de problème : consultez d'abord la documentation en ligne sur docs.dazno.de, vérifiez que votre Dazbox est bien connectée à Internet et correctement alimentée, redémarrez-la si nécessaire. Si le problème persiste, contactez le support via l'application ou à support@dazno.de en précisant le numéro de série de votre appareil et la nature du problème rencontré.",
      category: "Dazbox"
    }
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
            <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">Centre d'Aide</span>
          </h1>
          
          <div 
            className="max-w-3xl mx-auto bg-indigo-700/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-indigo-500/50" 
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">
              Besoin d'aide avec votre Dazbox ?
            </h3>
            
            <h4 className="text-lg md:text-xl leading-relaxed mb-4 bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">
              Nous avons rassemblé les questions les plus fréquentes pour vous aider à profiter pleinement de votre nœud Lightning.
            </h4>
          </div>
          
          <div className="mt-12 md:mt-16 flex justify-center">
            <button 
              onClick={() => {
                window.scrollTo({
                  top: document.getElementById('help-content')?.offsetTop || 0,
                  behavior: 'smooth'
                });
              }}
              className="group flex flex-col items-center text-yellow-300 hover:text-yellow-200 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <div className="overflow-hidden relative h-6">
                <span className="inline-block transform group-hover:-translate-y-full transition-transform duration-300 ease-in-out">Explorer</span>
                <span className="inline-block transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out absolute left-0 top-0">Découvrir</span>
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
      <main id="help-content" className="min-h-screen w-full overflow-x-hidden font-sans">
        <section className="relative w-full bg-gradient-to-r from-yellow-600 to-purple-700 text-white rounded-xl p-6 shadow-lg border border-indigo-500/50">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text" data-aos="fade-up">
              Catégories d'Aide
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {faqCategories.map((category, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
                  data-aos="fade-up"
                  data-aos-delay={200 + idx * 100}
                >
                  <div className="mb-4 flex justify-center">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-center text-yellow-300">{category.title}</h3>
                  <p className="text-white/90 text-center">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-transparent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600 text-transparent bg-clip-text" data-aos="fade-up">
              Questions Fréquentes
            </h2>
            
            <div className="grid gap-8 max-w-4xl mx-auto">
              {faqQuestions.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/20 shadow-lg hover:shadow-xl transition-all"
                  data-aos="fade-up"
                  data-aos-delay={100 + idx * 50}
                >
                  <div className="flex items-center mb-4">
                    <span className="bg-gradient-to-r from-yellow-300 to-pink-400 text-transparent bg-clip-text text-xl font-bold mr-2">Q:</span>
                    <h3 className="text-xl font-bold text-gray-800">{faq.question}</h3>
                  </div>
                  <div className="pl-8 border-l-2 border-indigo-500/30">
                    <p className="text-gray-600">{faq.answer}</p>
                    <div className="mt-3">
                      <span className="inline-block bg-indigo-600/10 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          </div>
          <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">Besoin de plus d'aide ?</h2>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-indigo-100 text-center" data-aos="fade-up" data-aos-delay="100">
                Notre équipe de support est disponible pour vous aider avec toutes vos questions sur Dazbox et le Lightning Network.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center" data-aos="fade-up" data-aos-delay="200">
                <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-yellow-300 text-indigo-700 hover:bg-yellow-200 rounded-xl transition-all duration-200 shadow-lg">
                  Contacter le Support
                </a>
                <a href="https://docs.dazno.de" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                  Documentation Complète
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
