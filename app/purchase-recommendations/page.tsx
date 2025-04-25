import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Check } from "lucide-react";

interface PurchaseRecommendationsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: PurchaseRecommendationsPageProps): Promise<Metadata> {
  const t = await getTranslations("pages.node.purchaseRecommendations");

  return {
    title: t("metaTitle"),
    description: t("metaDescription", { nodeId: params.id }),
  };
}

export default async function PurchaseRecommendationsPage({
  params,
}: PurchaseRecommendationsPageProps) {
  const t = await getTranslations("pages.node.purchaseRecommendations");
  const nodeId = params.id;

  if (!nodeId) {
    notFound();
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {t("description", { nodeId })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <Card className="border-2 border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle className="text-center">
              {t("oneTimeOffer.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <span className="text-4xl font-bold">
                {t("oneTimeOffer.price")}
              </span>
              <span className="text-muted-foreground ml-2">
                {t("oneTimeOffer.period")}
              </span>
            </div>

            <ul className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                  <span>{t(`oneTimeOffer.features.${i}`)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">{t("oneTimeOffer.buyButton")}</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-center">
              {t("subscription.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <span className="text-4xl font-bold">
                {t("subscription.price")}
              </span>
              <span className="text-muted-foreground ml-2">
                {t("subscription.period")}
              </span>
            </div>

            <ul className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                  <span>{t(`subscription.features.${i}`)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {t("subscription.learnMoreButton")}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {t("valueProposition.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <h3 className="font-semibold mb-2">
                {t(`valueProposition.points.${i}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(`valueProposition.points.${i}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <a href="/pricing" className="text-muted-foreground hover:underline">
          {t("comparePlansLink")}
        </a>
      </div>
    </div>
  );
}
