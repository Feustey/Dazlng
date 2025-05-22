export default function Header(): JSX.Element {
  return (
    <header className="w-full bg-white shadow px-6 py-4 flex items-center justify-between">
      <div className="text-xl font-bold">Back Office Dazno.de</div>
      <div className="flex items-center gap-4">
        {/* Ici, on pourra ajouter le profil admin, la déconnexion, etc. */}
        <span className="text-gray-600">Admin</span>
      </div>
    </header>
  );
} 