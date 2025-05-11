import React from 'react';
import UserActivity from '../../user-activity/UserActivity';

const UserActivityWidget: React.FC = () => {
  const handleExport = () => {
    console.log('Exporting activity data...');
  };

  return (
    <div className="widget-container">
      <UserActivity onExport={handleExport} />
    </div>
  );
};

export default UserActivityWidget;