import axios from 'axios';

export interface DashboardWidget {
  id: string;
  visible: boolean;
  order: number;
}

export interface DashboardConfig {
  widgets: DashboardWidget[];
}

const API_URL = 'http://localhost:3000/api';

export class DashboardService {
  static async getUserDashboardConfig(userId: number): Promise<DashboardConfig> {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data.dashboardConfig || { widgets: [] };
    } catch (error) {
      console.error('Error fetching dashboard config:', error);
      throw error;
    }
  }

  static async updateDashboardConfig(userId: number, config: DashboardConfig): Promise<void> {
    try {
      await axios.put(`${API_URL}/users/${userId}/dashboard-config`, config);
    } catch (error) {
      console.error('Error updating dashboard config:', error);
      throw error;
    }
  }
}
