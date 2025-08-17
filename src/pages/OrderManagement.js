import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { format } from 'date-fns';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Printer, 
  ShoppingCart,
  Clock,
  CheckCircle,
  User,
  Phone,
  Package,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Grid
} from 'lucide-react';
import PrintableOrder from '../components/PrintableOrder';
import MenuItemCard from '../components/MenuItemCard';

const OrderManagement = () => {
  const { orders, menuItems, addOrder, updateOrder, deleteOrder } = useOrder();
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMenuSelection, setShowMenuSelection] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    items: [],
    totalAmount: 0,
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingOrder) {
      updateOrder({ ...editingOrder, ...formData });
    } else {
      addOrder(formData);
    }
    setShowModal(false);
    setEditingOrder(null);
    setFormData({
      customerName: '',
      customerPhone: '',
      items: [],
      totalAmount: 0,
      notes: ''
    });
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      customerName: order.customerName || '',
      customerPhone: order.customerPhone || '',
      items: order.items || [],
      totalAmount: order.totalAmount || 0,
      notes: order.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId);
    }
  };

  const handlePrint = (order) => {
    setSelectedOrder(order);
    setShowPrintModal(true);
  };

  const updateOrderStatus = (orderId, status) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      updateOrder({ ...order, status });
    }
  };

  const addItemToOrder = () => {
    setShowMenuSelection(true);
  };

  const selectMenuItem = (menuItem) => {
    const existingItem = formData.items.find(item => item.menuItemId === menuItem.id.toString());
    
    if (existingItem) {
      // Update quantity if item already exists
      const updatedItems = formData.items.map(item => 
        item.menuItemId === menuItem.id.toString() 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      
      const total = updatedItems.reduce((sum, item) => {
        const menuItem = menuItems.find(m => m.id === parseInt(item.menuItemId));
        return sum + (menuItem ? menuItem.price * item.quantity : 0);
      }, 0);

      setFormData({
        ...formData,
        items: updatedItems,
        totalAmount: total
      });
    } else {
      // Add new item
      const newItem = {
        menuItemId: menuItem.id.toString(),
        quantity: 1,
        price: menuItem.price
      };
      
      const updatedItems = [...formData.items, newItem];
      const total = updatedItems.reduce((sum, item) => {
        const menuItem = menuItems.find(m => m.id === parseInt(item.menuItemId));
        return sum + (menuItem ? menuItem.price * item.quantity : 0);
      }, 0);

      setFormData({
        ...formData,
        items: updatedItems,
        totalAmount: total
      });
    }
    
    setShowMenuSelection(false);
  };

  const updateOrderItem = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Calculate total
    const total = updatedItems.reduce((sum, item) => {
      const menuItem = menuItems.find(m => m.id === parseInt(item.menuItemId));
      return sum + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);

    setFormData({
      ...formData,
      items: updatedItems,
      totalAmount: total
    });
  };

  const removeOrderItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const total = updatedItems.reduce((sum, item) => {
      const menuItem = menuItems.find(m => m.id === parseInt(item.menuItemId));
      return sum + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);

    setFormData({
      ...formData,
      items: updatedItems,
      totalAmount: total
    });
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone?.includes(searchTerm) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter menu items by category
  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Get unique categories
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#d69e2e';
      case 'preparing': return '#3182ce';
      case 'ready': return '#38a169';
      case 'completed': return '#38a169';
      case 'cancelled': return '#e53e3e';
      default: return '#d69e2e';
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShoppingCart size={32} style={{ marginRight: '15px', color: '#667eea' }} />
            Order Management
          </h1>
          <p style={{ color: '#718096', marginTop: '5px' }}>
            Manage customer orders and track order status
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          New Order
        </button>
      </div>

      {/* Order Statistics */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-title">Total Orders</div>
          <div className="stat-value">{totalOrders}</div>
          <div className="stat-change">
            <ShoppingCart size={16} />
            All time orders
          </div>
          <ShoppingCart className="stat-icon" />
        </div>
        <div className="stat-card">
          <div className="stat-title">Pending Orders</div>
          <div className="stat-value">{pendingOrders}</div>
          <div className="stat-change">
            <Clock size={16} />
            Awaiting preparation
          </div>
          <Clock className="stat-icon" />
        </div>
        <div className="stat-card">
          <div className="stat-title">Completed Orders</div>
          <div className="stat-value">{completedOrders}</div>
          <div className="stat-change">
            <CheckCircle size={16} />
            Successfully delivered
          </div>
          <CheckCircle className="stat-icon" />
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value">Rs. {totalRevenue.toFixed(2)}</div>
          <div className="stat-change">
            <DollarSign size={16} />
            From all orders
          </div>
          <DollarSign className="stat-icon" />
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '25px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ 
              position: 'absolute', 
              left: '15px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#718096'
            }} />
            <input
              type="text"
              placeholder="Search orders by customer name, phone, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 15px 15px 50px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>
        <div style={{ minWidth: '200px' }}>
          <div style={{ position: 'relative' }}>
            <Filter size={20} style={{ 
              position: 'absolute', 
              left: '15px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#718096'
            }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 15px 15px 50px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div style={{ 
          padding: '25px', 
          borderBottom: '2px solid #e2e8f0',
          background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
        }}>
          <h3 style={{ 
            margin: 0, 
            color: '#2d3748',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShoppingCart size={24} color="#667eea" />
            Orders ({filteredOrders.length})
          </h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontWeight: '600',
                    color: '#667eea'
                  }}>
                    <Package size={16} />
                    #{order.id}
                  </div>
                </td>
                <td>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px'
                  }}>
                    <User size={16} color="#718096" />
                    {order.customerName || 'Walk-in Customer'}
                  </div>
                </td>
                <td>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px'
                  }}>
                    <Phone size={16} color="#718096" />
                    {order.customerPhone || 'N/A'}
                  </div>
                </td>
                <td>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px'
                  }}>
                    <ShoppingCart size={16} color="#718096" />
                    {order.items?.length || 0} items
                  </div>
                </td>
                <td>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontWeight: '600',
                    color: '#48bb78'
                  }}>
                    <DollarSign size={16} />
                    Rs. {order.totalAmount?.toFixed(2) || '0.00'}
                  </div>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      color: getStatusColor(order.status),
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="preparing">👨‍🍳 Preparing</option>
                    <option value="ready">✅ Ready</option>
                    <option value="completed">🎉 Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </td>
                <td>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontSize: '0.9rem'
                  }}>
                    <Calendar size={16} color="#718096" />
                    {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ 
                        padding: '8px', 
                        fontSize: '0.8rem',
                        borderRadius: '8px',
                        minWidth: 'auto'
                      }}
                      onClick={() => handlePrint(order)}
                      title="Print Order"
                    >
                      <Printer size={16} />
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ 
                        padding: '8px', 
                        fontSize: '0.8rem',
                        borderRadius: '8px',
                        minWidth: 'auto'
                      }}
                      onClick={() => handleEdit(order)}
                      title="Edit Order"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ 
                        padding: '8px', 
                        fontSize: '0.8rem',
                        borderRadius: '8px',
                        minWidth: 'auto'
                      }}
                      onClick={() => handleDelete(order.id)}
                      title="Delete Order"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#718096',
            background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
          }}>
            <ShoppingCart size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
            <h3>No orders found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal menu-selection-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <ShoppingCart size={24} style={{ marginRight: '10px' }} />
                {editingOrder ? 'Edit Order' : 'New Order'}
              </h2>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} style={{ marginRight: '8px' }} />
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    placeholder="Enter customer's full name (e.g., John Smith)"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone size={16} style={{ marginRight: '8px' }} />
                    Customer Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                    placeholder="Enter phone number (e.g., 0300-1234567)"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Package size={16} style={{ marginRight: '8px' }} />
                  Order Items ({formData.items.length} items selected)
                </label>
                
                {/* Selected Items */}
                {formData.items.map((item, index) => {
                  const menuItem = menuItems.find(m => m.id === parseInt(item.menuItemId));
                  return (
                    <div key={index} style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr 1fr auto', 
                      gap: '15px', 
                      alignItems: 'center',
                      marginBottom: '15px',
                      padding: '15px',
                      background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {menuItem?.image && (
                          <img 
                            src={menuItem.image} 
                            alt={menuItem.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                          />
                        )}
                        <span style={{ fontWeight: '600' }}>{menuItem?.name || 'Unknown Item'}</span>
                      </div>
                      <input
                        type="number"
                        className="form-input"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                        min="1"
                        placeholder="Quantity"
                        style={{ textAlign: 'center' }}
                      />
                      <span style={{ 
                        fontWeight: '600', 
                        color: '#48bb78',
                        textAlign: 'center'
                      }}>
                        Rs. {(menuItem?.price || 0) * item.quantity}
                      </span>
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{ padding: '8px', minWidth: 'auto' }}
                        onClick={() => removeOrderItem(index)}
                        title="Remove this item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
                
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addItemToOrder}
                  style={{ marginTop: '10px' }}
                >
                  <Plus size={16} />
                  Browse Menu & Add Items
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} style={{ marginRight: '8px' }} />
                  Total Order Amount
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({...formData, totalAmount: parseFloat(e.target.value)})}
                  step="0.01"
                  readOnly
                  style={{ 
                    backgroundColor: '#f0fff4', 
                    fontWeight: 'bold',
                    color: '#48bb78',
                    fontSize: '1.1rem'
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Edit size={16} style={{ marginRight: '8px' }} />
                  Special Instructions / Notes
                </label>
                <textarea
                  className="form-input"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Enter any special instructions, dietary requirements, or cooking preferences (e.g., no onions, extra spicy, etc.)"
                  rows="3"
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingOrder ? 'Update Order' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Selection Modal */}
      {showMenuSelection && (
        <div className="modal-overlay" onClick={() => setShowMenuSelection(false)}>
          <div className="modal menu-selection-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <Grid size={24} style={{ marginRight: '10px' }} />
                Select Menu Items
              </h2>
              <button 
                className="modal-close"
                onClick={() => setShowMenuSelection(false)}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                flexWrap: 'wrap',
                marginBottom: '15px'
              }}>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '8px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '20px',
                      background: selectedCategory === category 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      color: selectedCategory === category ? 'white' : '#4a5568',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem'
                    }}
                  >
                    {category === 'all' ? 'All Items' : category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="menu-selection-grid">
              {filteredMenuItems.map(menuItem => (
                <MenuItemCard
                  key={menuItem.id}
                  item={menuItem}
                  onSelect={selectMenuItem}
                  showImage={true}
                />
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowMenuSelection(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Order Modal */}
      {showPrintModal && selectedOrder && (
        <PrintableOrder
          order={selectedOrder}
          menuItems={menuItems}
          onClose={() => {
            setShowPrintModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderManagement;
