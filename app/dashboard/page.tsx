"use client";

import { useNodeInfo } from "@/app/hooks/useNodeInfo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function DashboardPage() {
  const { pubkey, nodePubkey, lightningAddress, isLoading } = useNodeInfo();

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p>Chargement...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 gradient-text">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-glass animate-slide-up">
          <CardHeader>
            <CardTitle className="text-gradient">
              Informations d'identification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Pubkey Alby
                </dt>
                <dd className="mt-1 text-sm break-all">{pubkey}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Lightning Address
                </dt>
                <dd className="mt-1 text-sm">
                  {lightningAddress || "Non configurée"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="card-glass animate-slide-up [animation-delay:200ms]">
          <CardHeader>
            <CardTitle className="text-gradient">Nœud Lightning</CardTitle>
          </CardHeader>
          <CardContent>
            {nodePubkey ? (
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Node Pubkey
                  </dt>
                  <dd className="mt-1 text-sm break-all">{nodePubkey}</dd>
                </div>
                {/* Ajouter d'autres informations du nœud ici */}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun nœud Lightning connecté à votre compte Alby.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
