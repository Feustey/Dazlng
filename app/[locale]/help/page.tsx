"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Phone, Zap } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const t = useTranslations("help");

  const supportSections = [
    {
      id: "daznode-delivery",
      icon: Zap,
      title: "Service Daznode",
      items: [
        {
          question: "Comment se déroule la livraison du Daznode ?",
          answer:
            "La livraison de votre Daznode est effectuée sous 10 jours ouvrés après confirmation de votre paiement. Nous vous envoyons un email de suivi avec le numéro de tracking. Le colis est assuré et nécessite une signature à la réception.",
        },
        {
          question: "Que contient le package Daznode ?",
          answer:
            "Votre package Daznode comprend : un Raspberry Pi 5 (8GB RAM), un SSD 1To, une solution de refroidissement personnalisée, un boîtier sécurisé, un guide d'installation rapide, et tous les câbles nécessaires. Le nœud est pré-configuré avec le logiciel LND et 50 000 sats pré-chargés.",
        },
        {
          question: "Comment installer mon Daznode ?",
          answer:
            "L'installation est simple grâce à notre configuration plug-and-play : 1) Connectez votre Daznode à Internet via Ethernet, 2) Branchez l'alimentation, 3) Accédez à l'interface web via l'adresse fournie, 4) Suivez l'assistant de configuration initial. Notre équipe est disponible pour vous guider par visioconférence si nécessaire.",
        },
      ],
    },
    {
      id: "technical-support",
      icon: MessageCircle,
      title: "Support Technique",
      items: [
        {
          question: "Quel support est inclus avec mon Daznode ?",
          answer:
            "Vous bénéficiez de 2 semaines de support dédié après la réception de votre nœud. Cela inclut : assistance à l'installation, configuration des canaux, optimisation des paramètres, et résolution des problèmes techniques. Le support est disponible par email, chat ou visioconférence.",
        },
        {
          question: "Comment gérer mes canaux Lightning ?",
          answer:
            "Notre interface intuitive vous permet de gérer vos canaux facilement. Nous vous guidons dans la création de vos premiers canaux et vous conseillons sur les meilleures stratégies de connexion au réseau. L'abonnement DazIA Premium inclus vous fournit des recommandations d'optimisation.",
        },
        {
          question: "Comment sécuriser mon nœud ?",
          answer:
            "Votre Daznode est livré avec une configuration Linux renforcée et un stockage chiffré. Nous vous accompagnons dans la mise en place des sauvegardes et la sécurisation de vos clés. Un guide complet de sécurité est fourni.",
        },
      ],
    },
    {
      id: "subscription",
      icon: Mail,
      title: "Abonnement et Services",
      items: [
        {
          question: "Que comprend l'abonnement DazIA Premium inclus ?",
          answer:
            "L'abonnement d'un an à DazIA Premium inclut : analyses personnalisées de votre réseau, recommandations d'optimisation des canaux, alertes en temps réel, rapports hebdomadaires de performance, et accès prioritaire au support technique.",
        },
        {
          question: "Comment renouveler mon abonnement ?",
          answer:
            "Un mois avant l'expiration de votre abonnement Premium, vous recevrez un email avec les options de renouvellement. Le renouvellement peut se faire directement depuis votre tableau de bord avec un paiement Lightning.",
        },
        {
          question: "Puis-je upgrader mon nœud ?",
          answer:
            "Oui, nous proposons des options d'upgrade matériel et logiciel. Notre équipe vous conseille sur les meilleures options selon vos besoins et peut effectuer les mises à niveau à distance ou vous guider dans le processus.",
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Centre d'Aide</h1>

        {/* Section Contact Rapide */}
        <Card className="p-6 mb-8 bg-orange-50 dark:bg-orange-900/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 hover:bg-orange-100 dark:hover:bg-orange-900/40"
              asChild
            >
              <Link href="mailto:support@dazlng.com">
                <Mail className="h-5 w-5" />
                <span>support@dazlng.com</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 hover:bg-orange-100 dark:hover:bg-orange-900/40"
              asChild
            >
              <Link href="tel:+33123456789">
                <Phone className="h-5 w-5" />
                <span>+33 1 23 45 67 89</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 hover:bg-orange-100 dark:hover:bg-orange-900/40"
              asChild
            >
              <Link href="https://t.me/dazlng">
                <MessageCircle className="h-5 w-5" />
                <span>Chat Telegram</span>
              </Link>
            </Button>
          </div>
        </Card>

        {/* Sections de Support */}
        {supportSections.map((section) => (
          <div key={section.id} className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <section.icon className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-semibold">{section.title}</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {section.items.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {/* Section Finale */}
        <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <h3 className="text-xl font-semibold mb-4">
            Besoin d'aide supplémentaire ?
          </h3>
          <p className="mb-4">
            Notre équipe est disponible 7j/7 pour vous accompagner dans votre
            aventure Lightning Network. N'hésitez pas à nous contacter pour
            toute question.
          </p>
          <Button
            variant="secondary"
            className="bg-white text-orange-600 hover:bg-orange-50"
            asChild
          >
            <Link href="mailto:support@dazlng.com">Contacter le Support</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
