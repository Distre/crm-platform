export interface DashboardConfig {
  widgets: DashboardWidget[];
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'info' | 'danger' | 'success' | 'warning' | 'purple' | 'yellow';
  content: string | React.ReactNode;
  visible: boolean;
  order: number;
}

export interface SystemStatus {
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export interface AlertStats {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface UserActivity {
  totalLogins: number;
  recentLogins: Array<{
    timestamp: string;
    ip: string;
  }>;
}

export interface ResourceUsage {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  revenue: {
    total: number;
    monthly: number;
  };
}

export interface InvoiceStats {
  totalInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalAmount: number;
  averageAmount: number;
}
