import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-6">{t("title")}</h2>
      <p className="text-muted-foreground mb-8 max-w-md">{t("description")}</p>
      <Button asChild variant="gradient">
        <Link href="/">{t("backToHome")}</Link>
      </Button>
    </div>
  );
}
