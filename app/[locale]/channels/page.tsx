"use client";

import { Card } from "@components/ui/card";
import { useTranslations } from "next-intl";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Search } from "lucide-react";

export default function ChannelsPage() {
  const t = useTranslations("channels");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button>{t("createChannel")}</Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={t("searchChannels")}
            className="w-full pl-10"
          />
        </div>
      </Card>

      <Card className="p-6">
        <p className="text-center text-muted-foreground">{t("noChannels")}</p>
      </Card>
    </div>
  );
}
