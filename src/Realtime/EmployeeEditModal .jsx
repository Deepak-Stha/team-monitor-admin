import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseApiURL } from '../contexts/ApiURL';
import { selectCurrentToken } from '../redux/auth/authSlice';
import { useSelector } from 'react-redux';

const EmployeeEditModal = ({ employee, onClose, onEditEmployee }) => {
  const token = useSelector(selectCurrentToken)
  const [employeeData, setEmployeeData] = useState(employee);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(employee.departmentId || '');
  const [selectedTeam, setSelectedTeam] = useState(employee.teamId || '');

  useEffect(() => {
    handleGetCompanyAllDepartment();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      handleGetDepartmentAllTeam(selectedDepartment);
    }
  }, [selectedDepartment]);

  const handleChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value,
    });
  };

  // API endpoints
  const get_Departmment_Name = `${BaseApiURL}/department/get-all-department`;
  const get_Team_Name = `${BaseApiURL}/team/get-all-team-of-department`;
  const edit_dept_and_team = `${BaseApiURL}/employee/update`;

  // Fetch all department names of the company
  const handleGetCompanyAllDepartment = async () => {
    try {
      const response = await axios.get(get_Departmment_Name, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (response.status === 200) {
        setDepartments(response.data.departments);
        onEditEmployee();
      }
    } catch (error) {
      console.error('Error while fetching department names', error);
    }
  };

  // Fetch all team names of the department
  const handleGetDepartmentAllTeam = async (departmentId) => {
    try {
      const response = await axios.get(`${get_Team_Name}/${departmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (response.status === 200) {
        setTeams(response.data.teams);
        onEditEmployee();
      }
    } catch (error) {
      console.error('Error while fetching team names', error);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    setEmployeeData({ ...employeeData, departmentId: departmentId });
    setTeams([]);  
    setSelectedTeam('');
  };

  const handleTeamChange = (e) => {
    const teamId = e.target.value;
    setSelectedTeam(teamId);
    setEmployeeData({ ...employeeData, teamId: teamId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updateDeptAndTeam = await axios.patch(`${edit_dept_and_team}/${employeeData.employeeId}`, {
        employeeId: employee.employeeId,
        departmentId: selectedDepartment,
        teamId: selectedTeam,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (updateDeptAndTeam.data.message) {
        Swal.fire({
          icon: 'success',
          title: 'Employee Updated',
          text: updateDeptAndTeam.data.message,
        });
        onEditEmployee();
        onClose();
      } 
    } catch (error) {
      console.error('Error while updating department and team', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response.data.message,
      });
      onClose();
    }
  };

  // Close modal if clicked outside the modal-content
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2 style={{ color: 'black' }}>Edit Employee</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ color: 'black' }}>
            Department Name:
            <select
              name="department"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
            >
              <option value="">{employee.departmentName}</option>
              {departments.map((dept) => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </label>

          <label style={{ color: 'black' }}>
            Team Name:
            <select name="team" value={selectedTeam} onChange={handleTeamChange}>
              <option value="">{employee.teamName}</option>
              {teams.map((team) => (
                <option key={team.teamId} value={team.teamId}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </label>
          <div className="edit-btn">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeEditModal;
