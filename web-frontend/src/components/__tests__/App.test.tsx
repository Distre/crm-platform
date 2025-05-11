import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';


vi.mock('../invoice/InvoiceForm', () => ({
  InvoiceForm: () => <div data-testid="invoice-form">Invoice Form</div>
}));

vi.mock('../invoice/InvoiceList', () => ({
  InvoiceList: () => <div data-testid="invoice-list">Invoice List</div>
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
    isAuthenticated: true,
  }),
}));

import App from '../../App';

describe('App', () => {
  it('renders invoice form and list', () => {
    render(<App />);
    expect(screen.getByTestId('invoice-form')).toBeInTheDocument();
    expect(screen.getByTestId('invoice-list')).toBeInTheDocument();
  });
});
