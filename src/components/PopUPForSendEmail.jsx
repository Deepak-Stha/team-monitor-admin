import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const PopUpForSendEmail = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeEmail: '',
    empId: '',
    employeeRole: '',
    teamName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Send Email Modal"
    >
      <h2>Send Email</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee Name:</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Employee Email:</label>
          <input
            type="email"
            name="employeeEmail"
            value={formData.employeeEmail}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Employee ID:</label>
          <input
            type="text"
            name="empId"
            value={formData.empId}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Employee Role:</label>
          <input
            type="text"
            name="employeeRole"
            value={formData.employeeRole}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Team Name:</label>
          <input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={onRequestClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default PopUpForSendEmail;
