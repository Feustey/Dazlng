import dynamicImport from "next/dynamic";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

interface ConfirmationPageProps {
  params: {
    sessionId: string;
  };
}

const DynamicConfirmationPage = dynamicImport(
  () => import("./ConfirmationPage"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
  }
);

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <DynamicConfirmationPage params={params} />
    </Suspense>
  );
}
