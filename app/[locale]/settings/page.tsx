"use client";

import { useState, useEffect } from "react";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { useLanguage } from "@contexts/LanguageContext";
import { toast } from "sonner";

interface SettingsContent {
  title: string;
  language: {
    label: string;
    options: {
      en: string;
      fr: string;
    };
  };
  theme: {
    label: string;
    options: {
      light: string;
      dark: string;
      system: string;
    };
  };
  save: string;
  success: string;
  error: string;
}

interface Settings {
  language: string;
  theme: string;
}

const STORAGE_KEY = "app_settings";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const [theme, setTheme] = useState("system");
  const [content, setContent] = useState<SettingsContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Charger les paramètres sauvegardés
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      const settings: Settings = JSON.parse(savedSettings);
      setTheme(settings.theme);
    }

    // Charger le contenu traduit
    async function fetchContent() {
      try {
        const response = await fetch(`/locale/settings/${language}.json`);
        if (!response.ok) throw new Error("Failed to load content");
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error loading settings content:", error);
        toast.error("Failed to load settings");
      }
    }

    fetchContent();
  }, [language]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settings: Settings = { language, theme };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      toast.success(content?.success || "Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(content?.error || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (!content) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{content.title}</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{content.language.label}</h2>
        <div className="flex gap-4">
          <Button
            variant={language === "en" ? "default" : "outline"}
            onClick={() => setLanguage("en")}
          >
            {content.language.options.en}
          </Button>
          <Button
            variant={language === "fr" ? "default" : "outline"}
            onClick={() => setLanguage("fr")}
          >
            {content.language.options.fr}
          </Button>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{content.theme.label}</h2>
        <div className="flex gap-4">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
          >
            {content.theme.options.light}
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
          >
            {content.theme.options.dark}
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            onClick={() => setTheme("system")}
          >
            {content.theme.options.system}
          </Button>
        </div>
      </Card>

      <Button className="w-full" onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Enregistrement..." : content.save}
      </Button>
    </div>
  );
}
