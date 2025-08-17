import React, { useState } from 'react';
import { useEmployee } from '../context/EmployeeContext';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Users, DollarSign, Calendar } from 'lucide-react';

const SalaryManagement = () => {
  const { 
    employees, 
    salaryPayments, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    addSalaryPayment,
    updateSalaryPayment,
    deleteSalaryPayment,
    getTotalSalaryExpense
  } = useEmployee();

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    salary: 0,
    hireDate: ''
  });
  const [paymentFormData, setPaymentFormData] = useState({
    employeeId: '',
    amount: 0,
    paymentDate: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });

  const handleEmployeeSubmit = (e) => {
    e.preventDefault();
    if (editingEmployee) {
      updateEmployee({ ...editingEmployee, ...employeeFormData });
    } else {
      addEmployee(employeeFormData);
    }
    setShowEmployeeModal(false);
    setEditingEmployee(null);
    setEmployeeFormData({
      name: '',
      position: '',
      email: '',
      phone: '',
      salary: 0,
      hireDate: ''
    });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (editingPayment) {
      updateSalaryPayment({ ...editingPayment, ...paymentFormData });
    } else {
      addSalaryPayment(paymentFormData);
    }
    setShowPaymentModal(false);
    setEditingPayment(null);
    setPaymentFormData({
      employeeId: '',
      amount: 0,
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
      notes: ''
    });
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEmployeeFormData({
      name: employee.name,
      position: employee.position,
      email: employee.email,
      phone: employee.phone,
      salary: employee.salary,
      hireDate: employee.hireDate
    });
    setShowEmployeeModal(true);
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setPaymentFormData({
      employeeId: payment.employeeId,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      notes: payment.notes || ''
    });
    setShowPaymentModal(true);
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(employeeId);
    }
  };

  const handleDeletePayment = (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      deleteSalaryPayment(paymentId);
    }
  };

  const updateEmployeeStatus = (employeeId, status) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      updateEmployee({ ...employee, status });
    }
  };

  const getEmployeeById = (employeeId) => {
    return employees.find(emp => emp.id === parseInt(employeeId));
  };

  const totalSalaryExpense = getTotalSalaryExpense();
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const totalPayments = salaryPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Salary Management</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowEmployeeModal(true)}
          >
            <Plus size={16} />
            Add Employee
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowPaymentModal(true)}
          >
            <DollarSign size={16} />
            Record Payment
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card" style={{ borderLeftColor: '#667eea' }}>
          <div className="stat-title">Total Employees</div>
          <div className="stat-value">{employees.length}</div>
          <div className="stat-change">
            <Users size={16} />
            {activeEmployees} active
          </div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#48bb78' }}>
          <div className="stat-title">Monthly Salary Expense</div>
          <div className="stat-value">Rs. {totalSalaryExpense.toFixed(2)}</div>
          <div className="stat-change">
            <DollarSign size={16} />
            Total monthly cost
          </div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#ed8936' }}>
          <div className="stat-title">Total Payments Made</div>
          <div className="stat-value">Rs. {totalPayments.toFixed(2)}</div>
          <div className="stat-change">
            <Calendar size={16} />
            All time payments
          </div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f56565' }}>
          <div className="stat-title">Average Salary</div>
          <div className="stat-value">
            Rs. {employees.length > 0 ? (totalSalaryExpense / employees.length).toFixed(2) : '0.00'}
          </div>
          <div className="stat-change">
            Per employee
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="table-container" style={{ marginBottom: '30px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, color: '#2d3748' }}>Employees</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Salary</th>
              <th>Hire Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>#{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>Rs. {employee.salary.toFixed(2)}</td>
                <td>{format(new Date(employee.hireDate), 'MMM dd, yyyy')}</td>
                <td>
                  <select
                    value={employee.status}
                    onChange={(e) => updateEmployeeStatus(employee.id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      onClick={() => handleEditEmployee(employee)}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      onClick={() => handleDeleteEmployee(employee.id)}
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

      {/* Salary Payments Table */}
      <div className="table-container">
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, color: '#2d3748' }}>Salary Payments</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Employee</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaryPayments.map((payment) => {
              const employee = getEmployeeById(payment.employeeId);
              return (
                <tr key={payment.id}>
                  <td>#{payment.id}</td>
                  <td>{employee ? employee.name : 'Unknown Employee'}</td>
                  <td>Rs. {payment.amount.toFixed(2)}</td>
                  <td>{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</td>
                  <td>{payment.notes || 'No notes'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                        onClick={() => handleEditPayment(payment)}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                        onClick={() => handleDeletePayment(payment.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Employee Modal */}
      {showEmployeeModal && (
        <div className="modal-overlay" onClick={() => setShowEmployeeModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingEmployee ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <button 
                className="modal-close"
                onClick={() => setShowEmployeeModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEmployeeSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={employeeFormData.name}
                  onChange={(e) => setEmployeeFormData({...employeeFormData, name: e.target.value})}
                  placeholder="Enter employee name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Position</label>
                <input
                  type="text"
                  className="form-input"
                  value={employeeFormData.position}
                  onChange={(e) => setEmployeeFormData({...employeeFormData, position: e.target.value})}
                  placeholder="Enter position"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={employeeFormData.email}
                  onChange={(e) => setEmployeeFormData({...employeeFormData, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={employeeFormData.phone}
                  onChange={(e) => setEmployeeFormData({...employeeFormData, phone: e.target.value})}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Salary</label>
                  <input
                    type="number"
                    className="form-input"
                    value={employeeFormData.salary}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, salary: parseFloat(e.target.value) || 0})}
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hire Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={employeeFormData.hireDate}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, hireDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEmployeeModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEmployee ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingPayment ? 'Edit Payment' : 'Record Payment'}
              </h2>
              <button 
                className="modal-close"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handlePaymentSubmit}>
              <div className="form-group">
                <label className="form-label">Employee</label>
                <select
                  className="form-select"
                  value={paymentFormData.employeeId}
                  onChange={(e) => setPaymentFormData({...paymentFormData, employeeId: e.target.value})}
                  required
                >
                  <option value="">Select employee</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-input"
                    value={paymentFormData.amount}
                    onChange={(e) => setPaymentFormData({...paymentFormData, amount: parseFloat(e.target.value) || 0})}
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={paymentFormData.paymentDate}
                    onChange={(e) => setPaymentFormData({...paymentFormData, paymentDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  value={paymentFormData.notes}
                  onChange={(e) => setPaymentFormData({...paymentFormData, notes: e.target.value})}
                  placeholder="Any additional notes..."
                  rows="3"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPayment ? 'Update Payment' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryManagement;
