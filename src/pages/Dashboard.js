import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { useEmployee } from '../context/EmployeeContext';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Phone,
  MapPin,
  Lock,
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { orders, bills } = useOrder();
  const { employees, salaryPayments } = useEmployee();

  // Calculate statistics with proper null checks
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
  const totalSalaryExpense = salaryPayments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
  const netProfit = totalRevenue - totalSalaryExpense;

  const activeEmployees = employees?.filter(emp => emp.status === 'active')?.length || 0;

  // Recent orders with null check
  const recentOrders = orders
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.slice(0, 5) || [];

  // Recent bills with null check
  const recentBills = bills
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.slice(0, 5) || [];

  // Owner password (in real app, this should be stored securely)
  const OWNER_PASSWORD = 'freshmade2024';

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === OWNER_PASSWORD) {
      setIsOwnerAuthenticated(true);
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsOwnerAuthenticated(false);
  };

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      change: '+12%',
      icon: ShoppingCart,
      color: '#667eea',
      isSensitive: false
    },
    {
      title: 'Total Revenue',
      value: isOwnerAuthenticated ? `Rs. ${totalRevenue.toFixed(2)}` : '***',
      change: isOwnerAuthenticated ? '+8%' : '***',
      icon: DollarSign,
      color: '#48bb78',
      isSensitive: true
    },
    {
      title: 'Active Employees',
      value: activeEmployees,
      change: '+2',
      icon: Users,
      color: '#ed8936',
      isSensitive: false
    },
    {
      title: 'Net Profit',
      value: isOwnerAuthenticated ? `Rs. ${netProfit.toFixed(2)}` : '***',
      change: isOwnerAuthenticated ? (netProfit >= 0 ? '+15%' : '-5%') : '***',
      icon: TrendingUp,
      color: netProfit >= 0 ? '#48bb78' : '#f56565',
      isSensitive: true
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Freshmade Snacks</h1>
          <p>Restaurant Management Dashboard</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '0.9rem', color: '#718096' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={14} />
              <span>Gulshen e Sabbir Soldier Bazar No 3, Opp Yameen kabab House</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Phone size={14} />
              <span>0347-3336663</span>
            </div>
          </div>
        </div>
        
        {/* Owner Authentication Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isOwnerAuthenticated ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              <Eye size={16} />
              <span>Owner Mode</span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPasswordModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              <Lock size={16} />
              Owner Login
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="stat-title">
                {stat.title}
                {stat.isSensitive && !isOwnerAuthenticated && (
                  <Lock size={14} style={{ marginLeft: '8px', color: '#718096' }} />
                )}
              </div>
              <div className="stat-value" style={{ 
                color: stat.isSensitive && !isOwnerAuthenticated ? '#718096' : 'inherit',
                fontFamily: stat.isSensitive && !isOwnerAuthenticated ? 'monospace' : 'inherit'
              }}>
                {stat.value}
              </div>
              <div className="stat-change" style={{ 
                color: stat.isSensitive && !isOwnerAuthenticated ? '#718096' : 'inherit'
              }}>
                <TrendingUp size={16} />
                {stat.change}
              </div>
              <Icon 
                size={24} 
                style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  right: '20px', 
                  opacity: stat.isSensitive && !isOwnerAuthenticated ? 0.3 : 0.1,
                  color: stat.color 
                }} 
              />
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ 
          marginBottom: '20px', 
          color: '#2d3748',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <ShoppingCart size={24} color="#667eea" />
          Recent Orders
        </h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customerName || 'Walk-in Customer'}</td>
                  <td>{order.items?.length || 0} items</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</td>
                  <td style={{ 
                    color: isOwnerAuthenticated ? '#48bb78' : '#718096',
                    fontFamily: isOwnerAuthenticated ? 'inherit' : 'monospace'
                  }}>
                    {isOwnerAuthenticated ? `Rs. ${order.totalAmount?.toFixed(2) || '0.00'}` : '***'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
              No recent orders
            </div>
          )}
        </div>
      </div>

      {/* Recent Bills Section */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ 
          marginBottom: '20px', 
          color: '#2d3748',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <DollarSign size={24} color="#48bb78" />
          Recent Bills
        </h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Customer</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentBills.map((bill) => (
                <tr key={bill.id}>
                  <td>#{bill.id}</td>
                  <td>{bill.customerName || 'Walk-in Customer'}</td>
                  <td>{bill.paymentMethod}</td>
                  <td>
                    <span className={`status-badge status-${bill.status}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td>{format(new Date(bill.createdAt), 'MMM dd, yyyy')}</td>
                  <td style={{ 
                    color: isOwnerAuthenticated ? '#48bb78' : '#718096',
                    fontFamily: isOwnerAuthenticated ? 'inherit' : 'monospace'
                  }}>
                    {isOwnerAuthenticated ? `Rs. ${bill.totalAmount?.toFixed(2) || '0.00'}` : '***'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentBills.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
              No recent bills
            </div>
          )}
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <Lock size={24} style={{ marginRight: '10px' }} />
                Owner Authentication
              </h2>
              <button 
                className="modal-close"
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} style={{ marginRight: '8px' }} />
                  Enter Owner Password
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to view financial data"
                  required
                  autoFocus
                />
                {passwordError && (
                  <div style={{ 
                    color: '#e53e3e', 
                    fontSize: '0.9rem', 
                    marginTop: '8px' 
                  }}>
                    {passwordError}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Lock size={16} style={{ marginRight: '8px' }} />
                  Authenticate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
