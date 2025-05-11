import { useEffect, useState } from 'react';
import type { Customer } from './types';

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch('/customer')
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  return (
    <div className="card p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Kunder</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">ID</th>
            <th className="text-left py-2">Navn</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id} className="border-b">
              <td className="py-2">{customer.id}</td>
              <td className="py-2">{customer.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}