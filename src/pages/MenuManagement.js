import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const MenuManagement = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useOrder();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    description: '',
    available: true
  });

  const categories = [
    'Curry Khausay',
    'Pav Bhaji', 
    'Idli Sambhar',
    'Sandwich',
    'Fries',
    'Chowmein',
    'Chaat',
    'Dosa',
    'Sweet Corn',
    'Pasta'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateMenuItem({ ...editingItem, ...formData });
    } else {
      addMenuItem(formData);
    }
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: '',
      category: '',
      price: 0,
      description: '',
      available: true
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      available: item.available
    });
    setShowModal(true);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      deleteMenuItem(itemId);
    }
  };

  const toggleAvailability = (itemId) => {
    const item = menuItems.find(m => m.id === itemId);
    if (item) {
      updateMenuItem({ ...item, available: !item.available });
    }
  };

  const getCategoryStats = () => {
    const stats = {};
    menuItems.forEach(item => {
      if (!stats[item.category]) {
        stats[item.category] = { total: 0, available: 0 };
      }
      stats[item.category].total++;
      if (item.available) {
        stats[item.category].available++;
      }
    });
    return stats;
  };

  const categoryStats = getCategoryStats();
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.available).length;
  const totalValue = menuItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Menu Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          Add Menu Item
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card" style={{ borderLeftColor: '#667eea' }}>
          <div className="stat-title">Total Menu Items</div>
          <div className="stat-value">{totalItems}</div>
          <div className="stat-change">
            {availableItems} available
          </div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#48bb78' }}>
          <div className="stat-title">Available Items</div>
          <div className="stat-value">{availableItems}</div>
          <div className="stat-change">
            {((availableItems / totalItems) * 100).toFixed(1)}% of total
          </div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#ed8936' }}>
          <div className="stat-title">Categories</div>
          <div className="stat-value">{Object.keys(categoryStats).length}</div>
          <div className="stat-change">
            Different food categories
          </div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f56565' }}>
          <div className="stat-title">Average Price</div>
          <div className="stat-value">
            Rs. {totalItems > 0 ? (totalValue / totalItems).toFixed(2) : '0.00'}
          </div>
          <div className="stat-change">
            Per menu item
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="table-container" style={{ marginBottom: '30px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, color: '#2d3748' }}>Category Overview</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Items</th>
              <th>Available</th>
              <th>Unavailable</th>
              <th>Percentage Available</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(categoryStats).map(([category, stats]) => (
              <tr key={category}>
                <td style={{ fontWeight: '600' }}>{category}</td>
                <td>{stats.total}</td>
                <td style={{ color: '#38a169' }}>{stats.available}</td>
                <td style={{ color: '#e53e3e' }}>{stats.total - stats.available}</td>
                <td>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px' 
                  }}>
                    <div style={{ 
                      flex: 1, 
                      height: '8px', 
                      backgroundColor: '#e2e8f0', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(stats.available / stats.total) * 100}%`,
                        height: '100%',
                        backgroundColor: '#48bb78'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#718096' }}>
                      {((stats.available / stats.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Menu Items Table */}
      <div className="table-container">
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, color: '#2d3748' }}>Menu Items</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td style={{ fontWeight: '500' }}>{item.name}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    color: '#4a5568'
                  }}>
                    {item.category}
                  </span>
                </td>
                <td style={{ fontWeight: '600', color: '#48bb78' }}>
                  Rs. {item.price.toFixed(2)}
                </td>
                <td style={{ 
                  maxWidth: '200px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}>
                  {item.description}
                </td>
                <td>
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    style={{
                      padding: '4px 8px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      backgroundColor: item.available ? '#f0fff4' : '#fed7d7',
                      color: item.available ? '#38a169' : '#e53e3e',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {item.available ? <Eye size={12} /> : <EyeOff size={12} />}
                    {item.available ? 'Available' : 'Unavailable'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      onClick={() => handleEdit(item)}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Menu Item Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter item description..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({...formData, available: e.target.checked})}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Available for ordering</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
