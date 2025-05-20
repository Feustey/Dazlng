import Link from 'next/link';

export default function NotFoundScreen(): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-white">
      <h1 className="text-2xl font-semibold text-black mb-4">Cette page n'existe pas.</h1>
      <Link href="/" legacyBehavior>
        <a className="mt-4 py-3 text-base text-blue-600 hover:underline">Retour à l'accueil !</a>
      </Link>
    </div>
  );
}
