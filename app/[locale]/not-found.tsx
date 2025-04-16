import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="text-lg text-muted-foreground max-w-[600px]">
        {t("description")}
      </p>
      <Link href="/" className={cn(buttonVariants({ variant: "gradient" }))}>
        {t("backHome")}
      </Link>
    </div>
  );
}
