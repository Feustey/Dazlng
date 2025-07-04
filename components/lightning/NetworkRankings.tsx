'use client';

import { useState, useEffect } from 'react';
import { createDaznoApiClient, NetworkRanking } from '@/lib/services/dazno-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/table';
import toast from 'react-hot-toast';
import { Loader2 } from '@/components/shared/ui/IconRegistry';


type RankingCategory = 'capacity' | 'channels' | 'revenue' | 'centrality';

const CATEGORIES: { value: RankingCategory; label: string }[] = [
  { value: 'capacity', label: "NetworkRankings.networkrankingsnetworkrankings" },
  { value: 'channels', label: 'Canaux' },
  { value: 'revenue', label: 'Revenus' },
  { value: 'centrality', label: "NetworkRankings.networkrankingsnetworkrankings" },
];

export default function NetworkRankings() {
  const [rankings, setRankings] = useState<NetworkRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<RankingCategory>('capacity');

  const daznoApi = createDaznoApiClient();

  const fetchRankings = async (cat: RankingCategory) => {
    try {
      setLoading(true);
      const result = await daznoApi.getNetworkRankings(cat);
      setRankings(result);
    } catch (error) {
      toast.error('Impossible de charger les classements du réseau');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings(category);
  }, [category]);

  const formatScore = (score: number) => {
    switch (category) {
      case 'capacity':
        return `${new Intl.NumberFormat('fr-FR').format(score)} sats`;
      case 'channels':
        return score.toString();
      case 'revenue':
        return `${new Intl.NumberFormat('fr-FR').format(score)} sats/mois`;
      case 'centrality':
        return score.toFixed(2);
      default:
        return score.toString();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('NetworkRankings.classements_du_rseau_lightning')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={category} onValueChange={(value) => setCategory(value as RankingCategory)}>
          <TabsList className="grid w-full grid-cols-4">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {CATEGORIES.map((cat) => (
            <TabsContent key={cat.value} value={cat.value}>
              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rang</TableHead>
                      <TableHead>Alias</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : (
                      rankings.map((node) => (
                        <TableRow key={node.pubkey}>
                          <TableCell>{node.rank}</TableCell>
                          <TableCell className="font-medium">{node.alias}</TableCell>
                          <TableCell>{formatScore(node.score)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
