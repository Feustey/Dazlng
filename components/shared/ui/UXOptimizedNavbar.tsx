import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";
import { Menu, X } from "@/components/shared/ui/IconRegistry";

const UXOptimizedNavbar: React.FC = () => {
  const { t } = useAdvancedTranslation("common");
  const [open, setOpen] = useState(false);

  const NAV_LINKS = [
    { href: "#problem-section", label: t("UXOptimizedNavbar.probleme") },
    { href: "#solution-section", label: "Solution" },
    { href: "#proof-section", label: "Preuves" },
    { href: "#how-section", label: t("UXOptimizedNavbar.comment_ca_marche") },
    { href: "#pricing-section", label: "Tarifs" },
    { href: "#contact-section", label: t("UXOptimizedNavbar.contact") }
  ];

  return (
    <nav>
      <div>
        {/* Logo + Branding */}
        <Link href="/">
          <Image 
            src="/assets/images/logo-daznode-white.svg" 
            alt="DazNode Logo" 
            width={40} 
            height={40} 
          />
          <span className="text-xl font-bold text-[#F7931A] tracking-tight">DazNode</span>
        </Link>
        {/* Desktop links */}
        <div>
          {NAV_LINKS.map((link, index) => (
            <a key={index} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)}>
          {open ? <X className="h-8 w-8" /> : <Menu />}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div>
          <div>
            {NAV_LINKS.map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default UXOptimizedNavbar; 