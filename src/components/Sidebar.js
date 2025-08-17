import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  Receipt, 
  Users, 
  Menu as MenuIcon,
  Menu as HamburgerMenu
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/orders', label: 'Order Management', icon: ShoppingCart },
    { path: '/bills', label: 'Bill Management', icon: Receipt },
    { path: '/salary', label: 'Salary Management', icon: Users },
    { path: '/menu', label: 'Menu Management', icon: MenuIcon },
  ];

  return (
    <>
      <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
        <div className="sidebar-header">
          <h2>Freshmade Snacks</h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '5px' }}>
            Restaurant Management System
          </p>
        </div>
        <nav>
          <ul className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <Icon className="nav-icon" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1001,
          background: '#667eea',
          border: 'none',
          borderRadius: '8px',
          padding: '10px',
          color: 'white',
          cursor: 'pointer',
          display: 'none'
        }}
      >
        <HamburgerMenu size={20} />
      </button>
    </>
  );
};

export default Sidebar;
