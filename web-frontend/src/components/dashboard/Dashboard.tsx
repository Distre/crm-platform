import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/hooks';
import './Dashboard.css';
import '../../styles/theme.css';
import type { Theme } from '../../services/dashboard.service';
import type { DashboardState, WidgetError } from './Dashboard.types';
import { SystemStatusWidget } from './widgets/SystemStatusWidget';
import { AlertsWidget } from './widgets/AlertsWidget';
import { CustomerStatsWidget } from './widgets/CustomerStatsWidget';
import { ResourceUsageWidget } from './widgets/ResourceUsageWidget';
import UserActivityWidget from './widgets/UserActivityWidget';
import InvoiceStatsWidget from './widgets/InvoiceStatsWidget';

const defaultWidgets = [
  {
    id: 'system-status',
    title: 'Systemstatus',
    type: 'info',
    component: <SystemStatusWidget />,
    visible: true,
    order: 0,
    width: 100,
    height: 300
  },
  {
    id: 'alerts',
    title: 'Varsler',
    type: 'info',
    component: <AlertsWidget />,
    visible: true,
    order: 1,
    width: 100,
    height: 300
  },
  {
    id: 'customer-stats',
    title: 'Kundeoversikt',
    type: 'stats',
    component: <CustomerStatsWidget />,
    visible: true,
    order: 2,
    width: 100,
    height: 300
  },
  {
    id: 'invoice-stats',
    title: 'Fakturastatistikk',
    type: 'chart',
    component: <InvoiceStatsWidget />,
    visible: true,
    order: 3,
    width: 100,
    height: 300
  },
  {
    id: 'resource-usage',
    title: 'Ressursbruk',
    type: 'info',
    component: <ResourceUsageWidget />,
    visible: true,
    order: 4,
    width: 100,
    height: 300
  },
  {
    id: 'user-activity',
    title: 'Brukeraktivitet',
    type: 'info',
    component: <UserActivityWidget />,
    visible: true,
    order: 5,
    width: 100,
    height: 300
  }
];

const Dashboard: React.FC = () => {
  const auth = useAuth();
  const [state, setState] = useState<DashboardState>({
    config: {
      widgets: defaultWidgets,
      refreshRate: 60,
      theme: 'light' as Theme
    },
    errors: [],
    isSettingsOpen: false,
    selectedWidget: null
  });

  useEffect(() => {
    if (!auth?.isAuthenticated || !auth?.user || !auth?.user.id) {
      return;
    }

    const loadConfig = async () => {
      try {
        const config = await (await import('../../services/dashboard.service')).DashboardService.getUserDashboardConfig(auth.user.id);
        setState((prev: DashboardState) => ({ ...prev, config }));
      } catch (error) {
        console.error('Kunne ikke laste dashboard-konfigurasjon:', error);
        setState((prev: DashboardState) => ({
          ...prev,
          errors: [...prev.errors, { id: 'config-load', message: 'Kunne ikke laste konfigurasjon' }]
        }));
      }
    };

    loadConfig();
  }, [auth?.isAuthenticated, auth?.user, auth?.user?.id]);

  const handleThemeChange = async (newTheme: Theme) => {
    if (!auth?.isAuthenticated || !auth?.user || !auth?.user.id) {
      return;
    }

    try {
      await (await import('../../services/dashboard.service')).DashboardService.saveUserPreferences(auth.user.id, { theme: newTheme });
      setState((prev: DashboardState) => ({
        ...prev,
        config: {
          ...prev.config,
          theme: newTheme
        }
      }));
    } catch (error) {
      console.error('Kunne ikke oppdatere tema:', error);
      setState((prev: DashboardState) => ({
        ...prev,
        errors: [...prev.errors, { id: 'theme-change', message: 'Kunne ikke oppdatere tema' }]
      }));
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="theme-selector">
          <button onClick={() => handleThemeChange('light')} className="theme-btn">
            🌞
          </button>
          <button onClick={() => handleThemeChange('dark')} className="theme-btn">
            🌙
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {state.config.widgets.map((widget: { id: string; component: React.ReactNode; width?: number; height?: number }) => (
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

      {state.errors.length > 0 && (
        <div className="error-container">
          {state.errors.map((error: WidgetError) => (
            <div key={error.id} className="error-message">
              {error.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
