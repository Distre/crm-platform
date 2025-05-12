import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/hooks';
import './Dashboard.css';
import '../../styles/theme.css';
import type { Theme } from '../../services/dashboard.service';
import type { DashboardState } from './Dashboard.types';
import { SystemStatusWidget } from './widgets/SystemStatusWidget';
import { AlertsWidget } from './widgets/AlertsWidget';
import { CustomerStatsWidget } from './widgets/CustomerStatsWidget';
import { ResourceUsageWidget } from './widgets/ResourceUsageWidget';
import UserActivityWidget from './widgets/UserActivityWidget';
import InvoiceStatsWidget from './widgets/InvoiceStatsWidget';

type WidgetVisual = {
  id: string;
  component: React.ReactNode;
  width?: number;
  height?: number;
};

const defaultWidgetsConfig = [
  {
    id: 'system-status',
    title: 'Systemstatus',
    type: 'info' as const,
    visible: true,
    order: 0
  },
  {
    id: 'alerts',
    title: 'Varsler',
    type: 'warning' as const,
    visible: true,
    order: 1
  },
  {
    id: 'customer-stats',
    title: 'Kundeoversikt',
    type: 'success' as const,
    visible: true,
    order: 2
  },
  {
    id: 'invoice-stats',
    title: 'Fakturastatistikk',
    type: 'purple' as const,
    visible: true,
    order: 3
  },
  {
    id: 'resource-usage',
    title: 'Ressursbruk',
    type: 'danger' as const,
    visible: true,
    order: 4
  },
  {
    id: 'user-activity',
    title: 'Brukeraktivitet',
    type: 'info' as const,
    visible: true,
    order: 5
  }
];

const defaultVisuals: WidgetVisual[] = [
  { id: 'system-status', component: <SystemStatusWidget />, width: 100, height: 300 },
  { id: 'alerts', component: <AlertsWidget />, width: 100, height: 300 },
  { id: 'customer-stats', component: <CustomerStatsWidget />, width: 100, height: 300 },
  { id: 'invoice-stats', component: <InvoiceStatsWidget />, width: 100, height: 300 },
  { id: 'resource-usage', component: <ResourceUsageWidget />, width: 100, height: 300 },
  { id: 'user-activity', component: <UserActivityWidget />, width: 100, height: 300 }
];

const Dashboard: React.FC = () => {
  const auth = useAuth();
  const userId = auth?.user?.id;

  const [state, setState] = useState<DashboardState>({
    config: {
      widgets: defaultWidgetsConfig,
      refreshRate: 60,
      theme: 'light' as Theme,
      layout: 'grid'
    },
    errors: [],
    isSettingsOpen: false,
    selectedWidget: null
  });

  useEffect(() => {
    if (!auth?.isAuthenticated || !userId) return;

    const loadConfig = async () => {
      try {
        const config = await (await import('../../services/dashboard.service')).DashboardService.getUserDashboardConfig(userId);
        setState((prev) => ({ ...prev, config }));
      } catch (error) {
        console.error('Kunne ikke laste dashboard-konfigurasjon:', error);
      }
    };

    loadConfig();
  }, [auth?.isAuthenticated, userId]);

  const handleThemeChange = async (newTheme: Theme) => {
    if (!auth?.isAuthenticated || !userId) return;

    try {
      await (await import('../../services/dashboard.service')).DashboardService.saveUserPreferences(userId, { theme: newTheme });
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, theme: newTheme }
      }));
    } catch (error) {
      console.error('Kunne ikke oppdatere tema:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard ({state.config.theme})</h1>
        <div className="theme-selector">
          <button onClick={() => handleThemeChange('light')} className="theme-btn">🌞</button>
          <button onClick={() => handleThemeChange('dark')} className="theme-btn">🌙</button>
        </div>
      </div>

      <div className="dashboard-content">
        {defaultVisuals.map((widget) => (
          <div
            key={widget.id}
            className={`widget-container ${widget.width ? 'has-width' : ''} ${widget.height ? 'has-height' : ''}`}
            data-width={widget.width}
            data-height={widget.height}
          >
            {widget.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
