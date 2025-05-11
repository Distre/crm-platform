import { useState } from 'react';
import type { CustomerFormData } from './types';

export function CustomerForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name === '') return;
    
    const customerData: CustomerFormData = {
      name
    };
    
    await fetch('/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });
    setName('');
    onCreated();
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mb-6">
      <h3 className="text-xl font-semibold mb-4">Ny kunde</h3>
      <form onSubmit={submit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Navn</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Opprett kunde
        </button>
      </form>
    </div>
  );
}