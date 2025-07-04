import { react } from "react";
import { NetworkService } from "../lib/network-service";
import { NetworkSummary } from "../lib/network-types";

export function useNetworkSummary(): { data: NetworkSummary | null; loading: boolean; error: unknown } {
  const [data, setData] = useState<NetworkSummary>(null);
  const [loading, setLoading] = useState(true);</NetworkSummary>
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {</unknown>
    const fetchData = async (): Promise<void> => {
      try {
        const summary = await NetworkService.getNetworkSummary();
        setData(summary);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
} </void>