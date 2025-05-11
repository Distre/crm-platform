import { useState, useEffect } from 'react';
import type { UserActivityProps, ActivityLog, ActivityStats, ActivityFilter } from './types';
import { UserActivityForm } from './UserActivityForm';
import UserActivityList from './UserActivityList';
import { DashboardService } from '../../services/dashboard.service';

const UserActivity = ({ onRefresh, onExport }: UserActivityProps) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    totalActivities: 0,
    last24Hours: 0,
    last7Days: 0,
    last30Days: 0,
    mostActiveUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<ActivityFilter>({});

  const fetchActivities = async (filter?: ActivityFilter) => {
    try {
      setLoading(true);
      setError(undefined);
      const data = await DashboardService.getUserActivity(filter);
      setActivities(data.activities);
      setStats(data.stats);
    } catch (err) {
      console.error('Feil ved henting av aktiviteter:', err);
      setError(err instanceof Error ? err.message : 'Kunne ikke hente aktiviteter');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleFilter = async (newFilter: ActivityFilter) => {
    setFilter(newFilter);
    await fetchActivities(newFilter);
  };

  const handleRefresh = async () => {
    setFilter({});
    await fetchActivities();
    onRefresh?.();
  };

  return (
    <div className="user-activity">
      <header>
        <h2>Brukeraktivitet</h2>
        <div className="header-actions">
          <button onClick={handleRefresh} className="refresh-button">
            Oppdater
          </button>
          <button onClick={onExport} className="export-button">
            Eksporter
          </button>
        </div>
      </header>

      <div className="content">
        <UserActivityForm onSubmit={handleFilter} filter={filter} />
        <UserActivityList
          activities={activities}
          stats={stats}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default UserActivity;