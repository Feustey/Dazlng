export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur DazNode</h1>
      <p className="text-lg text-gray-600 mb-8">
        Votre plateforme de gestion simplifiée
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Connexion
        </a>
        <a
          href="/register"
          className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Inscription
        </a>
      </div>
    </div>
  );
} 