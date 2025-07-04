"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const CustomHeader: React.FC = () => {
  const { user, signOut } = useSupabase();
  const router = useRouter();
  const locale = useLocale();
  const { t } = useAdvancedTranslation("header");

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}`);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center">
              <Image
                src="/assets/images/logo-daznode.svg"
                alt="DazNode"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Navigation principale */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href={`/${locale}/daznode`}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t("daznode")}
            </Link>
            <Link
              href={`/${locale}/dazbox`}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t("dazbox")}
            </Link>
            <Link
              href={`/${locale}/dazpay`}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t("dazpay")}
            </Link>
            <Link
              href={`/${locale}/network`}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t("network")}
            </Link>
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href={`/${locale}/user`}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {t("dashboard")}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {t("sign_out")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/auth/login`}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {t("sign_in")}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {t("get_started")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomHeader;