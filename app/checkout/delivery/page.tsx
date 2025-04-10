import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useCheckoutData } from "@/app/hooks/useCheckoutData";
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

type DeliveryOption = "standard" | "express";

const deliveryOptions = [
  {
    id: "standard" as DeliveryOption,
    name: "Livraison standard",
    price: 0,
    estimatedDays: "2-3 semaines",
  },
  {
    id: "express" as DeliveryOption,
    name: "Livraison express",
    price: 15,
    estimatedDays: "1-2 semaines",
  },
];

interface DeliveryPageProps {
  params: {
    sessionId: string;
  };
}

export const dynamic = "force-dynamic";

const DynamicDeliveryPage = dynamicImport(() => import("./DeliveryPage"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

export default function DeliveryPage({ params }: DeliveryPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <DynamicDeliveryPage params={params} />
    </Suspense>
  );
}
