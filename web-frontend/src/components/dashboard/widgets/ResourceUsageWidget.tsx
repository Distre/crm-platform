import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type TooltipItem
} from 'chart.js';
import { DashboardService } from '../../../services/dashboard.service';
import type { ResourceStats } from '../../../services/dashboard.service';

// Registrer Chart.js komponenter
ChartJS.register(ArcElement, Tooltip, Legend);

interface ResourceUsageWidgetProps {
  onError?: (error: string) => void;
}

export const ResourceUsageWidget: React.FC<ResourceUsageWidgetProps> = ({ onError }) => {
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await DashboardService.getResourceUsage();
        setStats({
          cpuUsage: data.cpu.usage,
          memoryUsage: data.memory.percentage,
          diskUsage: data.disk.percentage
        });
      } catch (error) {
        console.error('Kunne ikke laste ressursbruk:', error);
        onError?.('Kunne ikke laste ressursbruk');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [onError]);

  if (loading) {
    return <div className="loading-state">Laster ressursbruk...</div>;
  }

  if (!stats) {
    return <div className="error-state">Kunne ikke laste ressursbruk</div>;
  }

  const chartData: ChartData<'doughnut'> = {
    labels: ['CPU', 'Minne', 'Disk'],
    datasets: [{
      data: [
        stats.cpuUsage,
        stats.memoryUsage,
        stats.diskUsage
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Systemressursbruk'
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const label = context.label || '';
            const value = context.raw as number;
            return `${label}: ${value}%`;
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <div className="widget resource-usage-widget">
      <div className="widget-header">
        <h3>Ressursbruk</h3>
      </div>
      <div className="widget-content">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">CPU</span>
            <span className="stat-value">{stats.cpuUsage}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Minne</span>
            <span className="stat-value">{stats.memoryUsage}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Disk</span>
            <span className="stat-value">{stats.diskUsage}%</span>
          </div>
        </div>
        <div className="chart-container">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};