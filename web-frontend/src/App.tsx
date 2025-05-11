import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/auth/LoginPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { CustomerList } from './components/customer/CustomerList';
import { CustomerForm } from './components/customer/CustomerForm';
import { InvoiceList } from './components/invoice/InvoiceList';
import { InvoiceForm } from './components/invoice/InvoiceForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/new" element={<CustomerForm onCreated={() => {}} />} />
          <Route path="customers/:id" element={<CustomerForm onCreated={() => {}} />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/new" element={<InvoiceForm onCreated={() => {}} />} />
          <Route path="invoices/:id" element={<InvoiceForm onCreated={() => {}} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;