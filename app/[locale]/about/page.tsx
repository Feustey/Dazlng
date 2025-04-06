"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  BookOpenIcon,
  BarChartIcon,
  ZapIcon,
  UsersIcon,
  MailIcon,
  TwitterIcon,
  GithubIcon,
  ShieldIcon,
  LockIcon,
  ShieldCheckIcon,
  ShieldAlertIcon,
  HeartIcon,
  CodeIcon,
} from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 text-transparent bg-clip-text">
          {t("title")}
        </h1>

        <p className="text-lg text-muted-foreground mb-12">
          {t("description")}
        </p>

        <Card className="p-8 mb-12 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            {t("features.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950">
                <BookOpenIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {t("features.learning")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("Home.features.learning.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-950">
                <BarChartIcon className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {t("features.transactions")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("Home.features.transactions.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-accent-50 dark:bg-accent-950">
                <ZapIcon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {t("features.operations")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("Home.features.operations.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950">
                <BarChartIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {t("features.metrics")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("Home.features.metrics.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-950">
                <ZapIcon className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {t("features.nwc")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("Home.features.nwc.description")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 mb-12 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            {t("security.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950">
                <ShieldIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {t("security.protection")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("security.protectionDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-950">
                <LockIcon className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {t("security.sessions")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("security.sessionsDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-accent-50 dark:bg-accent-950">
                <ShieldCheckIcon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {t("security.validation")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("security.validationDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950">
                <ShieldAlertIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {t("security.headers")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("security.headersDesc")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 mb-12 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            Notre engagement communautaire
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950">
                <HeartIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Communauté Lightning Network
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Daznode est profondément impliqué dans la communauté Lightning
                  Network. Nous participons activement aux conférences,
                  hackathons et événements liés à Lightning, contribuant ainsi à
                  l'évolution et à l'adoption de cette technologie
                  révolutionnaire.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-950">
                <ZapIcon className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Communauté Bitcoin
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  En tant que fervents défenseurs de Bitcoin, nous soutenons
                  activement la communauté Bitcoin. Nous contribuons à des
                  projets open-source, organisons des événements éducatifs et
                  participons à des initiatives visant à promouvoir l'adoption
                  de Bitcoin.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 mb-12 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            {t("team.title")}
          </h2>
          <div className="flex flex-col space-y-6">
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30">
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950">
                <UsersIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-muted-foreground">{t("team.description")}</p>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30">
              <div className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-950">
                <CodeIcon className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Développement par Inoval
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Ce site a été développé par{" "}
                  <a
                    href="https://inoval.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Inoval
                  </a>
                  , une société spécialisée dans le développement d'applications
                  web modernes et performantes.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            {t("contact.title")}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 h-12 hover:bg-primary/10 dark:hover:bg-primary/20"
              asChild
            >
              <a href="/contact">
                <MailIcon className="h-4 w-4" />
                <span>{t("contact.contact")}</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 h-12 hover:bg-secondary/10 dark:hover:bg-secondary/20"
              asChild
            >
              <a
                href="https://twitter.com/DazLng"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon className="h-4 w-4" />
                <span>{t("contact.twitter")}</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 h-12 hover:bg-accent/10 dark:hover:bg-accent/20"
              asChild
            >
              <a
                href="https://github.com/Feustey/Dazlng"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="h-4 w-4" />
                <span>{t("contact.github")}</span>
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
