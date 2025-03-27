'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Revue de votre nœud
      </h1>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="channels">Canaux</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Vue d'ensemble</h2>
            {/* Contenu à venir */}
          </div>
        </TabsContent>
        <TabsContent value="channels">
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Canaux</h2>
            {/* Contenu à venir */}
          </div>
        </TabsContent>
        <TabsContent value="performance">
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Performance</h2>
            {/* Contenu à venir */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 