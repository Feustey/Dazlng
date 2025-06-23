"use client";

import React from 'react';
import ContactForm from '@/components/shared/ui/ContactForm';
import { QuestionMarkCircleIcon, UserGroupIcon, BoltIcon, RssIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white shadow-xl rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Section communauté */}
            <div className="relative overflow-hidden bg-gradient-to-b from-indigo-500 to-indigo-600 py-10 px-6 sm:px-10 xl:p-12 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
              {/* Background illustration */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <Image
                  src="/assets/images/logo-daznode-white.svg"
                  alt="DazNode Logo"
                  width={400}
                  height={400}
                  className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/3 opacity-10 transform"
                />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Besoin d'aide ?</h3>
              <p className="text-lg text-indigo-50 leading-relaxed mb-8">
                Découvrez nos ressources et rejoignez notre communauté d'entraide.
              </p>
              
              <div className="space-y-6">
                {/* FAQ Section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-start">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-indigo-200 mt-1" />
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">FAQ</h4>
                      <p className="mt-1 text-indigo-100 text-sm mb-3">
                        Réponses rapides à vos questions les plus fréquentes.
                      </p>
                      <Link 
                        href="/help"
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                      >
                        Voir la FAQ
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Telegram Section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-start">
                    <BoltIcon className="h-6 w-6 text-indigo-200 mt-1" />
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">Support Telegram</h4>
                      <p className="mt-1 text-indigo-100 text-sm mb-3">
                        Échangez en direct avec notre communauté.
                      </p>
                      <a 
                        href="https://t.me/DazNode"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                      >
                        Rejoindre Telegram
                      </a>
                    </div>
                  </div>
                </div>

                {/* Token For Good Section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-start">
                    <UserGroupIcon className="h-6 w-6 text-indigo-200 mt-1" />
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">Token For Good</h4>
                      <p className="mt-1 text-indigo-100 text-sm mb-3">
                        Participez à notre programme d'entraide communautaire.
                      </p>
                      <Link 
                        href="/token-for-good"
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                      >
                        Découvrir T4G
                      </Link>
                    </div>
                  </div>
                </div>

                {/* LinkedIn Section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-start">
                    <RssIcon className="h-6 w-6 text-indigo-200 mt-1" />
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">LinkedIn</h4>
                      <p className="mt-1 text-indigo-100 text-sm mb-3">
                        Suivez nos actualités et innovations.
                      </p>
                      <a 
                        href="https://www.linkedin.com/company/daznode"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                      >
                        Suivre DazNode
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="py-10 px-6 sm:px-10 lg:col-span-1 xl:p-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Une question spécifique ?</h3>
              <p className="text-gray-600 mb-6">
                Si vous ne trouvez pas votre réponse dans nos ressources, notre équipe est là pour vous aider.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
