import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page non trouvée
          </h2>
          <p className="text-gray-600 mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Retour à l'accueil
          </Link>
          
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Nous contacter
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Si vous pensez qu'il s'agit d'une erreur,</p>
          <p>contactez-nous à support@dazno.de</p>
        </div>
      </div>
    </div>
  );
} export const dynamic = "force-dynamic";
