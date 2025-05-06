import { useState } from 'react';

export function InvoiceForm({ onCreated }: { onCreated: () => void }) {
  const [customerId, setCustomerId] = useState<number | ''>('');
  const [amount, setAmount] = useState<number | ''>('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customerId === '' || amount === '') return;
    await fetch('/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, amount }),
    });
    setCustomerId('');
    setAmount('');
    onCreated();
  };

  return (
    <div className="invoice-card">
      <h3>Ny faktura</h3>
      <form onSubmit={submit}>
        <div className="invoice-form-group">
          <label htmlFor="cust">Kunde-ID</label>
          <input
            id="cust"
            type="number"
            value={customerId}
            onChange={e => setCustomerId(+e.target.value)}
            required
          />
        </div>
        <div className="invoice-form-group">
          <label htmlFor="amt">Beløp</label>
          <input
            id="amt"
            type="number"
            step="0.01"
            value={amount}
            onChange={e => setAmount(+e.target.value)}
            required
          />
        </div>
        <button type="submit" className="invoice-btn">
          Opprett faktura
        </button>
      </form>
    </div>
  );
}
