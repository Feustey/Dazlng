import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from '@/components/shared/ui/IconRegistry';


const NAV_LINKS = [
  { href: "#problem-section", label: "UXOptimizedNavbar.uxoptimizednavbaruxoptimizedna" },
  { href: "#solution-section", label: "Solution" },
  { href: "#proof-section", label: "Preuves" },
  { href: "#how-section", label: "UXOptimizedNavbar.uxoptimizednavbaruxoptimizedna" },
  { href: "#pricing-section", label: "Tarifs" },
  { href: "#contact-section", label: "UXOptimizedNavbar.uxoptimizednavbaruxoptimizedna" },
];

const UXOptimizedNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#F7931A]/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo + Branding */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/images/logo-daznode.svg" alt="DazNode" width={40} height={40} className="h-10 w-auto" />
          <span className="text-xl font-bold text-[#F7931A] tracking-tight">DazNode</span>
        </Link>
        {/* Desktop links */}
        <div className="hidden md:flex gap-6">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-white hover:text-[#F7931A] font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        {/* Mobile hamburger */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#1A1A1A] border-t border-[#F7931A]/10 px-4 py-4">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-white text-lg font-medium py-2 px-2 rounded hover:bg-[#F7931A]/10 transition"
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