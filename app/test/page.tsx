"use client";

import { useState, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { FormInput } from "../components/ui/form-input";
import { Chart } from "../components/ui/chart";
import { Line } from "react-chartjs-2";
import { useLanguage } from "../contexts/LanguageContext";

export default function TestPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const chartData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        label: "Données",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{t("test.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Boutons */}
        <Card>
          <CardHeader>
            <CardTitle>{t("test.buttons.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">{t("test.buttons.default")}</Button>
              <Button variant="secondary">{t("test.buttons.secondary")}</Button>
              <Button variant="destructive">
                {t("test.buttons.destructive")}
              </Button>
              <Button variant="outline">{t("test.buttons.outline")}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>{t("test.badges.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Par défaut</Badge>
              <Badge variant="secondary">Secondaire</Badge>
              <Badge variant="destructive">Destructif</Badge>
              <Badge variant="outline">Contour</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Formulaires */}
        <Card>
          <CardHeader>
            <CardTitle>{t("test.forms.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormInput
                label="Email"
                type="email"
                placeholder="Entrez votre email"
                error="Email invalide"
                value={email}
                onChange={handleEmailChange}
              />
              <FormInput
                label="Mot de passe"
                type="password"
                placeholder="Entrez votre mot de passe"
                error="Mot de passe requis"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Graphiques */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>{t("test.charts.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              title="Graphique de test"
              description="Un graphique simple"
              height={300}
            >
              <Line data={chartData} options={chartOptions} />
            </Chart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
