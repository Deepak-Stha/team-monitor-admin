import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../assets/css/model.css";
import DepartmentModal from './DepartmentModel';
import { BaseApiURL } from '../contexts/ApiURL';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/auth/authSlice';

const AddUser = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({});
  const [isDepartmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [employeeid, setEmployeeid] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const token = useSelector(selectCurrentToken)
  const REGISTER_API = `${BaseApiURL}/employee/register`;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(REGISTER_API, form, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.data.message) {
        Swal.fire({
          icon: 'success',
          title: 'User Registered',
          text: response.data.message
        });
        setEmployeeid(response.data.employee.employeeId);
        setDepartmentModalOpen(true);
      }

    } catch (error) {
      console.error("Error encountered while posting data", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An unexpected error occurred.'
      });
    }
  };

  const handleDepartmentSelect = (departmentId) => {
    console.log("Selected Department:", departmentId);
    setDepartmentModalOpen(false);
    onClose(); // Close the AddUser modal
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Close modal if clicked outside the modal-content
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-content">
          <h2>Add User</h2>
          <form onSubmit={handleAddUserSubmit}>
            <input type="text" name="employeeName" placeholder='Employee Name' onChange={handleChange} required />
            <input type="email" name='email' placeholder='Email' onChange={handleChange} />
            <input type="tel" name="phoneNumber" placeholder='Phone Number' onChange={handleChange} />
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder='Password' 
                onChange={handleChange} 
                required 
              />
              <span 
                onClick={togglePasswordVisibility} 
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
              >
                <Icon icon={showPassword ? 'octicon:eye-24' : 'ri:eye-close-line'} style={{ color: "grey", fontSize: "20px" }} />
              </span>
            </div>
            <input type="text" name='employeeAddress' placeholder='Employee Address' onChange={handleChange} />
            <input type="text" name='position' placeholder='Position' onChange={handleChange} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button type="submit">Add User</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <DepartmentModal 
        isOpen={isDepartmentModalOpen} 
        onClose={() => setDepartmentModalOpen(false)}
        onSelectDepartment={handleDepartmentSelect} 
        employeeId={employeeid}
      />
    </>
  );
};

export default AddUser;
