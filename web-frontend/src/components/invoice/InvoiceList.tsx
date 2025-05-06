import { useEffect, useState } from 'react';

interface Invoice {
  id: number;
  customerId: number;
  amount: string;  // Decimal fra API kommer som string
  createdAt: string;
}

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetch('/invoice')
      .then(res => res.json())
      .then(data => setInvoices(data));
  }, []);

  return (
    <div className="card table-container">
      <h3>Fakturaer</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kunde</th>
            <th>Beløp (kr)</th>
            <th>Dato</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.customerId}</td>
              <td>{Number(inv.amount).toFixed(2)}</td>
              <td>{new Date(inv.createdAt).toLocaleDateString('no-NB')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
