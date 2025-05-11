import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useInvoiceStats } from '../hooks/useInvoiceStats';
import { PERIOD_OPTIONS, STATUS_OPTIONS } from '../types/InvoiceStatsConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface InvoiceStatsWidgetProps {
  className?: string;
}

interface InvoiceStats {
  monthlyStats: Array<{
    month: string;
    paid: number;
    unpaid: number;
  }>;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
}

const InvoiceStatsWidget: React.FC<InvoiceStatsWidgetProps> = ({ className = '' }) => {
  const [config, setConfig] = useState({
    period: PERIOD_OPTIONS[0],
    groupBy: 'month' as 'month' | 'week' | 'year',
    status: 'all' as 'all' | 'paid' | 'unpaid'
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<InvoiceStats | null>(null);

  const { stats: invoiceStats, loading: statsLoading, error: statsError } = useInvoiceStats({
    startDate: new Date(Date.now() - config.period.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    groupBy: config.groupBy,
    status: config.status
  });

  useEffect(() => {
    setLoading(statsLoading);
    setError(statsError || null);
    setStats(invoiceStats || null);
  }, [invoiceStats, statsLoading, statsError]);

  const chartData: ChartData<'bar'> = stats ? {
    labels: stats.monthlyStats.map(s => s.month),
    datasets: [
      {
        label: 'Betalt',
        data: stats.monthlyStats.map(s => s.paid),
        backgroundColor: 'var(--success)',
        borderColor: 'var(--success)',
        borderWidth: 1,
        hoverBackgroundColor: 'var(--success-hover)',
        hoverBorderColor: 'var(--success)'
      },
      {
        label: 'Ubetalt',
        data: stats.monthlyStats.map(s => s.unpaid),
        backgroundColor: 'var(--danger)',
        borderColor: 'var(--danger)',
        borderWidth: 1,
        hoverBackgroundColor: 'var(--danger-hover)',
        hoverBorderColor: 'var(--danger)'
      }
    ]
  } : {
    labels: [],
    datasets: []
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 20,
          padding: 20,
          font: {
            size: 14,
            family: 'var(--font-family)',
            weight: 'normal'
          }
        }
      },
      title: {
        display: true,
        text: `Fakturastatistikk (${config.period.label})`,
        font: {
          size: 16,
          family: 'var(--font-family)',
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const label = context.dataset?.label || '';
            const value = context.parsed.y;
            return `${label}: €${value}`;
          }
        },
        titleFont: {
          size: 14,
          family: 'var(--font-family)',
          weight: 'bold'
        },
        bodyFont: {
          size: 14,
          family: 'var(--font-family)',
          weight: 'normal'
        },
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--muted)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (tickValue: string | number) => `€${tickValue}`,
          font: {
            size: 12,
            family: 'var(--font-family)',
            weight: 'normal'
          }
        },
        grid: {
          display: false
        }
      },
      x: {
        ticks: {
          font: {
            size: 12,
            family: 'var(--font-family)',
            weight: 'normal'
          },
          autoSkip: true,
          maxTicksLimit: 10
        },
        grid: {
          display: false
        }
      }
    }
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPeriod = PERIOD_OPTIONS.find(p => p.label === e.target.value);
    if (selectedPeriod) {
      setConfig(prev => ({ ...prev, period: selectedPeriod }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig(prev => ({ ...prev, status: e.target.value as typeof config.status }));
  };

  const handleGroupByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig(prev => ({ ...prev, groupBy: e.target.value as typeof config.groupBy }));
  };

  const handleBarClick = (_: React.MouseEvent<HTMLCanvasElement>, elements: Array<{ index: number }>) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const monthData = stats?.monthlyStats[index];
      if (monthData) {
        console.log('Month selected:', monthData.month);
      }
    }
  };

  return (
    <div className={`widget ${className}`}>
      <div className="widget-header">
        <h2>Fakturastatistikk</h2>
        <div className="controls">
          <select
            id="period"
            aria-label="Velg tidsperiode"
            value={config.period.label}
            onChange={handlePeriodChange}
          >
            {PERIOD_OPTIONS.map(option => (
              <option key={option.days} value={option.label}>{option.label}</option>
            ))}
          </select>
          <select
            id="groupBy"
            aria-label="Velg grupperingsperiode"
            value={config.groupBy}
            onChange={handleGroupByChange}
          >
            <option value="month">Måned</option>
            <option value="week">Uke</option>
            <option value="year">År</option>
          </select>
          <select
            id="status"
            aria-label="Velg fakturastatus"
            value={config.status}
            onChange={handleStatusChange}
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="widget-content">
        {loading && <div className="loading">Laster...</div>}
        {error && <div className="error">{error}</div>}
        {stats && !loading && (
          <div className="chart-container">
            <Bar
              data={chartData}
              options={chartOptions}
              onClick={handleBarClick as (e: React.MouseEvent<HTMLCanvasElement>) => void}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceStatsWidget;
