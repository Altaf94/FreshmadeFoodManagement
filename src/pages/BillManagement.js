import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Receipt, DollarSign } from 'lucide-react';

const BillManagement = () => {
  const { bills, orders, addBill, updateBill, deleteBill } = useOrder();
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState({
    orderId: '',
    customerName: '',
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    totalAmount: 0,
    paymentMethod: 'cash',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBill) {
      updateBill({ ...editingBill, ...formData });
    } else {
      addBill(formData);
    }
    setShowModal(false);
    setEditingBill(null);
    setFormData({
      orderId: '',
      customerName: '',
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      totalAmount: 0,
      paymentMethod: 'cash',
      notes: ''
    });
  };

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setFormData({
      orderId: bill.orderId || '',
      customerName: bill.customerName || '',
      items: bill.items || [],
      subtotal: bill.subtotal || 0,
      tax: bill.tax || 0,
      discount: bill.discount || 0,
      totalAmount: bill.totalAmount || 0,
      paymentMethod: bill.paymentMethod || 'cash',
      notes: bill.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      deleteBill(billId);
    }
  };

  const updateBillStatus = (billId, status) => {
    const bill = bills.find(b => b.id === billId);
    if (bill) {
      updateBill({ ...bill, status });
    }
  };

  const calculateTotal = () => {
    const subtotal = formData.subtotal;
    const tax = (subtotal * formData.tax) / 100;
    const discount = (subtotal * formData.discount) / 100;
    return subtotal + tax - discount;
  };

  const handleOrderSelect = (orderId) => {
    const order = orders.find(o => o.id === parseInt(orderId));
    if (order) {
      setFormData({
        ...formData,
        orderId: orderId,
        customerName: order.customerName || '',
        items: order.items || [],
        subtotal: order.totalAmount || 0,
        totalAmount: calculateTotal()
      });
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(o => o.id === parseInt(orderId));
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Bill Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          New Bill
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Subtotal</th>
              <th>Tax</th>
              <th>Discount</th>
              <th>Total</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>#{bill.id}</td>
                <td>#{bill.orderId || 'N/A'}</td>
                <td>{bill.customerName || 'Walk-in Customer'}</td>
                <td>Rs. {bill.subtotal?.toFixed(2) || '0.00'}</td>
                <td>Rs. {((bill.subtotal * bill.tax) / 100).toFixed(2) || '0.00'}</td>
                <td>Rs. {((bill.subtotal * bill.discount) / 100).toFixed(2) || '0.00'}</td>
                <td>Rs. {bill.totalAmount?.toFixed(2) || '0.00'}</td>
                <td style={{ textTransform: 'capitalize' }}>{bill.paymentMethod}</td>
                <td>
                  <select
                    value={bill.status}
                    onChange={(e) => updateBillStatus(bill.id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{format(new Date(bill.createdAt), 'MMM dd, yyyy HH:mm')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      onClick={() => handleEdit(bill)}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      onClick={() => handleDelete(bill.id)}
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

      {/* Bill Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingBill ? 'Edit Bill' : 'New Bill'}
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
                <label className="form-label">Order ID (Optional)</label>
                <select
                  className="form-select"
                  value={formData.orderId}
                  onChange={(e) => handleOrderSelect(e.target.value)}
                >
                  <option value="">Select order</option>
                  {orders.map(order => (
                    <option key={order.id} value={order.id}>
                      #{order.id} - {order.customerName || 'Walk-in Customer'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  placeholder="Enter customer name"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Subtotal</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.subtotal}
                    onChange={(e) => setFormData({
                      ...formData, 
                      subtotal: parseFloat(e.target.value) || 0,
                      totalAmount: calculateTotal()
                    })}
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tax (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.tax}
                    onChange={(e) => setFormData({
                      ...formData, 
                      tax: parseFloat(e.target.value) || 0,
                      totalAmount: calculateTotal()
                    })}
                    step="0.1"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.discount}
                    onChange={(e) => setFormData({
                      ...formData, 
                      discount: parseFloat(e.target.value) || 0,
                      totalAmount: calculateTotal()
                    })}
                    step="0.1"
                    placeholder="0.0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile">Mobile Payment</option>
                    <option value="online">Online</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Total Amount</label>
                <input
                  type="number"
                  className="form-input"
                  value={calculateTotal().toFixed(2)}
                  readOnly
                  style={{ backgroundColor: '#f7fafc', fontWeight: 'bold' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any additional notes..."
                  rows="3"
                />
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
                  {editingBill ? 'Update Bill' : 'Create Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillManagement;
