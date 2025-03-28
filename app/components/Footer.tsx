import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/actions" className="hover:text-primary transition-colors">Actions</Link></li>
              <li><Link href="/canaux" className="hover:text-primary transition-colors">Canaux</Link></li>
              <li><Link href="/messages" className="hover:text-primary transition-colors">Messages</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/a-propos" className="hover:text-primary transition-colors">À propos</Link></li>
              <li><Link href="/parametres" className="hover:text-primary transition-colors">Paramètres</Link></li>
              <li><Link href="/aide" className="hover:text-primary transition-colors">Aide</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><Link href="/confidentialite" className="hover:text-primary transition-colors">Confidentialité</Link></li>
              <li><Link href="/conditions" className="hover:text-primary transition-colors">Conditions d'utilisation</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link></li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Réseaux sociaux</h3>
            <ul className="space-y-2">
              <li><Link href="https://twitter.com/DazLng" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Twitter</Link></li>
              <li><Link href="https://github.com/DazLng" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">GitHub</Link></li>
              <li><Link href="https://discord.gg/DazLng" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Discord</Link></li>
              <li><Link href="https://t.me/DazLng" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Telegram</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DazLng. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 