import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";
import {
  Home,
  Zap,
  Network,
  BarChart2,
  Book,
  Bell,
  HelpCircle,
} from "lucide-react";

const navigation = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Daz-IA",
    href: "/daz-ia",
    icon: Zap,
  },
  {
    name: "Réseau",
    href: "/network",
    icon: Network,
  },
  {
    name: "Canaux",
    href: "/channels",
    icon: BarChart2,
  },
  {
    name: "Apprendre",
    href: "/learn",
    icon: Book,
  },
];

export default function Header() {
  const pathname = usePathname();
  const locale = useLocale();

  // Fonction pour vérifier si un lien est actif
  const isActive = (href: string) => {
    const currentPath = `/${locale}${href}`;
    return pathname === currentPath;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-8 flex-1">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.svg"
              alt="Daznode Logo"
              width={32}
              height={32}
              className="dark:brightness-200"
            />
            <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Daznode
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={`/${locale}${item.href}`}
                  className={`
                    group flex items-center gap-2 text-sm font-medium transition-all duration-200
                    ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <div className="relative">
                    <item.icon
                      className={`
                      w-4 h-4 transition-all duration-200
                      ${
                        active
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      }
                    `}
                    />
                    {active && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="relative">
                    {item.name}
                    {active && (
                      <div className="absolute -bottom-4 left-0 w-full h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-full" />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
