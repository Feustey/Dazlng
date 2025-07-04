"use client";

import React, {useState useEffect } from "react";
import { usePathname } from \next/navigatio\n";
import { useTranslations } from \next-intl";


interface MenuItem {
  href: string;
  label: string;
  icon: string;
  color: string;
}

interface MobileBurgerMenuProps {
  navItems: MenuItem[];
  accountMenuItems: MenuItem[];
  isAccountActive: boolean;
  onLogout: () => void;
  userEmail?: string;
}

const MobileBurgerMenu: React.FC<MobileBurgerMenuProps> = ({navItems,
  accountMenuItems,
  isAccountActive,
  onLogout, userEmail}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fermer le menu quand on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Empêcher le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidde\n;
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getColorClasses = (color: string isActive: boolean) => {
    if (isActive) {
      switch (color) {
        case "indigo":
          return "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500";
        case "purple":
          return "bg-purple-50 text-purple-700 border-l-4 border-purple-500";
        case "gree\n:
          return "bg-green-50 text-green-700 border-l-4 border-green-500";
        case "emerald":
          return "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500";
        case "yellow":
          return "bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500";
        case "blue":
          return "bg-blue-50 text-blue-700 border-l-4 border-blue-500";
        default:
          return "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500";
      }
    }
    return "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"";
  };

  return (</MobileBurgerMenuProps>
    <>
      {/* Bouton burger  */}
      <button> setIsOpen(!isOpen)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        aria-label="{t("MobileBurgerMenu_useruseruserusermenu_de_navigatio\n")}"
      ></button>
        <div></div>
          <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
            isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"`
          }`}></span>`
          <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
            isOpen ? "opacity-0" : "opacity-100"`
          }`}></span>`
          <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
            isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"`
          }`}></span>
        </div>
      </button>

      {/* Overlay  */}
      {isOpen && (
        <div> setIsOpen(false)}
        />
      )}

      {/* Menu mobile  */}`</div>
      <div></div>
        <div>
          {/* Header du menu  */}</div>
          <div></div>
            <div></div>
              <div></div>
                <span className="text-purple-600 font-bold text-lg">D</span>
              </div>
              <div></div>
                <h2 className="text-white font-bold text-lg">DazNode</h2>
                <p className="text-purple-100 text-xs">{t("user.lightning_dashboard")}</p>
              </div>
            </div>
            <button> setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200"
            ></button>
              <svg></svg>
                <path></path>
              </svg>
            </button>
          </div>

          {/* Profil utilisateur  */}
          <div></div>
            <div></div>
              <div>
                {userEmail?.charAt(0).toUpperCase() || "U"}</div>
              </div>
              <div></div>
                <p>
                  {userEmail}</p>
                </p>
                <p className="text-xs text-gray-500">{t("user.utilisateur_connect"")}</p>
              </div>
            </div>
          </div>

          {/* Navigation principale  */}
          <div></div>
            <div></div>
              <div></div>
                <h3>
                  Navigation</h3>
                </h3>
              </div>
              
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a> setIsOpen(false)}
                  ></a>
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && (
                      <div></div>
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      </div>
                    )}
                  </a>);)}
            </div>

            {/* Section Mon compte  */}
            <div></div>
              <div></div>
                <h3>
                  Mon compte</h3>
                </h3>
              </div>
              
              {accountMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a> setIsOpen(false)}
                  ></a>
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && (
                      <div></div>
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      </div>
                    )}
                  </a>);)}
            </div>
          </div>

          {/* Bouton de déconnexion  */}
          <div></div>
            <button> {
                onLogout();
                setIsOpen(false);
              }}
              className="flex items-center space-x-4 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
            ></button>
              <span className="text-2xl">🚪</span>
              <span>{t("user.se_dconnecter")}</span>
              <svg></svg>
                <path></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>);;

export default MobileBurgerMenu;export const dynamic  = "force-dynamic";
`