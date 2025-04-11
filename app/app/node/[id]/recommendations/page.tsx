import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import NodeOptimizationRecommendations from "@/app/components/NodeOptimizationRecommendations";
import NodeFeeRecommendations from "@/app/components/NodeFeeRecommendations";
import NodeGrowthPrediction from "@/app/components/NodeGrowthPrediction";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

interface NodeRecommendationsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: NodeRecommendationsPageProps): Promise<Metadata> {
  const t = await getTranslations("pages.node.recommendations");

  return {
    title: t("metaTitle"),
    description: t("metaDescription", { nodeId: params.id }),
  };
}

export default async function NodeRecommendationsPage({
  params,
}: NodeRecommendationsPageProps) {
  const t = await getTranslations("pages.node.recommendations");
  const nodeId = params.id;

  if (!nodeId) {
    notFound();
  }

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("description", { nodeId })}
        </p>
      </div>

      <Tabs defaultValue="optimization" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="optimization">
            {t("tabs.optimization")}
          </TabsTrigger>
          <TabsTrigger value="fees">{t("tabs.fees")}</TabsTrigger>
          <TabsTrigger value="growth">{t("tabs.growth")}</TabsTrigger>
        </TabsList>

        <TabsContent value="optimization" className="mt-6">
          <NodeOptimizationRecommendations nodeId={nodeId} />
        </TabsContent>

        <TabsContent value="fees" className="mt-6">
          <NodeFeeRecommendations nodeId={nodeId} />
        </TabsContent>

        <TabsContent value="growth" className="mt-6">
          <NodeGrowthPrediction nodeId={nodeId} />
        </TabsContent>
      </Tabs>

      <div className="bg-muted/50 rounded-lg p-4 mt-8">
        <h2 className="text-xl font-semibold mb-2">{t("howItWorks.title")}</h2>
        <p className="mb-4">{t("howItWorks.description")}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-background rounded-md shadow-sm">
            <h3 className="font-semibold mb-2">
              {t("howItWorks.optimization.title")}
            </h3>
            <p className="text-sm">
              {t("howItWorks.optimization.description")}
            </p>
          </div>

          <div className="p-4 bg-background rounded-md shadow-sm">
            <h3 className="font-semibold mb-2">{t("howItWorks.fees.title")}</h3>
            <p className="text-sm">{t("howItWorks.fees.description")}</p>
          </div>

          <div className="p-4 bg-background rounded-md shadow-sm">
            <h3 className="font-semibold mb-2">
              {t("howItWorks.growth.title")}
            </h3>
            <p className="text-sm">{t("howItWorks.growth.description")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
