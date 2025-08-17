import React from 'react';
import { format } from 'date-fns';

const PrintableBill = ({ bill, order, menuItems, onClose }) => {
  const getMenuItemName = (menuItemId) => {
    const item = menuItems.find(m => m.id === parseInt(menuItemId));
    return item ? item.name : 'Unknown Item';
  };

  const getMenuItemPrice = (menuItemId) => {
    const item = menuItems.find(m => m.id === parseInt(menuItemId));
    return item ? item.price : 0;
  };

  const calculateSubtotal = () => {
    if (bill.subtotal) return bill.subtotal;
    if (order && order.items) {
      return order.items.reduce((total, item) => {
        const price = getMenuItemPrice(item.menuItemId);
        return total + (price * item.quantity);
      }, 0);
    }
    return 0;
  };

  const subtotal = calculateSubtotal();
  const taxAmount = (subtotal * (bill.tax || 0)) / 100;
  const discountAmount = (subtotal * (bill.discount || 0)) / 100;
  const total = subtotal + taxAmount - discountAmount;

  const printBill = () => {
    window.print();
  };

  return (
    <div className="printable-bill-overlay" onClick={onClose}>
      <div className="printable-bill" onClick={(e) => e.stopPropagation()}>
        <div className="printable-bill-header">
          <h2>Freshmade Snacks</h2>
          <p>Gulshen e Sabbir Soldier Bazar No 3</p>
          <p>Opp Yameen kabab House</p>
          <p>Phone: 0347-3336663</p>
          <div className="bill-divider"></div>
        </div>

        <div className="bill-info">
          <div className="bill-row">
            <span><strong>Bill #:</strong></span>
            <span>#{bill.id}</span>
          </div>
          <div className="bill-row">
            <span><strong>Date:</strong></span>
            <span>{format(new Date(bill.createdAt), 'dd/MM/yyyy HH:mm')}</span>
          </div>
          <div className="bill-row">
            <span><strong>Customer:</strong></span>
            <span>{bill.customerName || order?.customerName || 'Walk-in Customer'}</span>
          </div>
          {order && (
            <div className="bill-row">
              <span><strong>Order #:</strong></span>
              <span>#{order.id}</span>
            </div>
          )}
        </div>

        <div className="bill-divider"></div>

        <div className="bill-items">
          <div className="bill-items-header">
            <span><strong>Item</strong></span>
            <span><strong>Qty</strong></span>
            <span><strong>Price</strong></span>
            <span><strong>Total</strong></span>
          </div>
          
          {order && order.items ? (
            order.items.map((item, index) => {
              const itemName = getMenuItemName(item.menuItemId);
              const itemPrice = getMenuItemPrice(item.menuItemId);
              const itemTotal = itemPrice * item.quantity;
              
              return (
                <div key={index} className="bill-item">
                  <span>{itemName}</span>
                  <span>{item.quantity}</span>
                  <span>Rs. {itemPrice.toFixed(2)}</span>
                  <span>Rs. {itemTotal.toFixed(2)}</span>
                </div>
              );
            })
          ) : (
            <div className="bill-item">
              <span>Bill Amount</span>
              <span>1</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="bill-divider"></div>

        <div className="bill-summary">
          <div className="bill-row">
            <span>Subtotal:</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          {bill.tax > 0 && (
            <div className="bill-row">
              <span>Tax ({bill.tax}%):</span>
              <span>Rs. {taxAmount.toFixed(2)}</span>
            </div>
          )}
          {bill.discount > 0 && (
            <div className="bill-row">
              <span>Discount ({bill.discount}%):</span>
              <span>- Rs. {discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="bill-row total-row">
            <span><strong>Total:</strong></span>
            <span><strong>Rs. {total.toFixed(2)}</strong></span>
          </div>
        </div>

        <div className="bill-divider"></div>

        <div className="bill-footer">
          <p><strong>Payment Method:</strong> {bill.paymentMethod?.toUpperCase() || 'CASH'}</p>
          <p><strong>Status:</strong> {bill.status?.toUpperCase() || 'PENDING'}</p>
          {bill.notes && (
            <div className="bill-notes">
              <p><strong>Notes:</strong> {bill.notes}</p>
            </div>
          )}
          <div className="bill-thankyou">
            <p>Thank you for dining with us!</p>
            <p>Please visit again</p>
          </div>
        </div>

        <div className="bill-actions">
          <button className="btn btn-primary" onClick={printBill}>
            Print Bill
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintableBill;
