import React from 'react';
import type { Activity, ActivityAction } from '../../types/activity';
import { format } from 'date-fns';
import { faCircleInfo, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ActivityLogProps {
  activity: Activity;
  className?: string;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activity, className = '' }) => {
  const getActionIcon = (action: ActivityAction): IconDefinition => {
    switch (action) {
      case 'CREATE':
        return faCircleCheck;
      case 'UPDATE':
        return faCircleInfo;
      case 'DELETE':
        return faCircleXmark;
      default:
        return faCircleInfo;
    }
  };

  const getActionColor = (action: ActivityAction) => {
    switch (action) {
      case 'CREATE':
        return 'text-green-500';
      case 'UPDATE':
        return 'text-blue-500';
      case 'DELETE':
        return 'text-red-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`activity-log ${className}`}>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon
          icon={getActionIcon(activity.action as ActivityAction)}
          className={`w-4 h-4 ${getActionColor(activity.action as ActivityAction)}`}
        />
        <span className="flex-1">
          <span className="font-medium">{activity.action}</span>
          <span className="text-gray-500"> - {activity.description}</span>
        </span>
        <span className="text-sm text-gray-500">
          {format(activity.timestamp, 'dd.MM.yyyy HH:mm')}
        </span>
      </div>
      {activity.resourceId && activity.resourceType && (
        <div className="mt-1 text-sm text-gray-500">
          <span className="font-medium">{activity.resourceType}:</span>{' '}
          {activity.resourceId}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
