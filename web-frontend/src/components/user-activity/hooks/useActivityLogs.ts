import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/dashboard/activity', {
          params: filter,
        });
        setActivities(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [filter, api]);

  return {
    activities,
    loading,
    error,
    refresh: () => fetchActivities(),
  };
};
