'use client';

import { Card } from '@/components/ui/card';
import { useLanguage } from '@/lib/language-context';

interface AboutSection {
  title: string;
  content?: string;
  items?: string[];
}

interface AboutContent {
  title: string;
  sections: AboutSection[];
}

const aboutEn = require('@/content/about-en.json') as AboutContent;
const aboutFr = require('@/content/about-fr.json') as AboutContent;

export default function AboutPage() {
  const { language } = useLanguage();
  const content = language === 'fr' ? aboutFr : aboutEn;

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