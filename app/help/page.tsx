"use client";
import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const dynamic = "force-dynamic";

const HelpPage: React.FC = () => {
  const { t } = useAdvancedTranslation("help");

  const faqCategories = [
    {
      icon: "🚀",
      title: "Prise en main",
      description: t("page.apprenez_les")
    },
    {
      icon: "⚙️",
      title: "Configuration",
      description: t("page.configurez_v")
    },
    {
      icon: "💰",
      title: "Facturation",
      description: t("page.questions_su")
    }
  ];

  const faqQuestions = [
    {
      question: "Comment installer DazNode ?",
      answer: "DazNode est très simple à installer. Suivez notre guide d'installation étape par étape...",
      category: "Installation"
    },
    {
      question: "Quel est le coût de DazNode ?",
      answer: "DazNode propose plusieurs plans tarifaires adaptés à vos besoins...",
      category: "Prix"
    },
    {
      question: "Comment contacter le support ?",
      answer: "Vous pouvez nous contacter par email, chat ou téléphone 24/7...",
      category: "Support"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">
          {t("common.centre_daide_daznode")}
        </h1>
        
        {/* Catégories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {faqCategories.map((category: any, index: any) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4 text-3xl">{category.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
              <p className="text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>

        {/* Questions fréquentes */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
          <div className="space-y-6">
            {faqQuestions.map((faq: any, index: any) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
                <span className="inline-block mt-2 text-sm font-medium text-blue-600">
                  {faq.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
