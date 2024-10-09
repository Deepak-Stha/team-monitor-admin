import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseApiURL } from '../contexts/ApiURL';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/auth/authSlice';

const DepartmentModal = ({ isOpen, onClose, onSelectDepartment, employeeId }) => {
  const token = useSelector(selectCurrentToken)

  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const GET_DEPARTMENTS_API = `${BaseApiURL}/department/get-all-department`;
  const GET_TEAMS_API = `${BaseApiURL}/team/get-all-team-of-department`;
  const UDATE_EMPLOYEE = `${BaseApiURL}/employee/update`;

  useEffect(() => {
    if (isOpen) {
      const fetchDepartments = async () => {
        try {
          const response = await axios.get(GET_DEPARTMENTS_API, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          setDepartments(response.data.departments || []);
        } catch (error) {
          console.error("Error fetching departments:", error);
        }
      };

      fetchDepartments();
    }
  }, [isOpen, token]);

  useEffect(() => {
    if (departmentId) {
      const fetchTeams = async () => {
        try {
          const response = await axios.get(`${GET_TEAMS_API}/${departmentId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          setTeams(response.data.teams || []);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
      };

      fetchTeams();
    } else {
      setTeams([]); 
    }
  }, [departmentId, token]);

  const handleSelect = async() => {
    if (departmentId && selectedTeam) {
      onSelectDepartment(departmentId, selectedTeam);

    try {
          const res = await axios.patch(`${UDATE_EMPLOYEE}/${employeeId}`,{
            employeeId,departmentId,teamId:selectedTeam
          },
          {
             headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }
        )
    } catch (error) {
        console.log(error)
    }

      onClose();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete selection',
        text: 'Please select both a department and a team to continue.'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Select Department</h4>
        <select
          onChange={(e) => {
            const selectedDeptId = e.target.value;
            setSelectedDepartment(selectedDeptId);
            setDepartmentId(selectedDeptId); // Set the departmentId when a department is selected
          }}
          value={selectedDepartment}
        >
          <option value="">Select a department</option>
          {departments.length > 0 && departments.map(department => (
            <option key={department.departmentId} value={department.departmentId}>
              {department.departmentName}
            </option>
          ))}
        </select>

        <h4>Select Team</h4>
        <select
          onChange={(e) => setSelectedTeam(e.target.value)}
          value={selectedTeam}
        >
          <option value="">Select a team</option>
          {teams.length > 0 && teams.map(team => (
            <option key={team.teamId} value={team.teamId}>
              {team.teamName}
            </option>
          ))}
        </select>
        <div style={{display:'flex'}}>
          <button type="submit" onClick={handleSelect}>Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;
