import { useState } from 'react';
import { InvoiceForm } from './components/invoice/InvoiceForm';
import { InvoiceList } from './components/invoice/InvoiceList';
function App() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div className="p-8">
      <InvoiceForm onCreated={() => setRefresh(r => r + 1)} />
      <InvoiceList key={refresh} />
    </div>
  );
}

export default App;
