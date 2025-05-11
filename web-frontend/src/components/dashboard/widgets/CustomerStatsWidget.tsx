import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type Scale,
  type CoreScaleOptions
} from 'chart.js';
import { DashboardService } from '../../../services/dashboard.service';
import type { CustomerStats } from '../../../services/dashboard.service';

// Registrer Chart.js komponenter
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CustomerStatsWidgetProps {
  onError?: (error: string) => void;
}

export const CustomerStatsWidget: React.FC<CustomerStatsWidgetProps> = ({ onError }) => {
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await DashboardService.getCustomerStats();
        setStats(data);
      } catch (error) {
        console.error('Kunne ikke laste kundestatistikk:', error);
        onError?.('Kunne ikke laste kundestatistikk');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [onError]);

  if (loading) {
    return <div className="loading-state">Laster kundestatistikk...</div>;
  }

  if (!stats) {
    return <div className="error-state">Kunne ikke laste kundestatistikk</div>;
  }

  const chartData = {
    labels: stats.revenueData.labels,
    datasets: [
      {
        label: 'Omsetning',
        data: stats.revenueData.values,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Kundeomsetning over tid'
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, value: number | string) {
            if (typeof value === 'number') {
              return `${value.toLocaleString()} kr`;
            }
            return value;
          }
        }
      }
    }
  };

  return (
    <div className="widget customer-stats-widget">
      <div className="widget-header">
        <h3>Kundestatistikk</h3>
      </div>
      <div className="widget-content">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Totalt antall kunder</span>
            <span className="stat-value">{stats.totalCustomers}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Aktive kunder</span>
            <span className="stat-value">{stats.activeCustomers}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Nye kunder</span>
            <span className="stat-value">{stats.newCustomers}</span>
          </div>
        </div>
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};