import type { UserActivityListProps } from './types';

const UserActivityList = ({ activities, stats, loading, error }: UserActivityListProps) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="user-activity-list">
      <div className="stats">
        <h3>Statistikk</h3>
        <div className="stats-grid">
          <div>
            <h4>Totalt</h4>
            <p>{stats.totalActivities}</p>
          </div>
          <div>
            <h4>Siste 24 timer</h4>
            <p>{stats.last24Hours}</p>
          </div>
          <div>
            <h4>Siste 7 dager</h4>
            <p>{stats.last7Days}</p>
          </div>
          <div>
            <h4>Siste 30 dager</h4>
            <p>{stats.last30Days}</p>
          </div>
        </div>
      </div>

      <div className="activities">
        <h3>Seneste aktiviteter</h3>
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-time">{new Date(activity.timestamp).toLocaleString('nb-NO')}</div>
              <div className="activity-details">
                <div className="activity-user">{activity.user}</div>
                <div className="activity-action">{activity.action}</div>
                <div className="activity-description">{activity.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserActivityList;