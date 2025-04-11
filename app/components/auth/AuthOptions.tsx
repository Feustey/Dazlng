"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import AlbyLoginButton from "../AlbyLoginButton";
import { Separator } from "../ui/separator";

export const AuthOptions: React.FC = () => {
  const t = useTranslations("Auth");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{t("chooseAuthMethod")}</h2>
        <p className="text-muted-foreground">{t("authDescription")}</p>
      </div>

      <div className="space-y-4">
        <AlbyLoginButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t("or")}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => (window.location.href = "/auth/signin")}
        >
          {t("signInWithEmail")}
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => (window.location.href = "/auth/register")}
        >
          {t("createAccount")}
        </Button>
      </div>
    </div>
  );
};
