"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import PageContainer from "@/app/components/layout/PageContainer";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import Button from "@/app/components/ui/button";
import {
  Brain,
  Zap,
  Cpu,
  Server,
  Shield,
  AlertTriangle,
  ArrowRight,
  Rocket,
  Target,
  BarChart3,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import Link from "next/link";

export default function DazIAPage() {
  const t = useTranslations("daz-ia");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "fr";
  const { data: session } = useSession();

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: t("engine.what_it_does.items.0"),
      description: t("engine.what_it_does.items.1"),
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: t("engine.what_it_does.items.2"),
      description: t("engine.what_it_does.items.3"),
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: t("engine.what_it_does.items.4"),
      description: t("engine.architecture.items.0"),
    },
  ];

  return (
    <PageContainer title={t("title")} subtitle={t("description")}>
      <Tabs defaultValue="engine" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-accent/5 p-1 rounded-lg">
          <TabsTrigger
            value="engine"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-md"
          >
            {t("tabs.engine")}
          </TabsTrigger>
          <TabsTrigger
            value="plans"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-md"
          >
            {t("tabs.plans")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engine" className="space-y-8">
          {/* Section What Daz-IA Does */}
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gradient">
                {t("what.title")}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {t("what.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    {t("what.features.title")}
                  </h3>
                  <ul className="space-y-3">
                    {t
                      .raw("what.features.items")
                      .map((feature: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-300"
                        >
                          <Brain className="w-5 h-5 mr-2 text-primary" />
                          {feature}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    {t("what.benefits.title")}
                  </h3>
                  <ul className="space-y-3">
                    {t
                      .raw("what.benefits.items")
                      .map((benefit: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-300"
                        >
                          <Zap className="w-5 h-5 mr-2 text-primary" />
                          {benefit}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Architecture */}
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gradient">
                {t("architecture.title")}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {t("architecture.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {t
                  .raw("architecture.components")
                  .map((component: any, index: number) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center">
                        {component.icon === "cpu" && (
                          <Cpu className="w-6 h-6 mr-2 text-primary" />
                        )}
                        {component.icon === "server" && (
                          <Server className="w-6 h-6 mr-2 text-primary" />
                        )}
                        {component.icon === "shield" && (
                          <Shield className="w-6 h-6 mr-2 text-primary" />
                        )}
                        <h3 className="text-lg font-semibold text-white">
                          {component.title}
                        </h3>
                      </div>
                      <p className="text-gray-300">{component.description}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-8">
          {/* Section One-Shot */}
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gradient">
                {t("one-shot.title")}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {t("one-shot.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-lg text-gray-300">
                  <span className="text-gradient font-bold text-2xl">
                    {t("one-shot.price")}
                  </span>
                </p>
                <ul className="space-y-4">
                  {t
                    .raw("one-shot.features")
                    .map((feature: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-300"
                      >
                        <Shield className="w-5 h-5 mr-2 text-primary" />
                        {feature}
                      </li>
                    ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/${locale}/checkout?plan=one-shot`}
                className="w-full"
              >
                <Button variant="gradient" size="lg" className="w-full group">
                  {t("one-shot.cta")}{" "}
                  <span className="ml-2 font-bold">10K sats</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Section Abonnement */}
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gradient">
                {t("subscription.title")}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {t("subscription.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-lg text-gray-300">
                  <span className="text-gradient font-bold text-2xl">
                    {t("subscription.price")}
                  </span>
                  <span className="text-gray-400 ml-2">/mois</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      {t("subscription.features.title")}
                    </h3>
                    <ul className="space-y-3">
                      {t
                        .raw("subscription.features.items")
                        .map((feature: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-center text-gray-300"
                          >
                            <Rocket className="w-5 h-5 mr-2 text-primary" />
                            {feature}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      {t("subscription.alerts.title")}
                    </h3>
                    <ul className="space-y-3">
                      {t
                        .raw("subscription.alerts.items")
                        .map((alert: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-center text-gray-300"
                          >
                            <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
                            {alert}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t("subscription.weekly_report.title")}
                  </h3>
                  <p className="text-gray-300">
                    {t("subscription.weekly_report.description")}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/${locale}/checkout?plan=subscription`}
                className="w-full"
              >
                <Button variant="gradient" size="lg" className="w-full group">
                  {t("subscription.cta")}{" "}
                  <span className="ml-2 font-bold">100K sats/an</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
