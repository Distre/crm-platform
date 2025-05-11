import React from 'react';
import type { ActivityLog } from './types';

interface ActivityLogItemProps {
  activity: ActivityLog;
}

const ActivityLogItem: React.FC<ActivityLogItemProps> = ({ activity }) => {
  return (
    <div className="flex items-center justify-between p-2 border-b last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{activity.action}</span>
          <span className="text-gray-600">{activity.description}</span>
        </div>
        <div className="text-sm text-gray-500">
          {activity.user}
        </div>
      </div>
      <div className="text-sm text-gray-500">
        {new Date(activity.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default ActivityLogItem;
