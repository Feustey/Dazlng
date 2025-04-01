"use client";

import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

interface AboutSection {
  title: string;
  content?: string;
  items?: string[];
}

interface AboutContent {
  title: string;
  sections: AboutSection[];
}

// Contenu par défaut en cas d'erreur
const fallbackContent: AboutContent = {
  title: "Information",
  sections: [
    {
      title: "Erreur de chargement",
      content:
        "Impossible de charger le contenu. Veuillez réessayer plus tard.",
    },
  ],
};

export default function AboutPage() {
  const { language } = useLanguage();
  const [aboutEn, setAboutEn] = useState<AboutContent>(fallbackContent);
  const [aboutFr, setAboutFr] = useState<AboutContent>(fallbackContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const enContent = await import("@/content/about-en.json");
        setAboutEn(enContent);
      } catch (error) {
        console.error("Erreur lors du chargement du contenu anglais:", error);
      }

      try {
        const frContent = await import("@/content/about-fr.json");
        setAboutFr(frContent);
      } catch (error) {
        console.error("Erreur lors du chargement du contenu français:", error);
      }
      setIsLoading(false);
    };

    loadContent();
  }, []);

  const content = language === "fr" ? aboutFr : aboutEn;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{content.title}</h1>
      <div className="space-y-6">
        {content.sections.map((section, index) => (
          <Card key={index} className="p-6">
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            {section.content && (
              <p className="text-gray-600 mb-4">{section.content}</p>
            )}
            {section.items && (
              <ul className="list-disc list-inside space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-600">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
