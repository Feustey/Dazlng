import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Button from "@/app/components/ui/button";
import Card from "@/app/components/ui/card";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { Zap, GitMerge, BarChart3, ExternalLink } from "lucide-react";
import Link from "next/link";

interface NodePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: NodePageProps): Promise<Metadata> {
  const t = await getTranslations("pages.node");

  return {
    title: t("metaTitle", { nodeId: params.id }),
    description: t("metaDescription", { nodeId: params.id }),
  };
}

export default async function NodePage({ params }: NodePageProps) {
  const t = await getTranslations("pages.node");
  const nodeId = params.id;

  if (!nodeId) {
    notFound();
  }

  // Dans un cas réel, on chargerait ici les détails du nœud
  // const nodeDetails = await getNodeDetails(nodeId);

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* En-tête basique du nœud */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          {nodeId.substring(0, 8)}...{nodeId.substring(nodeId.length - 8)}
          <a
            href={`https://amboss.space/node/${nodeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("nodeDetails.pubkey")}: {nodeId}
        </p>
      </div>

      {/* Section de base */}
      <div className="my-8">
        {/* Ici, on pourrait afficher les canaux, la capacité, etc. */}
      </div>

      {/* Section premium avec aperçu */}
      <div className="my-10">
        <h2 className="text-2xl font-bold mb-6">
          {t("premiumFeatures.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carte Optimisation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GitMerge className="h-5 w-5 text-primary" />
                <CardTitle>{t("premiumFeatures.optimization.title")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("premiumFeatures.optimization.description")}
              </p>

              <div className="bg-muted/30 p-3 rounded-md mb-4">
                <div className="h-24 flex items-center justify-center border border-dashed border-muted-foreground/50 rounded">
                  <p className="text-sm text-muted-foreground/70">
                    {t("premiumFeatures.preview")}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/node/${nodeId}/recommendations?tab=optimization`}
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  {t("premiumFeatures.viewButton")}
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Carte Frais */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>{t("premiumFeatures.fees.title")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("premiumFeatures.fees.description")}
              </p>

              <div className="bg-muted/30 p-3 rounded-md mb-4">
                <div className="h-24 flex items-center justify-center border border-dashed border-muted-foreground/50 rounded">
                  <p className="text-sm text-muted-foreground/70">
                    {t("premiumFeatures.preview")}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/node/${nodeId}/recommendations?tab=fees`}
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  {t("premiumFeatures.viewButton")}
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Carte Prédictions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>{t("premiumFeatures.growth.title")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("premiumFeatures.growth.description")}
              </p>

              <div className="bg-muted/30 p-3 rounded-md mb-4">
                <div className="h-24 flex items-center justify-center border border-dashed border-muted-foreground/50 rounded">
                  <p className="text-sm text-muted-foreground/70">
                    {t("premiumFeatures.preview")}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/node/${nodeId}/recommendations?tab=growth`}
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  {t("premiumFeatures.viewButton")}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            {t("premiumFeatures.unlockMessage")}
          </p>
          <Link href={`/node/${nodeId}/purchase-recommendations`}>
            <Button size="lg">{t("premiumFeatures.unlockButton")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
