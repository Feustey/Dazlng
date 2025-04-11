"use client";

export const dynamic = "force-dynamic";

import React from "react";
import { useTranslations } from "next-intl";
import PageContainer from "@/app/components/layout/PageContainer";
import Card from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { LightningNetworkGuide } from "../../components/learning/LightningNetworkGuide";
import { TransactionVisualizer } from "../../components/transactions/TransactionVisualizer";
import LearningResources from "../../components/learning/LearningResources";
import {
  Zap,
  BookOpen,
  PlayCircle,
  FileText,
  LineChart,
  Shield,
  BarChart,
  Wallet,
} from "lucide-react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card";

export default function LearnPage() {
  const t = useTranslations("pages.learn");

  return (
    <PageContainer title={t("title")} subtitle={t("subtitle")}>
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-accent/5 p-1 rounded-lg">
          <TabsTrigger
            value="basics"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-md"
          >
            {t("sections.basics.title")}
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-md"
          >
            {t("sections.advanced.title")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basics">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gradient">
                {t("sections.basics.title")}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {t("sections.basics.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <BookOpen className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("sections.basics.topics.introduction.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("sections.basics.topics.introduction.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Zap className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("sections.basics.topics.channels.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("sections.basics.topics.channels.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <LineChart className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("sections.basics.topics.transactions.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("sections.basics.topics.transactions.description")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="advanced">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gradient">
                {t("sections.advanced.title")}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {t("sections.advanced.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("sections.advanced.topics.security.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("sections.advanced.topics.security.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <BarChart className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("sections.advanced.topics.performance.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("sections.advanced.topics.performance.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Wallet className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("sections.advanced.topics.wallets.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("sections.advanced.topics.wallets.description")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
