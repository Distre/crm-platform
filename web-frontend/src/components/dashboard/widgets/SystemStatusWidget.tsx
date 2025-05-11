import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type Scale,
  type CoreScaleOptions} from 'chart.js';
import { DashboardService } from '../../../services/dashboard.service';
import type { ResourceStats } from '../../../services/dashboard.service';

// Registrer Chart.js komponenter
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SystemStatusWidgetProps {
  onError?: (error: string) => void;
}

export const SystemStatusWidget: React.FC<SystemStatusWidgetProps> = ({ onError }) => {
  const [status, setStatus] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await DashboardService.getSystemStatus();
        setStatus(data);
      } catch (error) {
        console.error('Kunne ikke laste systemstatus:', error);
        onError?.('Kunne ikke laste systemstatus');
      } finally {
        setLoading(false);
      }
    };

    loadStatus();

    // Oppdater status hvert minutt
    const interval = setInterval(loadStatus, 60000);
    return () => clearInterval(interval);
  }, [onError]);

  if (loading) {
    return <div className="loading-state">Laster systemstatus...</div>;
  }

  if (!status) {
    return <div className="error-state">Kunne ikke laste systemstatus</div>;
  }

  const getStatusColor = (value: number): string => {
    if (value >= 90) return 'rgb(255, 99, 132)'; // Kritisk
    if (value >= 75) return 'rgb(255, 205, 86)'; // Advarsel
    return 'rgb(75, 192, 192)'; // OK
  };

  const chartData: ChartData<'bar'> = {
    labels: ['CPU', 'Minne', 'Disk'],
    datasets: [
      {
        label: 'Bruk i %',
        data: [status.cpuUsage, status.memoryUsage, status.diskUsage],
        backgroundColor: [
          getStatusColor(status.cpuUsage),
          getStatusColor(status.memoryUsage),
          getStatusColor(status.diskUsage)
        ]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Systemressurser'
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, value: number | string) {
            if (typeof value === 'number') {
              return `${value}%`;
            }
            return value;
          }
        }
      }
    }
  };

  const getStatusText = (value: number): string => {
    if (value >= 90) return 'Kritisk';
    if (value >= 75) return 'Høy belastning';
    return 'Normal';
  };

  return (
    <div className="widget system-status-widget">
      <div className="widget-header">
        <h3>Systemstatus</h3>
        <span className={`status-badge ${status.cpuUsage >= 90 ? 'critical' : 
          status.cpuUsage >= 75 ? 'warning' : 'normal'}`}>
          {getStatusText(Math.max(status.cpuUsage, status.memoryUsage, status.diskUsage))}
        </span>
      </div>
      <div className="widget-content">
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">CPU</span>
            <span className={`status-value ${getStatusText(status.cpuUsage).toLowerCase()}`}>
              {status.cpuUsage}%
            </span>
            <span className="status-text">{getStatusText(status.cpuUsage)}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Minne</span>
            <span className={`status-value ${getStatusText(status.memoryUsage).toLowerCase()}`}>
              {status.memoryUsage}%
            </span>
            <span className="status-text">{getStatusText(status.memoryUsage)}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Disk</span>
            <span className={`status-value ${getStatusText(status.diskUsage).toLowerCase()}`}>
              {status.diskUsage}%
            </span>
            <span className="status-text">{getStatusText(status.diskUsage)}</span>
          </div>
        </div>
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};