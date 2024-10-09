import React, { useState } from 'react';
import '../assets/css/model.css'; // Import CSS for styling
import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseApiURL } from '../contexts/ApiURL';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/auth/authSlice';

const Modal = ({ isOpen, onClose, onAddHoliday }) => {
  const token = useSelector(selectCurrentToken)
  // Add Holiday API
  const ADD_HOLIDAY_API = `${BaseApiURL}/holiday/create-holiday`;

  const [holidayData, setHolidayData] = useState({
    fromDate: '',
    toDate: '',
    holidayTitle: '',
    holidayType: '',
    holidaySession: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHolidayData({ ...holidayData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data with proper conversions and validations
      const preparedData = {
        fromDate: new Date(holidayData.fromDate).toISOString(),
        toDate: new Date(holidayData.toDate).toISOString(),
        holidayTitle: holidayData.holidayTitle.trim(),
        holidayType: holidayData.holidayType.toUpperCase(), 
        holidaySession: holidayData.holidaySession.trim(), 
      };
      const response = await axios.post(ADD_HOLIDAY_API, preparedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Holiday Added',
          text: response.data.message
        });
        onAddHoliday(); 
        onClose();
      }
    } catch (error) {
      console.error("Error adding holiday", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response.data.message
      });
    }
  };

  // Close modal if clicked outside the modal-content
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2 style={{ color: "black" }}>Add Holiday</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ color: "black" }}>
            Holiday From Date:
            <input type="datetime-local" name="fromDate" value={holidayData.fromDate} onChange={handleInputChange} required />
          </label>
          <label style={{ color: "black" }}>
            Holiday To Date:
            <input type="datetime-local" name="toDate" value={holidayData.toDate} onChange={handleInputChange} required />
          </label>
          <label style={{ color: "black" }}>
            Holiday Title:
            <input type="text" name="holidayTitle" value={holidayData.holidayTitle} onChange={handleInputChange} required />
          </label>
          <label style={{ color: "black" }}>
            Holiday Type:
            <select name="holidayType" value={holidayData.holidayType} onChange={handleInputChange} required>
              <option value="" disabled>Select Type</option>
              <option value="PUBLIC">PUBLIC</option>
              <option value="PRIVATE">PRIVATE</option>
              <option value="OFFICIAL">OFFICIAL</option>
            </select>
          </label>
          <label style={{ color: "black" }}>
            Holiday Session:
            <input type="text" name="holidaySession" value={holidayData.holidaySession} onChange={handleInputChange} required />
          </label>
          <div className="modal-buttons" style={{display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button type="submit" style={{width: "49%"}}>Save</button>
            <button type="button" style={{width: "49%"}} onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
