'use client';

import { useState, useEffect } from 'react';
import { createDaznoApiClient, ExplorerNode } from '@/lib/services/dazno-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Input } from '@/components/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/table';
import { Button } from '@/components/shared/ui/button';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function NetworkExplorer() {
  const [nodes, setNodes] = useState<ExplorerNode[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'capacity' | 'channels' | 'rank'>('rank');
  const [page, setPage] = useState(1);

  const daznoApi = createDaznoApiClient();

  const fetchNodes = async () => {
    try {
      setLoading(true);
      const result = await daznoApi.getExplorerNodes({
        search,
        sortBy,
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE,
      });
      setNodes(result.nodes);
      setTotal(result.total);
    } catch (error) {
      toast.error('Impossible de charger les nœuds du réseau');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, [search, sortBy, page]);

  const formatCapacity = (sats: number) => {
    return new Intl.NumberFormat('fr-FR').format(sats);
  };

  const formatFees = (fee: number) => {
    return `${fee} sats`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Explorateur du Réseau Lightning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Rechercher un nœud..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={sortBy} onValueChange={(value: 'capacity' | 'channels' | 'rank') => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="capacity">Capacité</SelectItem>
              <SelectItem value="channels">Canaux</SelectItem>
              <SelectItem value="rank">Rang</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rang</TableHead>
                <TableHead>Alias</TableHead>
                <TableHead>Capacité (sats)</TableHead>
                <TableHead>Canaux</TableHead>
                <TableHead>Frais moyens</TableHead>
                <TableHead>Dernière mise à jour</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : (
                nodes.map((node) => (
                  <TableRow key={node.pubkey}>
                    <TableCell>{node.rank}</TableCell>
                    <TableCell className="font-medium">{node.alias}</TableCell>
                    <TableCell>{formatCapacity(node.capacity)}</TableCell>
                    <TableCell>{node.channels}</TableCell>
                    <TableCell>
                      Base: {formatFees(node.fees.avg_base_fee)}
                      <br />
                      Taux: {node.fees.avg_fee_rate}ppm
                    </TableCell>
                    <TableCell>
                      {new Date(node.last_update).toLocaleDateString('fr-FR')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            {total} nœuds trouvés
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={page * ITEMS_PER_PAGE >= total || loading}
            >
              Suivant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
