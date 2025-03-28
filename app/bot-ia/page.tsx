'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function BotIAPage() {
  const [pubkey, setPubkey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://mcp-c544a464bb52.herokuapp.com/optimize-node', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pubkey }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'optimisation');
      }

      const data = await response.json();
      toast({
        title: "Optimisation réussie",
        description: "Le nœud a été optimisé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'optimisation du nœud.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Bot IA - Optimisation de Nœuds</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Optimisation de Nœud</CardTitle>
            <CardDescription>
              Entrez la clé publique du nœud Lightning que vous souhaitez optimiser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOptimize} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="pubkey" className="text-sm font-medium">
                  Clé Publique du Nœud
                </label>
                <Input
                  id="pubkey"
                  value={pubkey}
                  onChange={(e) => setPubkey(e.target.value)}
                  placeholder="Entrez la clé publique du nœud"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimisation en cours...
                  </>
                ) : (
                  'Optimiser le Nœud'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentation API</CardTitle>
            <CardDescription>
              Liens vers la documentation de l'API d'optimisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Documentation Swagger</h3>
                <a
                  href="https://mcp-c544a464bb52.herokuapp.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Accéder à la documentation Swagger
                </a>
              </div>
              <div>
                <h3 className="font-medium mb-2">Documentation ReDoc</h3>
                <a
                  href="https://mcp-c544a464bb52.herokuapp.com/redoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Accéder à la documentation ReDoc
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 