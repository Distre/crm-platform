import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export type Theme = 'light' | 'dark';

export interface UserPreferences {
  theme: Theme;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  revenueData: ChartData;
}

export interface InvoiceStats {
  totalInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  monthlyRevenue: ChartData;
}

export interface ResourceStats {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export interface ProductStats {
  totalProducts: number;
  lowStock: number;
  topSelling: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
}

export interface ActivityStats {
  totalActivities: number;
  last24Hours: number;
  last7Days: number;
  last30Days: number;
  mostActiveUsers: string[];
}

export interface ActivityData {
  activities: ActivityLog[];
  stats: ActivityStats;
}

export interface ActivityFilter {
  startDate?: string;
  endDate?: string;
  actionType?: string;
  user?: string;
}

export interface WidgetConfig {
  id: string;
  title: string;
  type: 'info' | 'danger' | 'success' | 'warning' | 'purple';
  visible: boolean;
  order: number;
  size?: {
    width: number;
    height: number;
  };
  position?: {
    x: number;
    y: number;
  };
  refreshInterval?: number;
}

export interface DashboardConfig {
  widgets: WidgetConfig[];
  layout: 'grid' | 'freeform';
  refreshRate: number;
  theme: Theme;
  customColors?: {
    primary?: string;
    secondary?: string;
    background?: string;
  };
}

export class DashboardService {
  private static BASE_URL = BASE_URL;

  static async getUserDashboardConfig(userId: number): Promise<DashboardConfig> {
    try {
      const response = await axios.get<DashboardConfig>(`${this.BASE_URL}/dashboard/config/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Kunne ikke hente dashboard-konfigurasjon:', error);
      throw error;
    }
  }

  static async updateDashboardConfig(userId: number, config: DashboardConfig): Promise<void> {
    try {
      await axios.put(`${this.BASE_URL}/dashboard/config/${userId}`, config);
    } catch (error) {
      console.error('Kunne ikke oppdatere dashboard-konfigurasjon:', error);
      throw error;
    }
  }

  static async updateWidgetConfig(userId: number, widgetId: string, config: Partial<WidgetConfig>): Promise<void> {
    try {
      await axios.patch(`${this.BASE_URL}/dashboard/config/${userId}/widgets/${widgetId}`, config);
    } catch (error) {
      console.error('Kunne ikke oppdatere widget-konfigurasjon:', error);
      throw error;
    }
  }

  static async resetWidgetConfig(userId: number, widgetId: string): Promise<void> {
    try {
      await axios.delete(`${this.BASE_URL}/dashboard/config/${userId}/widgets/${widgetId}`);
    } catch (error) {
      console.error('Kunne ikke resette widget-konfigurasjon:', error);
      throw error;
    }
  }

  static async saveUserPreferences(userId: number, preferences: Partial<DashboardConfig>): Promise<void> {
    try {
      await axios.post(`${this.BASE_URL}/dashboard/preferences/${userId}`, preferences);
    } catch (error) {
      console.error('Kunne ikke lagre brukerinnstillinger:', error);
      throw error;
    }
  }

  static async getAvailableWidgets(): Promise<WidgetConfig[]> {
    try {
      const response = await axios.get<WidgetConfig[]>(`${this.BASE_URL}/dashboard/widgets`);
      return response.data;
    } catch (error) {
      console.error('Kunne ikke hente tilgjengelige widgeter:', error);
      throw error;
    }
  }

  static async getSystemStatus(): Promise<ResourceStats> {
    try {
      const response = await axios.get(`${this.BASE_URL}/system/status`);
      return response.data;
    } catch (error) {
      console.error('Kunne ikke hente systemstatus:', error);
      throw error;
    }
  }

  static async getAlerts(): Promise<{
    critical: number;
    high: number;
    medium: number;
    low: number;
  }> {
    try {
      const response = await axios.get(`${this.BASE_URL}/alerts`);
      return response.data;
    } catch (error) {
      console.error('Kunne ikke hente alarmer:', error);
      throw error;
    }
  }

  static async getUserActivity(filter?: ActivityFilter): Promise<ActivityData> {
    try {
      const response = await axios.get(`${this.BASE_URL}/dashboard/user-activity`, {
        params: filter,
      });
      return response.data;
    } catch (error) {
      throw new Error('Kunne ikke hente brukeraktivitet');
    }
  }

  static async getResourceUsage(): Promise<{
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
  }> {
    try {
      const response = await axios.get(`${this.BASE_URL}/resources`);
      return response.data;
    } catch (error) {
      console.error('Kunne ikke hente ressursbruk:', error);
      throw error;
    }
  }

  static async getCustomerStats(): Promise<CustomerStats> {
    try {
      const response = await axios.get<CustomerStats>(`${this.BASE_URL}/dashboard/customers`);
      return response.data;
    } catch (error) {
      console.error('Kunne ikke hente kundestatistikk:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Kunne ikke hente kundestatistikk: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  static async getInvoiceStats(): Promise<InvoiceStats> {
    try {
      const response = await axios.get<InvoiceStats>(`${this.BASE_URL}/dashboard/invoices`);
      return response.data;
    } catch (error) {
      console.error('Kunne ikke hente fakturastatistikk:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Kunne ikke hente fakturastatistikk: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  static async getProductStats(): Promise<ProductStats> {
    try {
      const response = await axios.get<ProductStats>(`${this.BASE_URL}/dashboard/products`);
      return response.data;
    } catch (error) {
      console.error('Kunne ikke hente produktstatistikk:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Kunne ikke hente produktstatistikk: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  static async getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
    try {
      const response = await axios.get<ActivityLog[]>(`${this.BASE_URL}/dashboard/activity?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Kunne ikke hente aktivitetslogg:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Kunne ikke hente aktivitetslogg: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  static async getUserPreferences(userId: number): Promise<UserPreferences> {
    try {
      const response = await axios.get<UserPreferences>(`${this.BASE_URL}/users/${userId}/preferences`);
      return response.data;
    } catch (error) {
      console.error('Kunne ikke hente brukerpreferanser:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return { theme: 'light' }; // Standard preferanser hvis ikke funnet
        }
        throw new Error(`Kunne ikke hente brukerpreferanser: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  static async updateUserPreferences(userId: number, preferences: Partial<UserPreferences>): Promise<void> {
    try {
      await axios.patch(`${this.BASE_URL}/users/${userId}/preferences`, preferences);
    } catch (error) {
      console.error('Kunne ikke oppdatere brukerpreferanser:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Kunne ikke oppdatere brukerpreferanser: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  static async updateTheme(userId: number, theme: Theme): Promise<void> {
    return this.updateUserPreferences(userId, { theme });
  }
}
