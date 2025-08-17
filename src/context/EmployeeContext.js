import React, { createContext, useContext, useReducer, useEffect } from 'react';

const EmployeeContext = createContext();

const initialState = {
  employees: [
    {
      id: 1,
      name: 'John Smith',
      position: 'Chef',
      email: 'john.smith@restaurant.com',
      phone: '+1-555-0123',
      salary: 3500,
      hireDate: '2023-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'Waitress',
      email: 'sarah.johnson@restaurant.com',
      phone: '+1-555-0124',
      salary: 2200,
      hireDate: '2023-02-20',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Davis',
      position: 'Manager',
      email: 'mike.davis@restaurant.com',
      phone: '+1-555-0125',
      salary: 4500,
      hireDate: '2022-11-10',
      status: 'active'
    },
    {
      id: 4,
      name: 'Lisa Wilson',
      position: 'Cashier',
      email: 'lisa.wilson@restaurant.com',
      phone: '+1-555-0126',
      salary: 2000,
      hireDate: '2023-03-05',
      status: 'active'
    }
  ],
  salaryPayments: []
};

const employeeReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_EMPLOYEE':
      return {
        ...state,
        employees: [...state.employees, action.payload]
      };
    
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(employee => 
          employee.id === action.payload.id ? action.payload : employee
        )
      };
    
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(employee => employee.id !== action.payload)
      };
    
    case 'ADD_SALARY_PAYMENT':
      return {
        ...state,
        salaryPayments: [...state.salaryPayments, action.payload]
      };
    
    case 'UPDATE_SALARY_PAYMENT':
      return {
        ...state,
        salaryPayments: state.salaryPayments.map(payment => 
          payment.id === action.payload.id ? action.payload : payment
        )
      };
    
    case 'DELETE_SALARY_PAYMENT':
      return {
        ...state,
        salaryPayments: state.salaryPayments.filter(payment => payment.id !== action.payload)
      };
    
    case 'LOAD_EMPLOYEE_DATA':
      return {
        ...state,
        ...action.payload
      };
    
    default:
      return state;
  }
};

export const EmployeeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(employeeReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('employeeData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      dispatch({ type: 'LOAD_EMPLOYEE_DATA', payload: parsedData });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('employeeData', JSON.stringify(state));
  }, [state]);

  const addEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: Date.now(),
      status: 'active'
    };
    dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
  };

  const updateEmployee = (employee) => {
    dispatch({ type: 'UPDATE_EMPLOYEE', payload: employee });
  };

  const deleteEmployee = (employeeId) => {
    dispatch({ type: 'DELETE_EMPLOYEE', payload: employeeId });
  };

  const addSalaryPayment = (payment) => {
    const newPayment = {
      ...payment,
      id: Date.now(),
      paymentDate: new Date().toISOString()
    };
    dispatch({ type: 'ADD_SALARY_PAYMENT', payload: newPayment });
  };

  const updateSalaryPayment = (payment) => {
    dispatch({ type: 'UPDATE_SALARY_PAYMENT', payload: payment });
  };

  const deleteSalaryPayment = (paymentId) => {
    dispatch({ type: 'DELETE_SALARY_PAYMENT', payload: paymentId });
  };

  const getTotalSalaryExpense = () => {
    return state.employees.reduce((total, employee) => total + employee.salary, 0);
  };

  const getActiveEmployees = () => {
    return state.employees.filter(employee => employee.status === 'active');
  };

  const value = {
    ...state,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addSalaryPayment,
    updateSalaryPayment,
    deleteSalaryPayment,
    getTotalSalaryExpense,
    getActiveEmployees
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};
