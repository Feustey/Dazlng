"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  SearchIcon,
  BookOpenIcon,
  BarChartIcon,
  ZapIcon,
  HelpCircleIcon,
  MailIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

export default function HelpPage() {
  const t = useTranslations("Help");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "getting_started", icon: <BookOpenIcon className="h-5 w-5" /> },
    { id: "learning", icon: <BookOpenIcon className="h-5 w-5" /> },
    { id: "transactions", icon: <BarChartIcon className="h-5 w-5" /> },
    { id: "operations", icon: <ZapIcon className="h-5 w-5" /> },
    { id: "metrics", icon: <BarChartIcon className="h-5 w-5" /> },
    { id: "nwc", icon: <ZapIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t("title")}</h1>

        <div className="relative mb-8">
          <Input
            type="text"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="p-4 hover:bg-accent cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3">
                {category.icon}
                <span>{t(`categories.${category.id}`)}</span>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("faq.title")}</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what_is_lightning">
              <AccordionTrigger>{t("faq.what_is_lightning")}</AccordionTrigger>
              <AccordionContent>
                Lightning Network est une solution de couche 2 pour Bitcoin qui
                permet des transactions rapides et peu coûteuses.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how_to_start">
              <AccordionTrigger>{t("faq.how_to_start")}</AccordionTrigger>
              <AccordionContent>
                Commencez par créer un compte, connectez votre portefeuille et
                suivez notre guide d'apprentissage.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how_to_connect">
              <AccordionTrigger>{t("faq.how_to_connect")}</AccordionTrigger>
              <AccordionContent>
                Utilisez Nostr Wallet Connect pour connecter facilement votre
                portefeuille à l'application.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how_to_transact">
              <AccordionTrigger>{t("faq.how_to_transact")}</AccordionTrigger>
              <AccordionContent>
                Effectuez des transactions en utilisant l'interface de
                visualisation des transactions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how_to_track">
              <AccordionTrigger>{t("faq.how_to_track")}</AccordionTrigger>
              <AccordionContent>
                Suivez vos opérations en temps réel dans le tableau de bord des
                opérations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how_to_metrics">
              <AccordionTrigger>{t("faq.how_to_metrics")}</AccordionTrigger>
              <AccordionContent>
                Consultez les métriques détaillées de votre nœud dans la section
                métriques.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{t("support.title")}</h2>
          <p className="mb-4">{t("support.description")}</p>
          <Button className="flex items-center space-x-2">
            <MailIcon className="h-4 w-4" />
            <span>{t("support.contact")}</span>
          </Button>
        </Card>
      </div>
    </div>
  );
}
