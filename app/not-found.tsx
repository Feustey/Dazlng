"use client";

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { useParams } from "next/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  const params = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-indigo-600 text-9xl font-extrabold">404</div>
          <h1 className="mt-2 text-4xl font-bold text-gray-900 tracking-tight">
            {t("title") || "Page non trouvée"}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {t("description") ||
              "Nous sommes désolés, la page que vous recherchez n'existe pas ou a été déplacée."}
          </p>
        </div>

        <div className="relative mb-8">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-3 text-sm text-gray-500">
              {t("or") || "ou"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${params.locale}`}
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <svg
              className="h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            {t("back") || "Retour à l'accueil"}
          </Link>

          <Link
            href={`/${params.locale}/contact`}
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg
              className="h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            {t("contact") || "Nous contacter"}
          </Link>
        </div>
      </div>
    </div>
  );
}
