"use client";

export const dynamic = "force-dynamic";

import { useState, ChangeEvent, useCallback } from "react";

import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { LineChart } from "@ui/charts";
import { FormInput } from "@ui/form-input";
import { useLanguage } from "../contexts/LanguageContext";

export default function TestPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

  // Données adaptées au format attendu par le composant LineChart
  const chartData = [
    { date: "Jan", value: 12 },
    { date: "Fév", value: 19 },
    { date: "Mar", value: 3 },
    { date: "Avr", value: 5 },
    { date: "Mai", value: 2 },
    { date: "Juin", value: 3 },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("test.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("test.form.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <FormInput
                label={t("test.form.email")}
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              <FormInput
                label={t("test.form.password")}
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
              <Button type="submit">{t("test.form.submit")}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("test.chart.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart
                data={chartData}
                xKey="date"
                yKey="value"
                height={300}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("test.stats.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>{t("test.stats.users")}</span>
                <Badge variant="secondary">1,234</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>{t("test.stats.revenue")}</span>
                <Badge variant="secondary">€45,678</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>{t("test.stats.growth")}</span>
                <Badge variant="secondary">+12.5%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
