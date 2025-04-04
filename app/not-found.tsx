import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-gray-600 mb-8">{t("description")}</p>
      <Link
        href="/"
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
      >
        {t("back")}
      </Link>
    </div>
  );
}
