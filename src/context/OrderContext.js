import React, { createContext, useContext, useReducer, useEffect } from 'react';

const OrderContext = createContext();

const initialState = {
  orders: [],
  bills: [],
  menuItems: [
    // CURRY KHAUSAY
    {
      id: 1,
      name: 'Chicken Curry Khausa',
      category: 'Curry Khausay',
      price: 450,
      description: 'Delicious chicken curry khausa with authentic spices',
      available: true,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d4a9?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'Extra Noodles',
      category: 'Curry Khausay',
      price: 100,
      description: 'Additional noodles for curry khausa',
      available: true,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 3,
      name: 'Extra Curry',
      category: 'Curry Khausay',
      price: 50,
      description: 'Extra curry sauce',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 4,
      name: 'Extra Slims/Papdi',
      category: 'Curry Khausay',
      price: 40,
      description: 'Additional slims or papdi',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 5,
      name: 'Chicken Curry Khausa Parcel',
      category: 'Curry Khausay',
      price: 500,
      description: 'Chicken curry khausa for takeaway with extra slims/papdi',
      available: true,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d4a9?w=300&h=200&fit=crop&crop=center'
    },

    // PAV BHAJI
    {
      id: 6,
      name: 'Special Pav Bhaji',
      category: 'Pav Bhaji',
      price: 400,
      description: 'Traditional pav bhaji with butter and spices',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 7,
      name: 'Special Cheese Pav Bhaji',
      category: 'Pav Bhaji',
      price: 550,
      description: 'Pav bhaji topped with melted cheese',
      available: true,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 8,
      name: 'Extra Pav (Single)',
      category: 'Pav Bhaji',
      price: 40,
      description: 'One additional pav bread',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 9,
      name: 'Extra Pav (3)',
      category: 'Pav Bhaji',
      price: 100,
      description: 'Three additional pav breads',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },

    // IDLI SAMBHAR
    {
      id: 10,
      name: 'Idli Sambhar (3PC)',
      category: 'Idli Sambhar',
      price: 300,
      description: '3 pieces of idli with sambhar (Friday-Saturday-Sunday)',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 11,
      name: 'Vada Pav',
      category: 'Idli Sambhar',
      price: 150,
      description: 'Vada pav (Sunday only)',
      available: true,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 12,
      name: 'Dhokri (200g)',
      category: 'Idli Sambhar',
      price: 300,
      description: 'Dhokri served with chutney (Sunday only)',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },

    // SANDWICH
    {
      id: 13,
      name: 'Special Chicken Cheese Grilled Sandwich (Mega)',
      category: 'Sandwich',
      price: 600,
      description: 'Large grilled sandwich with chicken and cheese',
      available: true,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 14,
      name: 'Special Chicken Grilled Sandwich (Mega)',
      category: 'Sandwich',
      price: 500,
      description: 'Large grilled chicken sandwich',
      available: true,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 15,
      name: 'Chicken Cheese Grilled Sandwich (Small)',
      category: 'Sandwich',
      price: 450,
      description: 'Small grilled sandwich with chicken and cheese',
      available: true,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 16,
      name: 'Chicken Grilled Sandwich (Small)',
      category: 'Sandwich',
      price: 400,
      description: 'Small grilled chicken sandwich',
      available: true,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 17,
      name: 'Aalu Masala',
      category: 'Sandwich',
      price: 180,
      description: 'Potato masala sandwich',
      available: true,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=200&fit=crop&crop=center'
    },

    // FRIES
    {
      id: 18,
      name: 'Plain Fries (Small)',
      category: 'Fries',
      price: 160,
      description: 'Small portion of plain fries',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 19,
      name: 'Plain Fries (Large)',
      category: 'Fries',
      price: 280,
      description: 'Large portion of plain fries',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 20,
      name: 'Masala Fries (Small)',
      category: 'Fries',
      price: 160,
      description: 'Small portion of masala fries',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 21,
      name: 'Masala Fries (Large)',
      category: 'Fries',
      price: 280,
      description: 'Large portion of masala fries',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 22,
      name: 'BBQ Masala Fries (Small)',
      category: 'Fries',
      price: 170,
      description: 'Small portion of BBQ masala fries',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 23,
      name: 'BBQ Masala Fries (Large)',
      category: 'Fries',
      price: 290,
      description: 'Large portion of BBQ masala fries',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 24,
      name: 'Chipotle Masala Fries (Small)',
      category: 'Fries',
      price: 170,
      description: 'Small portion of chipotle masala fries',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 25,
      name: 'Chipotle Masala Fries (Large)',
      category: 'Fries',
      price: 290,
      description: 'Large portion of chipotle masala fries',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },

    // CHOWMEIN
    {
      id: 26,
      name: 'Schezwan Chicken Chowmein',
      category: 'Chowmein',
      price: 450,
      description: 'Spicy schezwan chicken chowmein',
      available: true,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 27,
      name: 'Schezwan Vegetable Chowmein',
      category: 'Chowmein',
      price: 350,
      description: 'Spicy schezwan vegetable chowmein',
      available: true,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 28,
      name: 'Hakka Chicken Chowmein',
      category: 'Chowmein',
      price: 450,
      description: 'Traditional hakka chicken chowmein',
      available: true,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 29,
      name: 'Hakka Vegetable Chowmein',
      category: 'Chowmein',
      price: 350,
      description: 'Traditional hakka vegetable chowmein',
      available: true,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop&crop=center'
    },

    // CHAAT
    {
      id: 30,
      name: 'Bhel Puri',
      category: 'Chaat',
      price: 250,
      description: 'Crispy bhel puri with chutneys',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 31,
      name: 'FS Special Chana Chaat',
      category: 'Chaat',
      price: 250,
      description: 'Freshmade special chana chaat',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 32,
      name: 'Pani Puri (6)',
      category: 'Chaat',
      price: 120,
      description: '6 pieces of pani puri',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 33,
      name: 'Pani Puri (12)',
      category: 'Chaat',
      price: 240,
      description: '12 pieces of pani puri',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 34,
      name: 'Pani Puri Parcel (Min 1 Dozen)',
      category: 'Chaat',
      price: 250,
      description: 'Pani puri for parcel minimum 12 pieces',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 35,
      name: 'Dahi Puri',
      category: 'Chaat',
      price: 250,
      description: 'Dahi puri with yogurt and chutneys',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 36,
      name: 'Extra Pani',
      category: 'Chaat',
      price: 50,
      description: 'Extra pani for pani puri',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 37,
      name: 'Extra Papdi',
      category: 'Chaat',
      price: 20,
      description: 'Extra papdi for chaat',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 38,
      name: 'Laal (Khatay) Aalu',
      category: 'Chaat',
      price: 170,
      description: 'Spicy red potato chaat',
      available: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center'
    },

    // DOSA
    {
      id: 39,
      name: 'Masala Dosa',
      category: 'Dosa',
      price: 350,
      description: 'Traditional masala dosa with potato filling',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 40,
      name: 'Masala Dosa With Cheese',
      category: 'Dosa',
      price: 450,
      description: 'Masala dosa topped with cheese',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 41,
      name: 'Chicken Dosa',
      category: 'Dosa',
      price: 500,
      description: 'Dosa filled with chicken masala',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 42,
      name: 'Chicken Dosa with Cheese',
      category: 'Dosa',
      price: 550,
      description: 'Chicken dosa topped with cheese',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 43,
      name: 'Mysore Dosa',
      category: 'Dosa',
      price: 400,
      description: 'Mysore style dosa with spicy chutney',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 44,
      name: 'Mysore Dosa with Cheese',
      category: 'Dosa',
      price: 500,
      description: 'Mysore dosa topped with cheese',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 45,
      name: 'Uttapam',
      category: 'Dosa',
      price: 400,
      description: 'Thick dosa with vegetables',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 46,
      name: 'Chicken Uttapam',
      category: 'Dosa',
      price: 500,
      description: 'Uttapam with chicken',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 47,
      name: 'Chicken Cheese Uttapam',
      category: 'Dosa',
      price: 550,
      description: 'Uttapam with chicken and cheese',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 48,
      name: 'Paper Dosa',
      category: 'Dosa',
      price: 250,
      description: 'Crispy paper thin dosa',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 49,
      name: 'Butter Dosa',
      category: 'Dosa',
      price: 280,
      description: 'Dosa with butter',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 50,
      name: 'Cheese Paper Dosa',
      category: 'Dosa',
      price: 320,
      description: 'Paper dosa with cheese',
      available: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center'
    },

    // SWEET CORN
    {
      id: 51,
      name: 'Buttery Sweet Corn',
      category: 'Sweet Corn',
      price: 250,
      description: 'Sweet corn with butter',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 52,
      name: 'BBQ Sweet Corn',
      category: 'Sweet Corn',
      price: 250,
      description: 'Sweet corn with BBQ seasoning',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 53,
      name: 'Masala Sweet Corn',
      category: 'Sweet Corn',
      price: 250,
      description: 'Sweet corn with masala spices',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 54,
      name: 'Chipotle Sweet Corn',
      category: 'Sweet Corn',
      price: 250,
      description: 'Sweet corn with chipotle seasoning',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 55,
      name: 'Black Pepper Sweet Corn',
      category: 'Sweet Corn',
      price: 250,
      description: 'Sweet corn with black pepper',
      available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&crop=center'
    },

    // PASTA
    {
      id: 56,
      name: 'Vegetable Pasta',
      category: 'Pasta',
      price: 350,
      description: 'Pasta with fresh vegetables',
      available: true,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 57,
      name: 'Chicken Veg Pasta',
      category: 'Pasta',
      price: 450,
      description: 'Pasta with chicken and vegetables',
      available: true,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop&crop=center'
    }
  ]
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        )
      };
    
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload)
      };
    
    case 'ADD_BILL':
      return {
        ...state,
        bills: [...state.bills, action.payload]
      };
    
    case 'UPDATE_BILL':
      return {
        ...state,
        bills: state.bills.map(bill => 
          bill.id === action.payload.id ? action.payload : bill
        )
      };
    
    case 'DELETE_BILL':
      return {
        ...state,
        bills: state.bills.filter(bill => bill.id !== action.payload)
      };
    
    case 'ADD_MENU_ITEM':
      return {
        ...state,
        menuItems: [...state.menuItems, action.payload]
      };
    
    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.map(item => 
          item.id === action.payload.id ? action.payload : item
        )
      };
    
    case 'DELETE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.filter(item => item.id !== action.payload)
      };
    
    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload
      };
    
    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('restaurantData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      dispatch({ type: 'LOAD_DATA', payload: parsedData });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('restaurantData', JSON.stringify(state));
  }, [state]);

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    dispatch({ type: 'ADD_ORDER', payload: newOrder });
  };

  const updateOrder = (order) => {
    dispatch({ type: 'UPDATE_ORDER', payload: order });
  };

  const deleteOrder = (orderId) => {
    dispatch({ type: 'DELETE_ORDER', payload: orderId });
  };

  const addBill = (bill) => {
    const newBill = {
      ...bill,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    dispatch({ type: 'ADD_BILL', payload: newBill });
  };

  const updateBill = (bill) => {
    dispatch({ type: 'UPDATE_BILL', payload: bill });
  };

  const deleteBill = (billId) => {
    dispatch({ type: 'DELETE_BILL', payload: billId });
  };

  const addMenuItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now()
    };
    dispatch({ type: 'ADD_MENU_ITEM', payload: newItem });
  };

  const updateMenuItem = (item) => {
    dispatch({ type: 'UPDATE_MENU_ITEM', payload: item });
  };

  const deleteMenuItem = (itemId) => {
    dispatch({ type: 'DELETE_MENU_ITEM', payload: itemId });
  };

  const value = {
    ...state,
    addOrder,
    updateOrder,
    deleteOrder,
    addBill,
    updateBill,
    deleteBill,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
