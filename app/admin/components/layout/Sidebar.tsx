import Link from "next/link";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊", section: "main" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈", section: "main" },
  { href: "/admin/openai", label: "OpenAI", icon: "🤖", section: "main" },
  { href: "/admin/users", label: "Utilisateurs", icon: "👥", section: "crm" },
  { href: "/admin/communications", label: "Communications", icon: "💬", section: "crm" },
  { href: "/admin/crm", label: "CRM (Legacy)", icon: "📧", section: "crm" },
  { href: "/admin/orders", label: "Commandes", icon: "🛒", section: "commerce" },
  { href: "/admin/subscriptions", label: "Abonnements", icon: "⚡", section: "commerce" },
  { href: "/admin/payments", label: "Paiements", icon: "💳", section: "commerce" },
  { href: "/admin/products", label: "Produits", icon: "📦", section: "commerce" },
  { href: "/admin/settings", label: "Paramètres", icon: "⚙️", section: "config" },
];

const sections = {
  main: "Principal",
  crm: "CRM & Marketing", 
  commerce: "E-commerce",
  config: "Configuration"
};

export default function Sidebar(): JSX.Element {
  const groupedLinks = Object.entries(sections).map(([sectionKey, sectionName]) => ({
    name: sectionName,
    links: links.filter(link => link.section === sectionKey)
  }));

  return (
    <aside className="w-64 h-full bg-gray-900 text-white flex flex-col p-4">
      <div className="text-xl font-bold mb-8 flex items-center gap-2">
        <span className="text-2xl">⚡</span>
        <div>
          <div>DazNode Admin</div>
          <div className="text-xs text-gray-400 font-normal">Version 2.0</div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-6">
        {groupedLinks.map((section) => (
          <div key={section.name}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {section.name}
            </h3>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span className="text-sm">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      
      {/* Lien vers nouveau CRM */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <Link
          href="/user/dashboard"
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
        >
          <span className="text-lg">🚀</span>
          <div className="text-sm">
            <div className="font-medium">Nouveau CRM</div>
            <div className="text-xs text-purple-200">Interface utilisateur</div>
          </div>
        </Link>
      </div>
    </aside>
  );
} 