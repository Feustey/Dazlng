"use client";

import React from "react";
import ContactForm from "@/components/shared/ui/ContactForm";
import { QuestionMarkCircleIcon, UserGroupIcon, BoltIcon, RssIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const { t } = useAdvancedTranslation("contact");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              {/* Section communauté */}
              <div className="relative">
                {/* Background illustration */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl"></div>
                <div className="relative p-8">
                  <div className="flex justify-center mb-6">
                    <Image
                      src="/assets/images/community-illustration.svg"
                      alt="Community"
                      width={200}
                      height={200}
                      className="opacity-80"
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{t("common.besoin_daide")}</h3>
                  <p className="text-gray-300 mb-8">
                    Découvrez nos ressources et rejoignez notre communauté d'entraide.
                  </p>
                  
                  <div className="space-y-6">
                    {/* FAQ Section */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <QuestionMarkCircleIcon className="h-8 w-8 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white">FAQ</h4>
                        <p className="text-gray-300 mb-2">
                          Réponses rapides à vos questions les plus fréquentes.
                        </p>
                        <Link
                          href="/help"
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Voir la FAQ
                        </Link>
                      </div>
                    </div>

                    {/* Telegram Section */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <BoltIcon className="h-8 w-8 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white">{t("common.support_telegram")}</h4>
                        <p className="text-gray-300 mb-2">
                          Échangez en direct avec notre communauté.
                        </p>
                        <a
                          href="https://t.me/daznode"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Rejoindre Telegram
                        </a>
                      </div>
                    </div>

                    {/* Token For Good Section */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <UserGroupIcon className="h-8 w-8 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white">{t("common.token_for_good")}</h4>
                        <p className="text-gray-300 mb-2">
                          Participez à notre programme d'entraide communautaire.
                        </p>
                        <Link
                          href="/token-for-good"
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          Découvrir T4G
                        </Link>
                      </div>
                    </div>

                    {/* LinkedIn Section */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <RssIcon className="h-8 w-8 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white">LinkedIn</h4>
                        <p className="text-gray-300 mb-2">
                          Suivez nos actualités et innovations.
                        </p>
                        <a
                          href="https://linkedin.com/company/daznode"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Suivre DazNode
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("common.une_question_specifique")}</h3>
              <p className="text-gray-600 mb-6">
                Si vous ne trouvez pas votre réponse dans nos ressources, notre équipe est là pour vous aider.
              </p>
              <div className="space-y-4">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
