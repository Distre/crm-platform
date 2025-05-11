export interface InvoiceStats {
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  monthlyStats: {
    month: string;
    total: number;
    paid: number;
    unpaid: number;
  }[];
}

export interface InvoiceStatsFilters {
  startDate: string;
  endDate: string;
  status?: 'all' | 'paid' | 'unpaid';
  groupBy?: 'month' | 'week' | 'year';
}
