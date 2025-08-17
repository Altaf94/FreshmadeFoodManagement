import React from 'react';
import { useOrder } from '../context/OrderContext';
import { useEmployee } from '../context/EmployeeContext';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MapPin
} from 'lucide-react';

const Dashboard = () => {
  const { orders, bills } = useOrder();
  const { employees, payments } = useEmployee();

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalSalaryExpense = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const netProfit = totalRevenue - totalSalaryExpense;

  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const totalMenuItems = 0; // No menu items data available in the new_code
  const availableMenuItems = 0; // No menu items data available in the new_code

  // Recent orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Recent bills
  const recentBills = bills
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      change: '+12%',
      icon: ShoppingCart,
      color: '#667eea'
    },
    {
      title: 'Total Revenue',
      value: `Rs. ${totalRevenue.toFixed(2)}`,
      change: '+8%',
      icon: DollarSign,
      color: '#48bb78'
    },
    {
      title: 'Active Employees',
      value: activeEmployees,
      change: '+2',
      icon: Users,
      color: '#ed8936'
    },
    {
      title: 'Net Profit',
      value: `Rs. ${netProfit.toFixed(2)}`,
      change: netProfit >= 0 ? '+15%' : '-5%',
      icon: TrendingUp,
      color: netProfit >= 0 ? '#48bb78' : '#f56565'
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
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-change">
                <TrendingUp size={16} />
                {stat.change}
              </div>
              <Icon 
                size={24} 
                style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  right: '20px', 
                  opacity: 0.1,
                  color: stat.color 
                }} 
              />
            </div>
          );
        })}
      </div>

      {/* Order Status Overview */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card" style={{ borderLeftColor: '#d69e2e' }}>
          <div className="stat-title">Pending Orders</div>
          <div className="stat-value">{pendingOrders}</div>
          <div className="stat-change">
            <Clock size={16} />
            Awaiting preparation
          </div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#38a169' }}>
          <div className="stat-title">Completed Orders</div>
          <div className="stat-value">{completedOrders}</div>
          <div className="stat-change">
            <CheckCircle size={16} />
            Successfully delivered
          </div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#e53e3e' }}>
          <div className="stat-title">Cancelled Orders</div>
          <div className="stat-value">{0}</div> {/* No cancelled orders data available */}
          <div className="stat-change">
            <XCircle size={16} />
            Customer cancelled
          </div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#667eea' }}>
          <div className="stat-title">Menu Items</div>
          <div className="stat-value">{availableMenuItems}/{totalMenuItems}</div>
          <div className="stat-change">
            Available items
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Orders */}
        <div className="table-container">
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, color: '#2d3748' }}>Recent Orders</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customerName || 'Walk-in Customer'}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Bills */}
        <div className="table-container">
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, color: '#2d3748' }}>Recent Bills</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBills.map((bill) => (
                <tr key={bill.id}>
                  <td>#{bill.id}</td>
                  <td>Rs. {bill.amount?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-badge status-${bill.status}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td>{format(new Date(bill.createdAt), 'MMM dd, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
