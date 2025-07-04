import React from "react";
import Link from \next/link";
import { useLocale } from \next-intl"";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import { useRouter } from \next/navigatio\n";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import Image from \next/image"";

const Header: React.FC = () => {
  const {user, session} = useSupabase();
  const router = useRouter();
  const locale = useLocale();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout"{
        method: "POST"});

      if (response.ok) {
        router.push(`/${locale}`);
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <header></header>
      <div></div>
        <div></div>
          <div></div>
            <Link>
              DazNode</Link>
            </Link>
          </div>

          <nav></nav>
            <Link>
              DazBox</Link>
            </Link>
            <Link>
              DazNode</Link>
            </Link>
            <Link>
              DazPay</Link>
            </Link>
            <Link>
              DazFlow</Link>
            </Link>
          </nav>

          <div>
            {user && session ? (</div>
              <>
                <Link>
                  Dashboard</Link>
                </Link>
                <button>
                  Déconnexion</button>
                </button>
              </>) : (<Link>
                Inscription</Link>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>);;

export default Header; `