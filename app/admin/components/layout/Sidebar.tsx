import Link from "next/link";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Utilisateurs" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/subscriptions", label: "Abonnements" },
  { href: "/admin/payments", label: "Paiements" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/settings", label: "Paramètres" },
];

export default function Sidebar(): JSX.Element {
  return (
    <aside className="w-64 h-full bg-gray-900 text-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-8">Admin</div>
      <nav className="flex-1">
        <ul>
          {links.map((link) => (
            <li key={link.href} className="mb-2">
              <Link href={link.href} className="block px-3 py-2 rounded hover:bg-gray-700">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 