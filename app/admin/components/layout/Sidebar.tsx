import React from "react";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/outline";
import { useLocale } from "next-intl";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊", section: "main" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈", section: "main" },
  { href: "/admin/openai", label: "OpenAI", icon: "🤖", section: "main" },
  { href: "/admin/users", label: "Utilisateurs", icon: "👥", section: "crm" },
  { href: "/admin/communications", label: "Communications", icon: "💬", section: "crm" },
  { href: "/admin/crm", label: "CRM Legacy", icon: "📧", section: "crm" },
  { href: "/admin/orders", label: "Commandes", icon: "🛒", section: "commerce" },
  { href: "/admin/subscriptions", label: "Abonnements", icon: "⚡", section: "commerce" },
  { href: "/admin/payments", label: "Paiements", icon: "💳", section: "commerce" },
  { href: "/admin/products", label: "Produits", icon: "📦", section: "commerce" },
  { href: "/admin/settings", label: "Paramètres", icon: "⚙️", section: "config" }
];

const sections = {
  main: "Principal",
  crm: "CRM & Marketing", 
  commerce: "E-commerce",
  config: "Configuration"
};

const Sidebar: React.FC = () => {
  const { t } = useAdvancedTranslation("common");

  const locale = useLocale();

  const groupedLinks = Object.entries(sections).map(([sectionKey, sectionName]) => ({
    name: sectionName,
    links: links.filter(link => link.section === sectionKey)
  }));

  return (
    <aside>
      <div>
        <span className="text-2xl">⚡</span>
        <div>
          <div>{t("admin.daznode_admin")}</div>
          <div className="text-xs text-gray-400 font-normal">{t("admin.version_20")}</div>
        </div>
      </div>
      
      <nav>
        {groupedLinks.map((section: any) => (
          <div key={section.name}>
            <h3>
              {section.name}
            </h3>
            <ul>
              {section.links.map((link: any) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span className="text-sm">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      
      {/* Lien vers nouveau CRM  */}
      <div>
        <Link href="/user">
          <UserIcon />
          Dashboard Utilisateur
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
export const dynamic = "force-dynamic";
