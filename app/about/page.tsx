'use client';

import { Card } from '@/components/ui/card';
import { useLanguage } from '@/lib/language-context';
import { useState, useEffect } from 'react';

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
      content: "Impossible de charger le contenu. Veuillez réessayer plus tard."
    }
  ]
};

export default function AboutPage() {
  const { language } = useLanguage();
  const [aboutEn, setAboutEn] = useState<AboutContent>(fallbackContent);
  const [aboutFr, setAboutFr] = useState<AboutContent>(fallbackContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const enContent = await import('../../content/about-en.json');
        setAboutEn(enContent);
      } catch (error) {
        console.error("Erreur lors du chargement du contenu anglais:", error);
      }

      try {
        const frContent = await import('../../content/about-fr.json');
        setAboutFr(frContent);
      } catch (error) {
        console.error("Erreur lors du chargement du contenu français:", error);
      }

      setIsLoading(false);
    };

    loadContent();
  }, []);

  const content = language === 'fr' ? aboutFr : aboutEn;

  if (isLoading) {
    return <div className="container mx-auto p-6">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold">{content.title}</h1>
      
      <div className="grid gap-6">
        {content.sections && content.sections.map((section: AboutSection, index: number) => (
          <Card key={index} className="p-6">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            
            {section.content && (
              <p className="text-muted-foreground leading-7">{section.content}</p>
            )}
            
            {section.items && (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {section.items.map((item: string, itemIndex: number) => (
                  <li key={itemIndex} className="leading-7">{item}</li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
} 