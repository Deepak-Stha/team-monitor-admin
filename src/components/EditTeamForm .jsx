import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseApiURL } from '../contexts/ApiURL';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/auth/authSlice';

const EditTeamForm = ({ isOpen, onClose, teamData, getAllTeam, departmentId }) => {
    const token = useSelector(selectCurrentToken)
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [teamHeadName, setTeamHeadName] = useState('');
    const [updateTeamData, setUpdateTeamData] = useState({
        teamName: '',
        teamHead: '',
        departmentId: ''
    });

    const GET_TEAM_BY_ID = `${BaseApiURL}/team/get-team`;
    const EDIT_TEAM_API = `${BaseApiURL}/team/update-team`;
    const EMPLOYEE_OF_TEAM = `${BaseApiURL}/company/all-employees-team`;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateTeamData({ ...updateTeamData, [name]: value });
    };

    const handleEmployeeChange = (e) => {
        const employeeId = e.target.value;
        const employee = employees.find(emp => emp.employeeId === employeeId);
        setSelectedEmployee(employeeId);
        setTeamHeadName(employee ? employee.employeeName : '');
        setUpdateTeamData({ ...updateTeamData, teamHead: employeeId });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const preparedData = {
                teamId: teamData,
                departmentId: departmentId,
                teamName: updateTeamData.teamName,
                teamHead: updateTeamData.teamHead
            };
    
            const updateTeamResponse = await axios.patch(EDIT_TEAM_API, preparedData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
    
            // Check if the response status is 200
            if (updateTeamResponse.status === 200) {
                   
                Swal.fire({
                    icon: 'success',
                    title: 'Team Updated',
                    text: 'Your team has been successfully updated.'
                });
                onClose();
            }
        } catch (error) {
            console.error("Error updating team", error);
    
            const errorMessage = error.response?.data?.message || 'An error occurred while updating the team. Please try again.';
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage
            });
        }
    };
    

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${EMPLOYEE_OF_TEAM}/${teamData}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.status === 200) {
                setEmployees(response.data.employees);
            }
        } catch (error) {
            console.error("Error fetching employees", error);
        }
    };

    const handleGetOldDepartment = async () => {
        try {
            const response = await axios.get(`${GET_TEAM_BY_ID}?teamId=${teamData}&departmentId=${departmentId}`, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                const { teamName, teamHead, departmentId } = response.data.team;
                setUpdateTeamData({ teamName, teamHead, departmentId });
                setSelectedEmployee(teamHead || '');
            }
            
        } catch (error) {
            console.error("Error fetching old department data", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            handleGetOldDepartment();
            fetchEmployees();
        }
    }, [isOpen, teamData]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Team</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Team Name:
                        <input
                            type="text"
                            name="teamName"
                            value={updateTeamData.teamName}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Team Head:
                        <select
                            name="teamHead"
                            value={selectedEmployee}
                            onChange={handleEmployeeChange}
                            required
                        >
                            <option value="">Select Team Head</option>
                            {employees.length > 0 ? (
                                employees.map(employee => (
                                    <option key={employee.employeeId} value={employee.employeeName}>
                                        {employee.employeeName}
                                    </option>
                                ))
                            ) : (
                                <option value="">No Team Head Available</option>
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

export default EditTeamForm;
