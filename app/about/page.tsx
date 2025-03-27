'use client';

import { Card } from '@/components/ui/card';
import aboutEn from '@/content/about-en.json';
import aboutFr from '@/content/about-fr.json';
import { useLanguage } from '@/lib/language-context';

interface AboutContent {
  title: string;
  sections: {
    title: string;
    content?: string;
    items?: string[];
  }[];
}

export default function AboutPage() {
  const { language } = useLanguage();
  const content: AboutContent = language === 'fr' ? aboutFr : aboutEn;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold">{content.title}</h1>
      
      <div className="grid gap-6">
        {content.sections.map((section, index) => (
          <Card key={index} className="p-6">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            
            {section.content && (
              <p className="text-muted-foreground leading-7">{section.content}</p>
            )}
            
            {section.items && (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {section.items.map((item, itemIndex) => (
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