import Image from "next/image";

export default function TokenForGoodPage(): React.ReactElement {
  return (
    <div className="bg-[#f7f7f7] min-h-screen font-sans">
      {/* Header */}


      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16 rounded-2xl mb-10">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Célébrer l'engagement !</h1>
          <p className="text-lg max-w-2xl mx-auto mb-6">
            L'ambition de Token for Good est de valoriser les actions à impacts positifs : dynamiser les échanges au sein d'une communauté et donner du sens au partage !
          </p>
          <p className="text-lg max-w-2xl mx-auto mb-6">
            En contrepartie de sa contribution, le membre reçoit des jetons numériques (tokens… for good) et devient bénéficiaire de services et de nombreux avantages.
          </p>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Avec sa plate-forme collaborative, Token for Good offre donc une solution innovante d'animation de communauté et s'inscrit dans une « sharing economy » qui célèbre l'engagement !
          </p>
          <a href="https://app.token-for-good.com" className="inline-block bg-[#1a1a1a] text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-[#333] transition">GO !</a>
        </div>
      </section>

      {/* Pourquoi rejoindre */}
      <section className="container mx-auto py-12 px-4 rounded-2xl mb-10 bg-gradient-to-r from-green-700 to-green-900 text-white shadow">
        <h2 className="text-3xl font-bold text-center mb-12">Pourquoi rejoindre Token for Good ?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Étudiants */}
          <div className="bg-white/20 rounded-2xl shadow p-6">
            <h3 className="font-bold text-xl mb-4 text-white">Étudiants</h3>
            <ul className="space-y-2 text-white/90">
              <li>Rencontrer des alumni à votre écoute</li>
              <li>Profiter de retour d'expériences et partager les connaissances</li>
              <li>Développer vos compétences</li>
              <li>Valoriser un engagement auprès de partenaires à mission</li>
              <li>Accéder à des événements inspirants</li>
              <li>Bénéficier de différents services ciblés</li>
              <li>Renforcer une communauté qui vous ressemble</li>
            </ul>
          </div>
          {/* Alumni */}
          <div className="bg-white/20 rounded-2xl shadow p-6">
            <h3 className="font-bold text-xl mb-4 text-white">Alumni</h3>
            <ul className="space-y-2 text-white/90">
              <li>Rencontrer des alumni qui partagent vos centres d'intérêts</li>
              <li>Croiser les expériences et partager vos connaissances</li>
              <li>Développer vos compétences</li>
              <li>Se former tout au long de la vie</li>
              <li>Accéder à des événements inspirants</li>
              <li>Bénéficier de différents services ciblés</li>
              <li>Renforcer une communauté qui vous ressemble</li>
            </ul>
          </div>
          {/* Corporate/Écoles */}
          <div className="bg-white/20 rounded-2xl shadow p-6">
            <h3 className="font-bold text-xl mb-4 text-white">Corporate / Écoles</h3>
            <ul className="space-y-2 text-white/90">
              <li>Fédérer vos parties prenantes au sein d'une communauté qui leur ressemble</li>
              <li>Favoriser le partage de connaissances et le développement de compétences</li>
              <li>Sécuriser et certifier la transmission des savoir-faire</li>
              <li>Accéder à un vivier de talents et un réseau d'experts</li>
              <li>Valoriser un engagement auprès de partenaires à mission</li>
              <li>Développer des outils contributifs et innovants avec la technologie blockchain</li>
            </ul>
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