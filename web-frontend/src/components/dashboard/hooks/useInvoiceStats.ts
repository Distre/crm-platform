import { useState, useEffect } from 'react';
import { useApi } from '../../../services/api';
import type { InvoiceStats, InvoiceStatsFilters } from '../../../types/invoice';

export const useInvoiceStats = ({
  startDate,
  endDate,
  status = 'all',
  groupBy = 'month'
}: InvoiceStatsFilters) => {
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/invoice/stats', {
          params: { startDate, endDate, status, groupBy }
        });
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError('Kunne ikke hente fakturastatistikk');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [startDate, endDate, status, groupBy, api]);

  return {
    stats,
    loading,
    error,
    refetch: () => fetchStats()
  };
};
