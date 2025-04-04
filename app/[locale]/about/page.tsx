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
} from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t("title")}</h1>

        <p className="text-lg mb-8">{t("description")}</p>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("features.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <BookOpenIcon className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{t("features.learning")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("Home.features.learning.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BarChartIcon className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{t("features.transactions")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("Home.features.transactions.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ZapIcon className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{t("features.operations")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("Home.features.operations.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BarChartIcon className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{t("features.metrics")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("Home.features.metrics.description")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ZapIcon className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{t("features.nwc")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("Home.features.nwc.description")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("security.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <ShieldIcon className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{t("security.protection")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("security.protectionDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <LockIcon className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{t("security.sessions")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("security.sessionsDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{t("security.validation")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("security.validationDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldAlertIcon className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{t("security.headers")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("security.headersDesc")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("team.title")}</h2>
          <div className="flex items-start space-x-3">
            <UsersIcon className="h-6 w-6 text-primary mt-1" />
            <p>{t("team.description")}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{t("contact.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2"
              asChild
            >
              <a href="mailto:contact@dazlng.com">
                <MailIcon className="h-4 w-4" />
                <span>{t("contact.email")}</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2"
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
              className="flex items-center justify-center space-x-2"
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
