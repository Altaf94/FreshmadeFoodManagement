import React from 'react';
import { format } from 'date-fns';

const PrintableOrder = ({ order, menuItems, onClose }) => {
  const getMenuItemName = (menuItemId) => {
    const item = menuItems.find(m => m.id === parseInt(menuItemId));
    return item ? item.name : 'Unknown Item';
  };

  const getMenuItemPrice = (menuItemId) => {
    const item = menuItems.find(m => m.id === parseInt(menuItemId));
    return item ? item.price : 0;
  };

  const calculateTotal = () => {
    if (order.totalAmount) return order.totalAmount;
    if (order.items) {
      return order.items.reduce((total, item) => {
        const price = getMenuItemPrice(item.menuItemId);
        return total + (price * item.quantity);
      }, 0);
    }
    return 0;
  };

  const total = calculateTotal();

  const printOrder = () => {
    window.print();
  };

  return (
    <div className="printable-order-overlay" onClick={onClose}>
      <div className="printable-order" onClick={(e) => e.stopPropagation()}>
        <div className="printable-order-header">
          <h2>Freshmade Snacks</h2>
          <p>Gulshen e Sabbir Soldier Bazar No 3</p>
          <p>Opp Yameen kabab House</p>
          <p>Phone: 0347-3336663</p>
          <div className="order-divider"></div>
        </div>

        <div className="order-info">
          <div className="order-row">
            <span><strong>Order #:</strong></span>
            <span>#{order.id}</span>
          </div>
          <div className="order-row">
            <span><strong>Date:</strong></span>
            <span>{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</span>
          </div>
          <div className="order-row">
            <span><strong>Customer:</strong></span>
            <span>{order.customerName || 'Walk-in Customer'}</span>
          </div>
          {order.customerPhone && (
            <div className="order-row">
              <span><strong>Phone:</strong></span>
              <span>{order.customerPhone}</span>
            </div>
          )}
          <div className="order-row">
            <span><strong>Status:</strong></span>
            <span style={{ 
              color: order.status === 'completed' ? '#38a169' : 
                     order.status === 'cancelled' ? '#e53e3e' : '#d69e2e',
              fontWeight: 'bold'
            }}>
              {order.status?.toUpperCase() || 'PENDING'}
            </span>
          </div>
        </div>

        <div className="order-divider"></div>

        <div className="order-items">
          <div className="order-items-header">
            <span><strong>Item</strong></span>
            <span><strong>Qty</strong></span>
            <span><strong>Price</strong></span>
            <span><strong>Total</strong></span>
          </div>
          
          {order.items && order.items.map((item, index) => {
            const itemName = getMenuItemName(item.menuItemId);
            const itemPrice = getMenuItemPrice(item.menuItemId);
            const itemTotal = itemPrice * item.quantity;
            
            return (
              <div key={index} className="order-item">
                <span>{itemName}</span>
                <span>{item.quantity}</span>
                <span>Rs. {itemPrice.toFixed(2)}</span>
                <span>Rs. {itemTotal.toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        <div className="order-divider"></div>

        <div className="order-summary">
          <div className="order-row total-row">
            <span><strong>Total Amount:</strong></span>
            <span><strong>Rs. {total.toFixed(2)}</strong></span>
          </div>
        </div>

        {order.notes && (
          <>
            <div className="order-divider"></div>
            <div className="order-notes">
              <p><strong>Special Instructions:</strong></p>
              <p>{order.notes}</p>
            </div>
          </>
        )}

        <div className="order-divider"></div>

        <div className="order-footer">
          <div className="order-thankyou">
            <p>Thank you for your order!</p>
            <p>Your order will be ready soon</p>
            <p style={{ fontSize: '10px', marginTop: '10px' }}>
              Please keep this receipt for order tracking
            </p>
          </div>
        </div>

        <div className="order-actions">
          <button className="btn btn-primary" onClick={printOrder}>
            Print Order
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintableOrder;
