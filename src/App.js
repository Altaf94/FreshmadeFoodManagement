import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import OrderManagement from './pages/OrderManagement';
import BillManagement from './pages/BillManagement';
import SalaryManagement from './pages/SalaryManagement';
import MenuManagement from './pages/MenuManagement';
import { OrderProvider } from './context/OrderContext';
import { EmployeeProvider } from './context/EmployeeContext';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <OrderProvider>
      <EmployeeProvider>
        <Router>
          <div className="app">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/orders" element={<OrderManagement />} />
                <Route path="/bills" element={<BillManagement />} />
                <Route path="/salary" element={<SalaryManagement />} />
                <Route path="/menu" element={<MenuManagement />} />
              </Routes>
            </main>
          </div>
        </Router>
      </EmployeeProvider>
    </OrderProvider>
  );
}

export default App;
