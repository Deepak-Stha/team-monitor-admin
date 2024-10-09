import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BaseApiURL } from "../contexts/ApiURL";
import "../assets/css/employeeList.css"
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";

const TeamEmployeeModal = ({ teamId, isOpen, onClose }) => {
    const token = useSelector(selectCurrentToken)
    const [employees, setEmployees] = useState([]);

    const GET_EMPLOYEES_BY_TEAM_API = `${BaseApiURL}/company/all-employees-team/${teamId}`;

    useEffect(() => {
        if (isOpen && teamId) {
            const fetchEmployees = async () => {
                try {
                    const response = await axios.get(GET_EMPLOYEES_BY_TEAM_API, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    });
                    if (response.status === 200) {
                        setEmployees(response.data.employees);
                    }
                } catch (error) {
                    console.error("Error fetching employees:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.response ? error.response.data.message : "An error occurred"
                    });
                }
            };
            fetchEmployees();
        }
    }, [isOpen, teamId]);

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Employees List</h2>
                <ul>
                    {employees.length > 0 ? (
                        employees.map(employee => (
                            <li key={employee.id}>{employee.employeeName}</li>
                        ))
                    ) : (
                        <li>No employees found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default TeamEmployeeModal;
