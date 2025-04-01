"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Chart } from "@/components/ui/chart";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TestPage() {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        Page de test des composants UI
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Test des boutons</CardTitle>
            <CardDescription>Différentes variantes de boutons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button>Défaut</Button>
              <Button variant="secondary">Secondaire</Button>
              <Button variant="destructive">Destructif</Button>
              <Button variant="outline">Contour</Button>
              <Button variant="ghost">Fantôme</Button>
              <Button variant="link">Lien</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Petit</Button>
              <Button>Moyen</Button>
              <Button size="lg">Grand</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test des badges</CardTitle>
            <CardDescription>Différentes variantes de badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>Défaut</Badge>
              <Badge variant="secondary">Secondaire</Badge>
              <Badge variant="destructive">Destructif</Badge>
              <Badge variant="outline">Contour</Badge>
              <Badge variant="success">Succès</Badge>
              <Badge variant="warning">Attention</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test du formulaire</CardTitle>
          <CardDescription>
            Interaction avec les champs de formulaire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom d'utilisateur"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              error={
                formSubmitted && !inputValue ? "Ce champ est obligatoire" : ""
              }
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="Entrez votre mot de passe"
              error={
                formSubmitted && !inputValue ? "Ce champ est obligatoire" : ""
              }
            />
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Soumettre</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test du composant Chart</CardTitle>
          <CardDescription>Visualisation des données</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart
            title="Exemple de graphique"
            description="Ce graphique montre des données fictives"
            height={200}
            noData={false}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-lg font-medium">Graphique simulé</p>
                <p className="text-sm text-gray-500">
                  (L'implémentation réelle nécessiterait react-chartjs-2)
                </p>
              </div>
            </div>
          </Chart>
        </CardContent>
      </Card>
    </div>
  );
}
