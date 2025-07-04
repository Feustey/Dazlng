"use client";

import React, {ReactNode, useState } from "react";
import {usePathname, useRouter } from "next/navigation";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import Image from "next/image";
import MobileBurgerMenu from "./components/ui/MobileBurgerMenu";
import { useTranslations } from "next-intl";


export interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const {user, signOut } = useSupabase();
  const router = useRouter();
  const pathname = usePathname();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const t = useTranslations();
  const handleLogout = async (): Promise<void> => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Page de chargement
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("user.chargement")}</p>
        </div>
      </div>);

  // Rediriger si pas authentifié
  if (!user) {
    return null;
  }

  const navItems = [
    { href: "/user/dashboard", label: "Dashboard", color: "indigo", icon: "📊" },
    { href: "/user/node", label: "Mon nœud", color: "purple", icon: "⚡" },
    { href: "/user/dazia", label: "Dazia IA", color: "yellow", icon: "🤖" },
    { href: "/user/simulation", label: "Simulation", color: "orange", icon: "🔬" },
    { href: "/user/rag-insights", label: "RAG Insights", color: "blue", icon: "🧠" },
    { href: "/user/optimize", label: "Optimisation", color: "emerald", icon: "🚀" }
  ];

  const accountMenuItems = [
    { href: "/user/subscriptions", label: "Abonnements", icon: "💳", color: "blue" },
    { href: "/user/settings", label: "Paramètres", icon: "⚙️", color: "gray" }
  ];

  const getTabStyles = (item: typeof navItems[0], isActive: boolean): string => {
    if (isActive) {
      switch (item.color) {
        case "indigo":
          return "text-indigo-600 bg-indigo-50 border-indigo-200";
        case "purple":
          return "text-purple-600 bg-purple-50 border-purple-200";
        case "green":
          return "text-green-600 bg-green-50 border-green-200";
        case "emerald":
          return "text-emerald-600 bg-emerald-50 border-emerald-200";
        case "yellow":
          return "text-yellow-600 bg-yellow-50 border-yellow-200";
        case "blue":
          return "text-blue-600 bg-blue-50 border-blue-200";
        default:
          return "text-indigo-600 bg-indigo-50 border-indigo-200";
      }
    }
    return "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent";
  };

  const isAccountActive = pathname === "/user/subscriptions" || pathname === "/user/settings";

  const getIndicatorStyles = (color: string): string => {
    switch (color) {
      case "indigo":
        return "bg-indigo-600";
      case "purple":
        return "bg-purple-600";
      case "green":
        return "bg-green-600";
      case "emerald":
        return "bg-emerald-600";
      case "yellow":
        return "bg-yellow-400";
      case "blue":
          return "bg-blue-600";
        case "orange":
          return "bg-orange-600";
        case "red":
          return "bg-red-600";
        case "pink":
          return "bg-pink-600";
        default:
          return "bg-indigo-600";
    }
  };

  return (
    <div>
      {/* Header redesigné avec logo et navigation moderne  */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            {/* Section gauche : Menu burger + Logo  */}</div>
            <div>
              {/* Menu burger mobile  */}</div>
              <MobileBurgerMenu>
              
              {/* Logo et branding  */}</MobileBurgerMenu>
              <div></div>
                <Image></Image>
                <div></div>
                  <h1>
                    DazNode</h1>
                  </h1>
                  <p className="text-xs text-gray-500">{t("user.lightning_network_dashboard")}</p>
                </div>
              </div>
              
              {/* Navigation principale - Desktop uniquement  */}
              <nav>
                {navItems.map((item: any) => {
                  const isActive = pathname === item.href;
                  return (</nav>
                    <a></a>
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                      {isActive && (
                        <div>
                      )}</div>
                    </a>);)}
              </nav>
            </div>
            
            {/* Section droite avec Mon compte - Desktop uniquement  */}
            <div>
              {/* Profil utilisateur compact  */}</div>
              <div></div>
                <div>
                  {user?.email?.charAt(0).toUpperCase()}</div>
                </div>
                <span>
                  {user?.email}</span>
                </span>
              </div>
              
              {/* Menu Mon compte - Desktop  */}
              <div></div>
                <button> setIsAccountMenuOpen(!isAccountMenuOpen)}`
                  className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    isAccountActive 
                      ? "text-blue-600 bg-blue-50 border-blue-200" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"`
                  }`}
                ></button>
                  <span className="text-base">👤</span>
                  <span className="hidden lg:inline">{t("user.mon_compte")}</span>
                  <svg></svg>
                    <path></path>
                  </svg>
                </button>
                
                {/* Menu déroulant  */}
                {isAccountMenuOpen && (
                  <div>
                    {accountMenuItems.map((item) => (</div>
                      <a> setIsAccountMenuOpen(false)}
                      ></a>
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </a>)}
                    
                    <hr></hr>
                    <button> {
                        handleLogout();
                        setIsAccountMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 w-full text-left"
                    ></button>
                      <span className="text-base">🚪</span>
                      <span>{t("user.se_dconnecter")}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content optimisé  */}
      <main></main>
        <div>
          {children}</div>
        </div>
      </main>
    </div>);

export default UserLayout;

export const dynamic  = "force-dynamic";
`