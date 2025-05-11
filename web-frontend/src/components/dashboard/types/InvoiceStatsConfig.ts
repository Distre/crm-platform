export type InvoiceStatsPeriod = {
  label: string;
  days: number;
};

export const PERIOD_OPTIONS: InvoiceStatsPeriod[] = [
  { label: 'Siste 7 dager', days: 7 },
  { label: 'Siste 30 dager', days: 30 },
  { label: 'Siste 90 dager', days: 90 },
  { label: 'Siste år', days: 365 }
];

export type InvoiceStatsGroupBy = 'day' | 'week' | 'month' | 'year';

export const GROUP_BY_OPTIONS = [
  { label: 'Dag', value: 'day' as InvoiceStatsGroupBy },
  { label: 'Uke', value: 'week' as InvoiceStatsGroupBy },
  { label: 'Måned', value: 'month' as InvoiceStatsGroupBy },
  { label: 'År', value: 'year' as InvoiceStatsGroupBy }
] as const;

export type InvoiceStatsStatus = 'all' | 'paid' | 'unpaid';

export const STATUS_OPTIONS = [
  { label: 'Alle', value: 'all' as InvoiceStatsStatus },
  { label: 'Betalt', value: 'paid' as InvoiceStatsStatus },
  { label: 'Ubetalt', value: 'unpaid' as InvoiceStatsStatus }
] as const;

export interface InvoiceStatsConfig {
  period: InvoiceStatsPeriod;
  groupBy: InvoiceStatsGroupBy;
  status: InvoiceStatsStatus;
}
