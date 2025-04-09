"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
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
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text animate-slide-up">
            {t("title")}
          </h1>

          <p className="text-lg text-muted-foreground mb-12 animate-slide-up [animation-delay:100ms]">
            {t("description")}
          </p>

          <Card className="card-glass border-accent/20 p-8 mb-12 animate-slide-up [animation-delay:200ms]">
            <h2 className="text-2xl font-semibold mb-6 gradient-text">
              {t("features.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-200">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpenIcon className="h-6 w-6 text-primary" />
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
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-200">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <BarChartIcon className="h-6 w-6 text-secondary" />
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
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-200">
                <div className="p-2 rounded-lg bg-accent/10">
                  <ZapIcon className="h-6 w-6 text-accent" />
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
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-200">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChartIcon className="h-6 w-6 text-primary" />
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
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-200">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <ZapIcon className="h-6 w-6 text-secondary" />
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

          <Card className="card-glass border-accent/20 p-8 mb-12 animate-slide-up [animation-delay:300ms]">
            <h2 className="text-2xl font-semibold mb-6 gradient-text">
              {t("security.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-200">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShieldIcon className="h-6 w-6 text-primary" />
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
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-200">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <LockIcon className="h-6 w-6 text-secondary" />
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
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-200">
                <div className="p-2 rounded-lg bg-accent/10">
                  <ShieldCheckIcon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {t("security.verification")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("security.verificationDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-200">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShieldAlertIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {t("security.monitoring")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("security.monitoringDesc")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="card-glass border-accent/20 p-8 mb-12 animate-slide-up [animation-delay:400ms]">
            <h2 className="text-2xl font-semibold mb-6 gradient-text">
              {t("team.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-200">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UsersIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {t("team.developers")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("team.developersDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-200">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <HeartIcon className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {t("team.community")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("team.communityDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-200">
                <div className="p-2 rounded-lg bg-accent/10">
                  <CodeIcon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {t("team.contributors")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("team.contributorsDesc")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-center space-x-4 animate-slide-up [animation-delay:500ms]">
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-primary/10"
              onClick={() =>
                window.open("https://twitter.com/daznode", "_blank")
              }
            >
              <TwitterIcon className="h-5 w-5" />
              <span>Twitter</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-primary/10"
              onClick={() =>
                window.open("https://github.com/daznode", "_blank")
              }
            >
              <GithubIcon className="h-5 w-5" />
              <span>GitHub</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-primary/10"
              onClick={() => window.open("mailto:contact@daznode.com")}
            >
              <MailIcon className="h-5 w-5" />
              <span>Email</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
