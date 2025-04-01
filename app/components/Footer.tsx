import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gris-900 py-10">
      <div className="container mx-auto px-4 md:px-[145px]">
        <div className="flex flex-col gap-8">
          {/* Logo et description */}
          <div className="flex flex-col gap-4">
            <Logo className="h-12" />
            <p className="text-body-small text-gris-300 max-w-md">
              DazLng est votre gestionnaire de nœud Lightning Network tout-en-un. 
              Gérez facilement vos canaux, surveillez votre activité et interagissez avec le réseau.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-h5 text-white">Navigation</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-body-small text-gris-300 hover:text-white">Accueil</Link></li>
                <li><Link href="/actions" className="text-body-small text-gris-300 hover:text-white">Actions</Link></li>
                <li><Link href="/channels" className="text-body-small text-gris-300 hover:text-white">Canaux</Link></li>
                <li><Link href="/messages" className="text-body-small text-gris-300 hover:text-white">Messages</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-h5 text-white">Réseaux sociaux</h3>
              <ul className="space-y-2">
                <li><a href="https://twitter.com/feustey" target="_blank" rel="noopener noreferrer" className="text-body-small text-gris-300 hover:text-white">Twitter</a></li>
                <li><a href="https://github.com/dazlng" target="_blank" rel="noopener noreferrer" className="text-body-small text-gris-300 hover:text-white">GitHub</a></li>
                <li><a href="https://discord.gg/dazlng" target="_blank" rel="noopener noreferrer" className="text-body-small text-gris-300 hover:text-white">Discord</a></li>
                <li><a href="https://t.me/+LbcneuuYISFlZmI0" target="_blank" rel="noopener noreferrer" className="text-body-small text-gris-300 hover:text-white">Telegram</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gris-800">
            <p className="text-body-small text-gris-400 text-center">
              © {new Date().getFullYear()} @ DazLng 
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}; 