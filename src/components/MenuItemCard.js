import React from 'react';
import { Package, DollarSign, Eye, EyeOff } from 'lucide-react';

const MenuItemCard = ({ item, onSelect, isSelected = false, showImage = true }) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div 
      className={`menu-item-card ${isSelected ? 'selected' : ''} ${!item.available ? 'unavailable' : ''}`}
      onClick={handleClick}
      style={{
        cursor: onSelect ? 'pointer' : 'default'
      }}
    >
      {showImage && item.image && (
        <div className="menu-item-image">
          <img 
            src={item.image} 
            alt={item.name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="image-placeholder" style={{ display: 'none' }}>
            <Package size={32} color="#718096" />
          </div>
        </div>
      )}
      
      <div className="menu-item-content">
        <div className="menu-item-header">
          <h3 className="menu-item-name">{item.name}</h3>
          <div className="menu-item-price">
            <DollarSign size={16} />
            <span>Rs. {item.price.toFixed(2)}</span>
          </div>
        </div>
        
        <p className="menu-item-description">{item.description}</p>
        
        <div className="menu-item-footer">
          <span className="menu-item-category">{item.category}</span>
          <div className="menu-item-status">
            {item.available ? (
              <span className="status-available">
                <Eye size={14} />
                Available
              </span>
            ) : (
              <span className="status-unavailable">
                <EyeOff size={14} />
                Unavailable
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
