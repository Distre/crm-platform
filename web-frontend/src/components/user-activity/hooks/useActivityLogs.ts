import { useState, useEffect, useCallback } from 'react';
import type { ActivityLog, ActivityFilter } from '../types';
import { useApi } from '../../../services/api';

interface UseActivityLogsProps {
  filter?: ActivityFilter;
}

export const useActivityLogs = ({ filter }: UseActivityLogsProps = {}) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/dashboard/activity', {
        params: filter,
      });
      setActivities(response.data);
      setError(null);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Ukjent feil ved henting av aktivitetslogg');
    } finally {
      setLoading(false);
    }
  }, [api, filter]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refresh: fetchActivities,
  };
};
