import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useInvoiceStats } from '../hooks/useInvoiceStats';
import { useExport } from '../../../hooks/useExport';

export const mockInvoiceStats = {
  monthlyStats: [
    {
      month: 'Januar',
      paid: 1000,
      unpaid: 500
    },
    {
      month: 'Februar',
      paid: 1500,
      unpaid: 750
    }
  ],
  totalInvoices: 4,
  paidInvoices: 2,
  unpaidInvoices: 2
};

export const mockUseInvoiceStats = (data: any = mockInvoiceStats) => {
  jest.mock('../hooks/useInvoiceStats', () => ({
    useInvoiceStats: () => ({
      stats: data,
      loading: false,
      error: null
    })
  }));
};

export const mockUseExport = () => {
  jest.mock('../../../hooks/useExport', () => ({
    useExport: jest.fn(() => jest.fn())
  }));
};

export const customRender = (ui: React.ReactElement, options = {}) => {
  mockUseInvoiceStats();
  mockUseExport();
  return render(ui, options);
};

export * from '@testing-library/react';
