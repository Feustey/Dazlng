import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="text-lg text-muted-foreground max-w-[600px]">
        {t("description")}
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 btn-gradient text-white hover:shadow-lg hover:scale-105 px-4 py-2"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
