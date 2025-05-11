import { screen, fireEvent, waitFor } from '@testing-library/react';
import { customRender } from '../../__tests__/test-utils';
import InvoiceStatsWidget from '../InvoiceStatsWidget';
import { mockInvoiceStats } from '../../__tests__/test-utils';
import { useInvoiceStats } from '../../hooks/useInvoiceStats';

jest.mock('../../hooks/useInvoiceStats');

const mockUseInvoiceStats = useInvoiceStats as jest.Mock;

describe('InvoiceStatsWidget Integration', () => {
  beforeEach(() => {
    mockUseInvoiceStats.mockReturnValue({
      stats: mockInvoiceStats,
      loading: false,
      error: null
    });
  });

  it('integrates with useInvoiceStats hook', async () => {
    customRender(<InvoiceStatsWidget />);

    // Change period and verify stats update
    const periodSelect = screen.getByLabelText('Tidsperiode');
    fireEvent.change(periodSelect, { target: { value: 'Siste 7 dager' } });

    await waitFor(() => {
      expect(mockUseInvoiceStats).toHaveBeenCalledWith({
        startDate: expect.any(String),
        endDate: expect.any(String),
        status: 'all',
        groupBy: 'month'
      });
    });
  });

  it('handles loading state', async () => {
    mockUseInvoiceStats.mockReturnValue({
      stats: null,
      loading: true,
      error: null
    });

    customRender(<InvoiceStatsWidget />);

    expect(screen.getByText('Laster...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    mockUseInvoiceStats.mockReturnValue({
      stats: null,
      loading: false,
      error: 'Error fetching data'
    });

    customRender(<InvoiceStatsWidget />);

    expect(screen.getByText('Error fetching data')).toBeInTheDocument();
  });
});
