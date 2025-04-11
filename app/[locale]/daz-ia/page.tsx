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
                    {[0, 1, 2, 3].map((index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-300"
                      >
                        <Brain className="w-5 h-5 mr-2 text-primary" />
                        {t(`what.features.items.${index}`)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    {t("what.benefits.title")}
                  </h3>
                  <ul className="space-y-3">
                    {[0, 1, 2, 3].map((index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-300"
                      >
                        <Zap className="w-5 h-5 mr-2 text-primary" />
                        {t(`what.benefits.items.${index}`)}
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
                {[0, 1, 2].map((index) => {
                  const icons = {
                    cpu: <Cpu className="w-6 h-6 mr-2 text-primary" />,
                    server: <Server className="w-6 h-6 mr-2 text-primary" />,
                    shield: <Shield className="w-6 h-6 mr-2 text-primary" />,
                  };
                  const icon = t(`architecture.components.${index}.icon`);
                  return (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center">
                        {icons[icon as keyof typeof icons]}
                        <h3 className="text-lg font-semibold text-white">
                          {t(`architecture.components.${index}.title`)}
                        </h3>
                      </div>
                      <p className="text-gray-300">
                        {t(`architecture.components.${index}.description`)}
                      </p>
                    </div>
                  );
                })}
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
                  {[0, 1, 2, 3].map((index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <Shield className="w-5 h-5 mr-2 text-primary" />
                      {t(`one-shot.features.${index}`)}
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
                {t("yearly.title")}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {t("yearly.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-lg text-gray-300">
                  <span className="text-gradient font-bold text-2xl">
                    {t("yearly.price")}
                  </span>
                  <span className="text-gray-400 ml-2">/an</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      {t("yearly.features.title")}
                    </h3>
                    <ul className="space-y-3">
                      {[0, 1, 2, 3].map((index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-300"
                        >
                          <Rocket className="w-5 h-5 mr-2 text-primary" />
                          {t(`yearly.features.items.${index}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/${locale}/checkout?plan=yearly`} className="w-full">
                <Button variant="gradient" size="lg" className="w-full group">
                  {t("yearly.cta")}{" "}
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
