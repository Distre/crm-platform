import { render } from '@testing-library/react';

type InvoiceStats = {
  monthlyStats: { month: string; paid: number; unpaid: number }[];
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
};

export const mockInvoiceStats: InvoiceStats = {
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

export const mockUseInvoiceStats = (data: InvoiceStats = mockInvoiceStats) => {
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

export const customRender = (
  ui: React.ReactElement,
  options?: Parameters<typeof render>[1]
) => {
  mockUseInvoiceStats();
  mockUseExport();
  return render(ui, options);
};

export * from '@testing-library/react';
