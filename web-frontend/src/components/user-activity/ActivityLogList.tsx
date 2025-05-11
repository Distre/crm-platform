import React from 'react';
import ActivityLogItem from './ActivityLogItem';
import { ActivityLog } from './types';

interface ActivityLogListProps {
  activities: ActivityLog[];
  className?: string;
}

const ActivityLogList: React.FC<ActivityLogListProps> = ({ activities, className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {activities.map((activity) => (
        <ActivityLogItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
};

export default ActivityLogList;
