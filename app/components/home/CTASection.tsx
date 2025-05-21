import Link from 'next/link';

const badges = [
  { icon: '⚡', text: 'Installation 5 min' },
  { icon: '🔧', text: 'Support 24/7' },
  { icon: '🎁', text: '3 mois Premium inclus' }
];

export const CTASection = (): React.ReactElement => {
  return (
    <section className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Prêt à rejoindre la révolution Lightning ?
            </h2>
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-indigo-100">
              Commencez aujourd'hui avec votre DazBox et découvrez la puissance du réseau Lightning Network.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                Parler à un expert
              </Link>
            </div>
          </div>
          {/* Badges de confiance */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6">
            {badges.map((badge, _) => (
              <div key={badge.text}>
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                  <span className="w-5 h-5 mr-2 text-yellow-400">{badge.icon}</span>
                  <span className="text-sm">{badge.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 