import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Dashboard.css';
import '../../styles/theme.css';
import { DashboardService } from '../../services/dashboard.service';
import type { DashboardConfig } from '../../services/dashboard.service';

type WidgetType = {
  id: string;
  title: string;
  type: 'info' | 'danger' | 'success' | 'warning' | 'purple' | 'yellow';
  content: string | React.ReactNode;
  visible: boolean;
  order: number;
};

const defaultWidgets: WidgetType[] = [
  {
    id: 'system-status',
    title: 'Systemstatus',
    type: 'info',
    content: <div className="chart-placeholder">Graf</div>,
    visible: true,
    order: 0
  },
  {
    id: 'alerts',
    title: 'Hendelses-alarm',
    type: 'danger',
    content: 'Kritisk: 2 | Høy: 5 | Medium: 12',
    visible: true,
    order: 1
  },
  {
    id: 'user-activity',
    title: 'Brukeraktivitet',
    type: 'success',
    content: 'Innlogginger: 123',
    visible: true,
    order: 2
  },
  {
    id: 'resource-usage',
    title: 'Ressursbruk',
    type: 'warning',
    content: <div className="chart-placeholder">Graf</div>,
    visible: true,
    order: 3
  },
  {
    id: 'integrations',
    title: 'Integrasjoner',
    type: 'purple',
    content: 'API: OK | E-post: Feil',
    visible: true,
    order: 4
  },
  {
    id: 'kpi',
    title: 'Nøkkeltall (KPIs)',
    type: 'yellow',
    content: 'Omsetning: kr 125k',
    visible: true,
    order: 5
  }
];

export const Dashboard = () => {
  const [theme, setTheme] = useState('light');
  const [widgets, setWidgets] = useState<WidgetType[]>(defaultWidgets);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // TODO: Hent brukerens ID fra auth context
  const userId = 1; // Midlertidig hardkodet verdi

  useEffect(() => {
    loadDashboardConfig();
  }, []);

  const loadDashboardConfig = async () => {
    try {
      setIsLoading(true);
      const config = await DashboardService.getUserDashboardConfig(userId);
      
      if (config.widgets.length > 0) {
        // Oppdater widgets med brukerens konfigurasjon
        const updatedWidgets = defaultWidgets.map(widget => {
          const userWidget = config.widgets.find(w => w.id === widget.id);
          return userWidget ? { ...widget, visible: userWidget.visible, order: userWidget.order } : widget;
        });
        setWidgets(updatedWidgets);
      }
    } catch (error) {
      console.error('Kunne ikke laste dashboard-konfigurasjon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDashboardConfig = async () => {
    try {
      const config: DashboardConfig = {
        widgets: widgets.map(({ id, visible, order }) => ({ id, visible, order }))
      };
      await DashboardService.updateDashboardConfig(userId, config);
      setIsCustomizing(false);
    } catch (error) {
      console.error('Kunne ikke lagre dashboard-konfigurasjon:', error);
      // TODO: Vis feilmelding til bruker
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(currentWidgets =>
      currentWidgets.map(widget =>
        widget.id === id ? { ...widget, visible: !widget.visible } : widget
      )
    );
  };

  const moveWidget = (id: string, direction: 'up' | 'down') => {
    setWidgets(currentWidgets => {
      const index = currentWidgets.findIndex(w => w.id === id);
      if (index === -1) return currentWidgets;

      const newWidgets = [...currentWidgets];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= newWidgets.length) {
        return currentWidgets;
      }

      // Swap orders
      const currentOrder = newWidgets[index].order;
      newWidgets[index] = { ...newWidgets[index], order: newWidgets[targetIndex].order };
      newWidgets[targetIndex] = { ...newWidgets[targetIndex], order: currentOrder };

      return newWidgets.sort((a, b) => a.order - b.order);
    });
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>SnapCrm</h2>
        <Link to="/" className={`nav-item ${isActive('/')}`}>
          <span>📊</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/customers" className={`nav-item ${isActive('/customers')}`}>
          <span>👥</span>
          <span>Kunder</span>
        </Link>
        <Link to="/invoices" className={`nav-item ${isActive('/invoices')}`}>
          <span>📄</span>
          <span>Fakturaer</span>
        </Link>
        <Link to="/products" className={`nav-item ${isActive('/products')}`}>
          <span>📦</span>
          <span>Produkter</span>
        </Link>
        <Link to="/settings" className={`nav-item ${isActive('/settings')}`}>
          <span>⚙️</span>
          <span>Innstillinger</span>
        </Link>
      </aside>

      <div className="content-area">
        <header className="topnav">
          <div className="logo">Distre</div>
          <div className="search">
            <input type="text" placeholder="Søk..." />
          </div>
          <div className="actions">
            <button onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
            <div className="icon">🔔</div>
            <div className="user">
              Bruker<br />
              <small>bruker@distre.no</small>
            </div>
          </div>
        </header>

        <main className="main-content">
          {location.pathname === '/' && (
            <>
              <div className="dashboard-controls">
                <button 
                  className="customize-btn"
                  onClick={() => isCustomizing ? saveDashboardConfig() : setIsCustomizing(true)}
                  disabled={isLoading}
                >
                  {isCustomizing ? 'Lagre oppsett' : 'Tilpass dashboard'}
                </button>
              </div>
              {isLoading ? (
                <div className="loading-state">
                  <p>Laster dashboard...</p>
                </div>
              ) : (
                <div className="widgets">
                {widgets
                  .filter(widget => widget.visible)
                  .sort((a, b) => a.order - b.order)
                  .map(widget => (
                    <div key={widget.id} className={`card ${widget.type}`}>
                      <div className="card-header">
                        <h3>{widget.title}</h3>
                        {isCustomizing && (
                          <div className="widget-controls">
                            <button 
                              onClick={() => moveWidget(widget.id, 'up')}
                              disabled={widget.order === 0}
                            >
                              ⬆️
                            </button>
                            <button 
                              onClick={() => moveWidget(widget.id, 'down')}
                              disabled={widget.order === widgets.length - 1}
                            >
                              ⬇️
                            </button>
                            <button onClick={() => toggleWidgetVisibility(widget.id)}>
                              ❌
                            </button>
                          </div>
                        )}
                      </div>
                      {typeof widget.content === 'string' ? (
                        <p>{widget.content}</p>
                      ) : (
                        widget.content
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isCustomizing && (
                <div className="hidden-widgets">
                  <h4>Skjulte widgets</h4>
                  <div className="widget-list">
                    {widgets
                      .filter(widget => !widget.visible)
                      .map(widget => (
                        <div key={widget.id} className="hidden-widget">
                          <span>{widget.title}</span>
                          <button onClick={() => toggleWidgetVisibility(widget.id)}>
                            Vis
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
