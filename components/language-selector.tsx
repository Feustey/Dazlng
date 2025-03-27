'use client';

import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
      className="relative"
      title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
    >
      <Languages className="h-4 w-4" />
      <span className="ml-2 text-xs font-bold absolute -bottom-1 -right-1">
        {language.toUpperCase()}
      </span>
    </Button>
  );
} 