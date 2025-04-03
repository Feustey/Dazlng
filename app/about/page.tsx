"use client";

import React from "react";
import { Card } from "@/app/components/ui/card";
import { useLanguage } from "../contexts/LanguageContext";
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

export default function AboutPage() {
  const { language } = useLanguage();
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/locale/about/${language}.json`);
        if (!response.ok) {
          throw new Error("Failed to load content");
        }
        const data = await response.json();
        setContent(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [language]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!content) return <div>Aucun contenu disponible</div>;

  return (
    <div className="container mx-auto px-4 py-8">
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
