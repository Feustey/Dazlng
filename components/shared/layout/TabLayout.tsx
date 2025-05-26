"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import Footer from '../../Footer';
import PropTypes from 'prop-types';
import Image from 'next/image';

interface TabIconProps {
  color: string;
  name: string;
  size: number;
}

interface TabButtonProps {
  onPress: () => void;
}

interface HeaderLogoProps {
  onPress: () => void;
}

const TabIcon: React.FC<TabIconProps> = ({ color, name, size }) => (
  <FontAwesome5 name={name} size={size} color={color} />
);

const TabButton: React.FC<TabButtonProps> = ({ onPress }) => (
  <div onClick={onPress} className="cursor-pointer">
    <Image
      src="/assets/images/logo.png"
      alt="Logo Daznode"
      className="w-[120px] h-[24px] object-contain"
      width={120}
      height={24}
      priority
    />
  </div>
);

const HeaderLogo: React.FC<HeaderLogoProps> = ({ onPress }) => (
  <button onClick={onPress} className="bg-transparent border-0 p-0 m-0 cursor-pointer">
    <Image
      src="/assets/images/logo-daznode-white.svg"
      alt="Logo Daznode"
      className="w-[120px] h-[24px] object-contain"
      width={120}
      height={24}
      priority
    />
  </button>
);

TabIcon.propTypes = {
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

TabButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

HeaderLogo.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const UserButton: React.FC = () => (
  <a href="/auth/login" className="mr-4">
    <TabIcon name="user-circle" color="#fff" size={24} />
  </a>
);

export default function TabLayout(): React.ReactElement | null {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  const tabs = [
    { name: 'index', title: 'Accueil', icon: 'home' },
    { name: 'dazbox', title: 'Dazbox', icon: 'box' },
    { name: 'daznode', title: 'Daznode', icon: 'network-wired' },
    { name: 'dazpay', title: 'DazPay', icon: 'cash-register' },
  ] as const;

  // Simule un système d'onglets web (exemple, à adapter selon le routeur web utilisé)
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary flex items-center justify-between px-6 py-3 shadow-md">
        <HeaderLogo onPress={() => window.location.href = '/'} />
        <nav className="flex gap-6">
          {tabs.map(tab => (
            <a key={tab.name} href={`/${tab.name === 'index' ? '' : tab.name}`} className="flex items-center gap-2 text-white hover:text-secondary font-semibold text-base">
              <TabIcon name={tab.icon} color="#fff" size={20} />
              {tab.title}
            </a>
          ))}
        </nav>
        <UserButton />
      </header>
      <main className="flex-1">
        {/* Ici, le contenu des pages enfants sera injecté via le routeur web (Next.js, etc.) */}
      </main>
      <Footer />
    </div>
  );
} 