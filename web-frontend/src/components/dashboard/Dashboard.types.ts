import type { DashboardConfig, WidgetConfig } from '../../services/dashboard.service';

export interface WidgetError {
  id: string;
  message: string;
}

export interface DashboardState {
  config: DashboardConfig;
  errors: WidgetError[];
  isSettingsOpen: boolean;
  selectedWidget: WidgetConfig | null;
}
