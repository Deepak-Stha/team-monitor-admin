import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/model.css'; 
import Swal from 'sweetalert2';
import { BaseApiURL } from '../contexts/ApiURL';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/auth/authSlice';

const EditModal = ({ isOpen, onClose, holidayId, onEditHoliday }) => {
  const token = useSelector(selectCurrentToken)

  // Defining state for all input fields
  const [holidayData, setHolidayData] = useState({
    fromDate: '',
    toDate: '',
    holidayTitle: '',
    holidayType: '',
    holidaySession: ''
  });

  // Defining API endpoints
  const holiday_by_id = `${BaseApiURL}/holiday/get-holiday`;
  const Update_API = `${BaseApiURL}/holiday/edit-holiday`;

  // Function to format date for input
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Getting previous holiday data
  const getHolidayByIdOldData = async () => {
    try {
      const oldHolidayData = await axios.get(`${holiday_by_id}/${holidayId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (oldHolidayData.status === 200) {
        setHolidayData({
          ...oldHolidayData.data.holiday,
          fromDate: formatDateForInput(oldHolidayData.data.holiday.fromDate),
          toDate: formatDateForInput(oldHolidayData.data.holiday.toDate)
        });
      }
    } catch (error) {
      console.log("Error While getting Data", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHolidayData({ ...holidayData, [name]: value });
  };

  useEffect(() => {
    if (holidayId) {
      getHolidayByIdOldData();
    }
  }, [holidayId]);

  const handleEditHoliday = async (e) => {
    e.preventDefault();
    try {
      const preparedData = {
        fromDate: new Date(holidayData.fromDate).toISOString(),
        toDate: new Date(holidayData.toDate).toISOString(),
        holidayTitle: holidayData.holidayTitle.trim(),
        holidayType: holidayData.holidayType.toUpperCase(),
        holidaySession: holidayData.holidaySession.trim(),
      };

      const response = await axios.patch(`${Update_API}/${holidayId}`, preparedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Holiday Edited',
          text: response.data.message
        });
        
        if (typeof onEditHoliday === 'function') {
          onEditHoliday(); 
        } else {
          console.error('onEditHoliday is not a function');
        }
        
        onClose();
      }
    } catch (error) {
      console.error("Error editing holiday:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'An unknown error occurred'
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
        <h2>Edit Holiday</h2>
        <form onSubmit={handleEditHoliday}>
          <label>
            Holiday From Date:
            <input
              type="datetime-local"
              name="fromDate"
              value={holidayData.fromDate}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Holiday To Date:
            <input
              type="datetime-local"
              name="toDate"
              value={holidayData.toDate}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Holiday Title:
            <input
              type="text"
              name="holidayTitle"
              value={holidayData.holidayTitle}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Holiday Type:
            <select name="holidayType" value={holidayData.holidayType} onChange={handleInputChange} required>
              <option value="" disabled>Select Type</option>
              <option value="PUBLIC">PUBLIC</option>
              <option value="PRIVATE">PRIVATE</option>
              <option value="OFFICIAL">OFFICIAL</option>
            </select>
          </label>
          <label>
            Holiday Session:
            <input
              type="text"
              name="holidaySession"
              value={holidayData.holidaySession}
              onChange={handleInputChange}
              required
            />
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

export default EditModal;
