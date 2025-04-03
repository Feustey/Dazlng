import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
      <p className="text-muted-foreground mb-4">{t("description")}</p>
      <Link href="/" className="text-primary hover:underline">
        {t("backToHome")}
      </Link>
    </div>
  );
}
