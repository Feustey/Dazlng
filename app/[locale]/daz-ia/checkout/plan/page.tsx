import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCheckoutData } from "@/hooks/useCheckoutData";
import DazIAProgressBar from "@/components/daz-ia/ProgressBar";
import Button from "@/components/ui/button";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle } from "lucide-react";
// ... existing code ...
