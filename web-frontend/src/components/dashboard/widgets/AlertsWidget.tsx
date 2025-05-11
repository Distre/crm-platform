import React, { useEffect, useState } from 'react';
import { DashboardService } from '../../../services/dashboard.service';

interface AlertStats {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface AlertsWidgetProps {
  onError?: (error: string) => void;
}

export const AlertsWidget: React.FC<AlertsWidgetProps> = ({ onError }) => {
  const [alerts, setAlerts] = useState<AlertStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await DashboardService.getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Kunne ikke laste varsler:', error);
        onError?.('Kunne ikke laste varsler');
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, [onError]);

  if (loading) {
    return <div className="loading-state">Laster varsler...</div>;
  }

  if (!alerts) {
    return <div className="error-state">Kunne ikke laste varsler</div>;
  }

  const totalAlerts = alerts.critical + alerts.high + alerts.medium + alerts.low;

  return (
    <div className="widget alerts-widget">
      <div className="widget-header">
        <h3>Systemvarsler</h3>
        {totalAlerts > 0 && (
          <span className="total-badge">{totalAlerts}</span>
        )}
      </div>
      <div className="widget-content">
        <div className="alerts-grid">
          <div className={`alert-item critical ${alerts.critical > 0 ? 'has-alerts' : ''}`}>
            <span className="alert-label">Kritiske</span>
            <span className="alert-value">{alerts.critical}</span>
          </div>
          <div className={`alert-item high ${alerts.high > 0 ? 'has-alerts' : ''}`}>
            <span className="alert-label">Høy</span>
            <span className="alert-value">{alerts.high}</span>
          </div>
          <div className={`alert-item medium ${alerts.medium > 0 ? 'has-alerts' : ''}`}>
            <span className="alert-label">Medium</span>
            <span className="alert-value">{alerts.medium}</span>
          </div>
          <div className={`alert-item low ${alerts.low > 0 ? 'has-alerts' : ''}`}>
            <span className="alert-label">Lav</span>
            <span className="alert-value">{alerts.low}</span>
          </div>
        </div>
        {totalAlerts === 0 ? (
          <div className="no-alerts-message">
            Ingen aktive varsler
          </div>
        ) : (
          <div className="alert-summary">
            <p>Du har totalt {totalAlerts} aktive varsler som krever oppmerksomhet.</p>
            {alerts.critical > 0 && (
              <p className="critical-warning">
                {alerts.critical} kritiske varsler krever umiddelbar handling!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};