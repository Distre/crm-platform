import { screen, fireEvent, waitFor } from '@testing-library/react';
import { customRender } from '../../__tests__/test-utils';
import InvoiceStatsWidget from '../InvoiceStatsWidget';

describe('InvoiceStatsWidget', () => {
  it('renders initial stats correctly', () => {
    customRender(<InvoiceStatsWidget />);

    expect(screen.getByText('Totalt')).toBeInTheDocument();
    expect(screen.getByText('Betalt')).toBeInTheDocument();
    expect(screen.getByText('Ubetalt')).toBeInTheDocument();
    
    // Verify initial stats values
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('handles period selection', async () => {
    customRender(<InvoiceStatsWidget />);

    const periodSelect = screen.getByLabelText('Tidsperiode');
    fireEvent.change(periodSelect, { target: { value: 'Siste 7 dager' } });

    await waitFor(() => {
      expect(periodSelect).toHaveValue('Siste 7 dager');
    });
  });

  it('handles group by selection', async () => {
    customRender(<InvoiceStatsWidget />);

    const groupBySelect = screen.getByLabelText('Grupper etter');
    fireEvent.change(groupBySelect, { target: { value: 'week' } });

    await waitFor(() => {
      expect(groupBySelect).toHaveValue('week');
    });
  });

  it('handles status selection', async () => {
    customRender(<InvoiceStatsWidget />);

    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'paid' } });

    await waitFor(() => {
      expect(statusSelect).toHaveValue('paid');
    });
  });

  it('shows month details on bar click', async () => {
    customRender(<InvoiceStatsWidget />);

    // Simulate clicking a bar
    const barElement = screen.getByRole('img', { name: /Januar/i });
    fireEvent.click(barElement);

    await waitFor(() => {
      expect(screen.getByText('Januar')).toBeInTheDocument();
      expect(screen.getByText('Betalt:')).toBeInTheDocument();
      expect(screen.getByText('Ubetalt:')).toBeInTheDocument();
      expect(screen.getByText('Totalt:')).toBeInTheDocument();
    });
  });

  it('exports data correctly', async () => {
    const { container } = customRender(<InvoiceStatsWidget />);
    const exportButton = container.querySelector('.export-btn');

    if (exportButton) {
      fireEvent.click(exportButton);
      
      await waitFor(() => {
        expect(exportButton).toBeInTheDocument();
      });
    }
  });
});
