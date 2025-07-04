import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  return (
    <div>
      <div>
        <div>
          <h1 className="text-8xl font-bold text-gray-900 mb-4">404</h1>
          <h2>
            Page non trouvée
          </h2>
          <p>
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div>
          <Link href="/">
            Retour à l'accueil
          </Link>
          
          <Link href="/contact">
            Nous contacter
          </Link>
        </div>
        
        <div>
          <p>Si vous pensez qu'il s'agit d'une erreur,</p>
          <p>contactez-nous à support@daznode.com</p>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
