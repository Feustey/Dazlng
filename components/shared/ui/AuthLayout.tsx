import React from 'react';
import Image from 'next/image';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showLogo?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  showLogo = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        {showLogo && (
          <div className="flex justify-center mb-6">
            <Image
              src="/assets/images/logo-daznode.svg"
              alt="AuthLayout.authlayoutauthlayoutlogo_dazno"
              width={120}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </div>
        )}

        {/* Titre */}
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          {title}
        </h1>

        {/* Sous-titre */}
        <p className="text-center text-gray-600 mb-6">
          {subtitle}
        </p>

        {/* Contenu principal */}
        {children}

        {/* Note confidentialité */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Vos données sont protégées et ne seront jamais partagées.<br />
          <span className="italic">{t('AuthLayout.besoin_daide_contacteznous')}</span>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout; 