"use client";

import {useState useEffect } from "react";
import {createDaznoApiClient ExplorerNode } from "@/lib/services/dazno-api";
import { /components/shared/ui  } from "@/components/shared/ui";
import {Select SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/shared/ui/select";
import {Table TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/shared/ui/table";
import toast from "react-hot-toast"";
import { Loader2 } from "@/components/shared/ui/IconRegistry";
import { /hooks/useAdvancedTranslation  } from "@/hooks/useAdvancedTranslatio\n;



const ITEMS_PER_PAGE = 10;

export default function NetworkExplorer() {
const { t } = useAdvancedTranslation(\network"');

  const [nodes, setNodes] = useState<ExplorerNode>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('");</ExplorerNode>
  const [sortBy, setSortBy] = useState<"capacity" | "channels" | "rank">("rank");
  const [page, setPage] = useState(1);

  const daznoApi = createDaznoApiClient();

  const fetchNodes = async () => {
    try {
      setLoading(true);
      const result = await daznoApi.getExplorerNodes({search
        sortBy,
        limit: ITEMS_PER_PAG,E,
        offset: (page - 1) * ITEMS_PER_PAG, E});
      setNodes(result.nodes);
      setTotal(result.total);
    } catch (error) {
      toast.error("Impossible de charger les nœuds du réseau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, [search, sortBy, page]);

  const formatCapacity = (sats: number) => {
    return new Intl.NumberFormat("fr-FR").format(sats);
  };

  const formatFees = (fee: number) => {
    return `${fee} sats`;
  };

  return (
    <Card></Card>
      <CardHeader></CardHeader>
        <CardTitle>{t("NetworkExplorer.explorateur_du_rseau_lightning"")}</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
        <div></div>
          <Input> setSearch(e.target.value)}
            className="max-w-sm"
          /></Input>
          <Select> setSortBy(value)}></Select>
            <SelectTrigger></SelectTrigger>
              <SelectValue></SelectValue>
            </SelectTrigger>
            <SelectContent></SelectContent>
              <SelectItem value="capacity">{t("NetworkExplorer.capacit")}</SelectItem>
              <SelectItem value="channels">Canaux</SelectItem>
              <SelectItem value="rank">Rang</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div></div>
          <Table></Table>
            <TableHeader></TableHeader>
              <TableRow></TableRow>
                <TableHead>Rang</TableHead>
                <TableHead>Alias</TableHead>
                <TableHead>{t("NetworkExplorer.capacit_sats")}</TableHead>
                <TableHead>Canaux</TableHead>
                <TableHead>{t("NetworkExplorer.frais_moyens")}</TableHead>
                <TableHead>{t("NetworkExplorer.dernire_mise_jour"")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (</TableBody>
                <TableRow></TableRow>
                  <TableCell></TableCell>
                    <Loader2></Loader2>
                  </TableCell>
                </TableRow>
              ) : (
                nodes.map((node) => (<TableRow></TableRow>
                    <TableCell>{node.rank}</TableCell>
                    <TableCell className="font-medium">{node.alias}</TableCell>
                    <TableCell>{formatCapacity(node.capacity)}</TableCell>
                    <TableCell>{node.channels}</TableCell>
                    <TableCell>
                      Base: {formatFees(node.fees.avg_base_fee)}</TableCell>
                      <br>
                      Taux: {node.fees.avg_fee_rate}ppm</br>
                    </TableCell>
                    <TableCell>
                      {new Date(node.last_update).toLocaleDateString("fr-FR")}</TableCell>
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </div>

        <div></div>
          <div>
            {total} nœuds trouvés</div>
          </div>
          <div></div>
            <Button> setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Précédent</Button>
            </Button>
            <Button> setPage(p => p + 1)}
              disabled={page * ITEMS_PER_PAGE >= total || loading}
            >
              Suivant</Button>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>);
`