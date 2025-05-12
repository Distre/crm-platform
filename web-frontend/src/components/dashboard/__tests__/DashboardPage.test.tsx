import { render, screen } from '@testing-library/react';
import DashboardPage from '../Dashboard';

jest.mock('../../invoice/InvoiceForm', () => ({
  InvoiceForm: () => <div data-testid="invoice-form">Invoice Form</div>
}));

jest.mock('../../invoice/InvoiceList', () => ({
  InvoiceList: () => <div data-testid="invoice-list">Invoice List</div>
}));

describe('DashboardPage', () => {
  it('renders invoice form and list', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('invoice-form')).toBeInTheDocument();
    expect(screen.getByTestId('invoice-list')).toBeInTheDocument();
  });
});
