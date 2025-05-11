import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/hooks';
import { LoginPage } from './components/auth/LoginPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { CustomerList } from './components/customer/CustomerList';
import { CustomerForm } from './components/customer/CustomerForm';
import { InvoiceList } from './components/invoice/InvoiceList';
import { InvoiceForm } from './components/invoice/InvoiceForm';

function AuthenticatedRoutes() {
  const { loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
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
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<AuthenticatedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;