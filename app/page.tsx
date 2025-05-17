"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./HomeBlocks.module.css";
import Image from 'next/image';

export default function HomePage() {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  // Carrousel témoignages
  const testimonials = [
    {
      quote: "DazNode a transformé notre gestion de données, c'est un vrai game changer !",
      author: "Alice, CEO de Web3Corp"
    },
    {
      quote: "La DazBox est ultra simple à utiliser et super fiable.",
      author: "Bob, CTO de CryptoBiz"
    },
    {
      quote: "Support client réactif et solutions innovantes, je recommande !",
      author: "Claire, Fondatrice de StartChain"
    }
  ];
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const prevTestimonial = () => {
    setDirection('left');
    setTestimonialIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  };
  const nextTestimonial = () => {
    setDirection('right');
    setTestimonialIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));
  };
  // Pour dots
  const goToTestimonial = (idx: number) => {
    setDirection(idx > testimonialIndex ? 'right' : 'left');
    setTestimonialIndex(idx);
  };

  return (
    <main className={styles.main}>
      {/* Intro sans box ni CTA */}
      <section style={{ background: 'none', boxShadow: 'none', borderRadius: 0, padding: '64px 0 32px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: 16, background: 'linear-gradient(90deg, #5d5dfc 0%, #ff5ac8 50%, #ff7b00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Révolutionnez votre business avec DazNode
        </h1>
        <p style={{ fontSize: '1.3rem', color: '#e0e0e0', marginBottom: 32, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
          La plateforme tout-en-un pour propulser votre activité dans le web3, gérer vos nœuds Lightning Network, automatiser vos paiements et sécuriser vos données. Découvrez une nouvelle façon de piloter votre entreprise, sans friction, sans frontières.
        </p>
        <ul className={styles.heroList} style={{ marginTop: 32 }}>
          <li>✔️ Gestion intelligente des canaux Lightning</li>
          <li>✔️ Automatisation des tâches récurrentes</li>
          <li>✔️ Sécurité et souveraineté de vos données</li>
          <li>✔️ Paiements instantanés en crypto & euro</li>
          <li>✔️ Accompagnement humain et support expert</li>
        </ul>
      </section>

      {/* Offre DazBox ensuite */}
      <section id="offre-dazbox" className={`glass ${styles.hero} ${styles.daziaBg}`} data-aos="fade-up" data-aos-delay="100">
        <h2>DazBox : Votre passerelle vers le web3</h2>
        <p>Connectez, stockez, partagez et sécurisez vos données avec la DazBox. Simple, rapide, souverain. Avec DazBox, vous ne faites pas qu'acheter un produit, vous vivez une expérience pensée pour votre sérénité et votre réussite.</p>
        <div className={styles.featuresRow}>
          <div className={styles.featureCard} style={{ "--glow-color": "#ff7b00" } as React.CSSProperties}>
            <h3>Sécurité maximale</h3>
            <p>Vos données sont chiffrées, stockées localement ou dans le cloud selon vos besoins, et restent sous votre contrôle total.</p>
          </div>
          <div className={styles.featureCard} style={{ "--glow-color": "#ff7b00" } as React.CSSProperties}>
            <h3>Partage simplifié</h3>
            <p>Partagez vos fichiers et dossiers en un clic, avec des liens sécurisés et des droits d'accès personnalisés.</p>
          </div>
          <div className={styles.featureCard} style={{ "--glow-color": "#ff7b00" } as React.CSSProperties}>
            <h3>Expérience utilisateur</h3>
            <p>Interface intuitive, installation rapide, support réactif : la DazBox est conçue pour vous simplifier la vie.</p>
          </div>
        </div>
        <a href="/dazbox" className={styles.ctaButton}>Découvrir DazBox<span className={styles.ctaButtonIcon} aria-hidden="true"><svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span></a>
      </section>

      {/* Séparateur wave */}
      <div className={styles.waveSeparator} aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#ff7b00" fillOpacity="0.13"/>
        </svg>
      </div>

      {/* ÉTAGE 1 : DazNode */}
      <section className={`glass ${styles.hero} ${styles.dazboxBg}`} data-aos="fade-up" data-aos-delay="200">
        <h2>DazNode : Gérez vos nœuds Lightning Network en toute simplicité</h2>
        <p>Optimisez vos performances et votre rentabilité avec DazNode. Automatisez la gestion de vos canaux, bénéficiez d'un onboarding humain et d'une garantie d'installation. DazNode, c'est la puissance du Lightning Network sans la complexité technique.</p>
        <div className={styles.featuresRow}>
          <div className={styles.featureCard} style={{ "--glow-color": "#5d5dfc" } as React.CSSProperties}>
            <h3>Automatisation intelligente</h3>
            <p>Équilibrez, ouvrez et fermez vos canaux Lightning sans effort grâce à nos outils intelligents. Concentrez-vous sur votre activité, DazNode s'occupe du reste.</p>
          </div>
          <div className={styles.featureCard} style={{ "--glow-color": "#5d5dfc" } as React.CSSProperties}>
            <h3>Onboarding humain</h3>
            <p>Un accompagnement personnalisé pour une prise en main simple et rassurante, dès le premier jour. Notre équipe vous guide pas à pas.</p>
          </div>
          <div className={styles.featureCard} style={{ "--glow-color": "#5d5dfc" } as React.CSSProperties}>
            <h3>Garantie d'installation</h3>
            <p>Nous nous engageons à ce que tout fonctionne parfaitement, sans stress ni imprévus. Votre sérénité est notre priorité.</p>
          </div>
        </div>
        <a href="/daznode" className={styles.ctaButton}>Découvrir DazNode<span className={styles.ctaButtonIcon} aria-hidden="true"><svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span></a>
      </section>

      <div className={styles.waveSeparator} aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#ff5ac8" fillOpacity="0.13"/>
        </svg>
      </div>

      {/* ÉTAGE 2 : DazIA */}
      <section id="offre-dazia" className={`glass ${styles.hero} ${styles.dazpayBg}`} data-aos="fade-up" data-aos-delay="600">
        <h2>DazIA : L'IA qui booste votre productivité</h2>
        <p>Automatisez vos tâches, générez du contenu, analysez vos données. L'IA au service de votre business, pour aller plus loin, plus vite, plus sereinement.</p>
        <div className={styles.featuresRow}>
          <div className={styles.featureCard} style={{ "--glow-color": "#ff5ac8" } as React.CSSProperties}>
            <h3>Automatisation avancée</h3>
            <p>Libérez-vous des tâches répétitives : DazIA prend en charge l'automatisation de vos process métier.</p>
          </div>
          <div className={styles.featureCard} style={{ "--glow-color": "#ff5ac8" } as React.CSSProperties}>
            <h3>Génération de contenu</h3>
            <p>Créez des rapports, des synthèses, des emails ou des posts en quelques secondes grâce à l'IA générative intégrée.</p>
          </div>
          <div className={styles.featureCard} style={{ "--glow-color": "#ff5ac8" } as React.CSSProperties}>
            <h3>Analyse intelligente</h3>
            <p>Exploitez vos données pour prendre de meilleures décisions, avec des tableaux de bord et des recommandations personnalisées.</p>
          </div>
        </div>
        <a href="/dazia" className={styles.ctaButton}>Essayer DazIA<span className={styles.ctaButtonIcon} aria-hidden="true"><svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span></a>
      </section>

      <div className={styles.waveSeparator} aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#00c9a7" fillOpacity="0.13"/>
        </svg>
      </div>

      {/* ÉTAGE 3 : DazPay */}
      <section id="offre-dazpay" className={`glass ${styles.hero} ${styles.daznodeBg}`} data-aos="fade-up" data-aos-delay="800">
        <h2>DazPay : Paiements instantanés, sans frontières</h2>
        <p>Recevez et envoyez des paiements en crypto ou en euro, en toute simplicité. DazPay connecte votre business au monde, sans friction, sans frontières.</p>
        <div className={styles.featuresRow}>
          <div className={styles.featureCard} style={{ "--glow-color": "#00c9a7" } as React.CSSProperties}>
            <h3>Paiements multi-devises</h3>
            <p>Acceptez et envoyez des paiements en Bitcoin, Lightning, stablecoins ou euros, selon vos besoins.</p>
          </div>
          <div className={styles.featureCard} style={{ "--glow-color": "#00c9a7" } as React.CSSProperties}>
            <h3>Transactions instantanées</h3>
            <p>Profitez de la rapidité du Lightning Network pour des paiements en temps réel, sans attente.</p>
          </div>
          <div className={styles.featureCard} style={{ "--glow-color": "#00c9a7" } as React.CSSProperties}>
            <h3>Simplicité d'intégration</h3>
            <p>Intégrez DazPay à vos outils existants grâce à nos API et plugins, sans développement complexe.</p>
          </div>
        </div>
        <a href="/contact" className={styles.ctaButton}>bientôt<span className={styles.ctaButtonIcon} aria-hidden="true"><svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span></a>
      </section>

      <div className={styles.waveSeparator} aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#23236c" fillOpacity="0.13"/>
        </svg>
      </div>

      {/* Preuve sociale et témoignages */}
      <section className={`glass ${styles.hero}`} data-aos="fade-up" data-aos-delay="1000">
        <h2>Ils nous font confiance</h2>
        {/* Carrousel de témoignages */}
        <div className={styles.temoignagesCarousel}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
            <div className={styles.carouselContainer}>
              <button className={styles.carouselArrow} onClick={prevTestimonial} aria-label="Témoignage précédent">&#8592;</button>
              <blockquote className={
                styles.carouselItem +
                ' ' + (direction === 'left' ? styles.fadeOutLeft : '') +
                (direction === 'right' ? styles.fadeOutRight : '') +
                ' ' + styles.fadeIn
              }>
                <p>"{testimonials[testimonialIndex].quote}"</p>
                <footer>— {testimonials[testimonialIndex].author}</footer>
              </blockquote>
              <button className={styles.carouselArrow} onClick={nextTestimonial} aria-label="Témoignage suivant">&#8594;</button>
            </div>
            <div className={styles.carouselDots} style={{marginTop:'1.5em'}}>
              {testimonials.map((_, idx) => (
                <span
                  key={idx}
                  className={styles.carouselDot + (testimonialIndex === idx ? ' ' + styles.active : '')}
                  onClick={() => goToTestimonial(idx)}
                  aria-label={`Aller au témoignage ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 