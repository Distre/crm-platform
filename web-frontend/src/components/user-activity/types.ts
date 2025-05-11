export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
}

export interface ActivityFilter {
  startDate?: string;
  endDate?: string;
  actionType?: string;
  user?: string;
}

export interface ActivityStats {
  totalActivities: number;
  last24Hours: number;
  last7Days: number;
  last30Days: number;
  mostActiveUsers: string[];
}

export interface UserActivityProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export interface UserActivityFormProps {
  onSubmit: (filter: ActivityFilter) => void;
  filter: ActivityFilter;
}

export interface UserActivityListProps {
  activities: ActivityLog[];
  stats: ActivityStats;
  loading: boolean;
  error?: string;
}