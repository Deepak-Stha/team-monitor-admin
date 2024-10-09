import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { BaseApiURL } from '../contexts/ApiURL';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/auth/authSlice';

const UpdateDepartmentForm = ({ isOpen, onClose, departmentId, getAllDepartment }) => {
  const token = useSelector(selectCurrentToken)
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [updateDepartmentData, setUpdateDepartmentData] = useState({
    departmentName: '',
    noOfTeams: '',
    departmentHead: ''
  });

  const GET_DEPARTMENT_BY_ID_API = `${BaseApiURL}/department/get-department`;
  const UPDATE_DEPARTMENT_DATA = `${BaseApiURL}/department/update-department`;
  const DEPARTMENT_EMPLOYEE = `${BaseApiURL}/department/get-department-employees`;

  const [oldData, setOldData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateDepartmentData({ ...updateDepartmentData, [name]: value });
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
    setUpdateDepartmentData({ ...updateDepartmentData, departmentHead: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { departmentName, noOfTeams, departmentHead } = updateDepartmentData;
      const preparedData = {
        departmentName,
        noOfTeams: isNaN(parseInt(noOfTeams)) ? null : parseInt(noOfTeams),
        departmentHead
      };

      const updateDepartmentDataResponse = await axios.patch(`${UPDATE_DEPARTMENT_DATA}/${departmentId}`, preparedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Data Updated',
        text: updateDepartmentDataResponse.statusText 
      });

      getAllDepartment();
      onClose();
    } catch (error) {
      console.log("Error While Updating Data", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred' 
      });
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${DEPARTMENT_EMPLOYEE}/${departmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.status === 200) {
        console.log('Fetched employees:', response.data); 
        setEmployees(response.data); 
      }
    } catch {
      console.error('Error fetching employees');
    }
  };

  const handleGetDepartmentOldData = async () => {
    try {
      const getDepartmentOldDataResponse = await axios.get(`${GET_DEPARTMENT_BY_ID_API}/${departmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
  
      if (getDepartmentOldDataResponse.status === 200) {
        const { departmentName, noOfTeams, departmentHead } = getDepartmentOldDataResponse.data.department;
        setOldData(getDepartmentOldDataResponse.data.department);
        setUpdateDepartmentData({ departmentName, noOfTeams, departmentHead });
        setSelectedEmployee(departmentHead || ''); // Set the departmentHead
      }
    } catch (error) {
      console.error('Error fetching department data', error);
    }
  };
  
  useEffect(() => {
    handleGetDepartmentOldData();
    fetchEmployees();
  }, [isOpen, departmentId]); 

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
        <h2>Update Department</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Department Name:
            <input
              type="text"
              name="departmentName"
              value={updateDepartmentData.departmentName}
              onChange={handleInputChange}
              required
            />
          </label>
        
          <input
            type="text"
            name="noOfTeams"
            value={updateDepartmentData.noOfTeams}
            onChange={handleInputChange}
            style={{display: 'none'}}
            required
          />

          <label>
            Department Head:
            <select
              name="departmentHead"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              displayEmpty
              required
            >
              <option value="">Department Head</option>
              {employees.length > 0 ? (
                employees.map(employee => (
                  <option key={employee.employeeId} value={employee.employeeName}>
                    {employee.employeeName}
                  </option>
                ))
              ) : (
                <option value="">No Employees</option>
              )}
            </select> 
          </label>

          <div className="modal-buttons">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDepartmentForm;
