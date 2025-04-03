"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface HelpContent {
  title: string;
  faqItems: FAQItem[];
}

export default function HelpPage() {
  const { language } = useLanguage();
  const [content, setContent] = useState<HelpContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/locale/help/${language}.json`);
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
      <Accordion type="single" collapsible className="w-full space-y-4">
        {content.faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-600">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
