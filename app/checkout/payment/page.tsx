import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useCheckoutSession } from "../../hooks/useCheckoutSession";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { Loader2 } from "lucide-react";
import dynamicImport from "next/dynamic";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const DynamicPaymentPage = dynamicImport(() => import("./PaymentPage"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <DynamicPaymentPage params={params} />
    </Suspense>
  );
}
