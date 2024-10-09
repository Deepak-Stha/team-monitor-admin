import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Bar from '../sidebar/Bar';
import eye from "../assets/images/eye.svg";
import edit from "../assets/images/edit.svg";
import del from "../assets/images/del.svg";
import EmployeeEditModal from './EmployeeEditModal '; 
import { BaseApiURL } from '../contexts/ApiURL';
import TablePagination from '@mui/material/TablePagination';
import Swal from 'sweetalert2';
import "../assets/css/newStyle.css";
import { selectCurrentToken } from '../redux/auth/authSlice';
import { useSelector } from 'react-redux';

const ManageEmployee = () => {
  const token = useSelector(selectCurrentToken)
  const GET_COMPANY_EMPLOYEES_ID = `${BaseApiURL}/company/all-employees`;
  const GET_ALL_DEPARTMENTS = `${BaseApiURL}/department/get-all-department`;
  const GET_ALL_TEAMS = `${BaseApiURL}/team/get-all-team-of-company`;
  const DELETE_EMPLOYEE_API = `${BaseApiURL}/employee-setting/delete-employee`;

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    handleGetEmployees();
    handleGetDepartments();
    handleGetTeams();
  }, []);

  useEffect(() => {
    handleGetEmployees();
    setDataChanged(false); 
  }, [dataChanged]);

  const handleGetEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(GET_COMPANY_EMPLOYEES_ID, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const sortedEmployees = response.data.employees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setEmployees(sortedEmployees);
      setDataChanged(false);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleGetDepartments = async () => {
    try {
      const response = await axios.get(GET_ALL_DEPARTMENTS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setDepartments(response.data.departments);
      setDataChanged(false);
    } catch (error) {
      console.error(error);
    }
  }

  const handleGetTeams = async () => {
    try {
      const response = await axios.get(GET_ALL_TEAMS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });
      setTeams(response.data.teams);
      setDataChanged(false);
    } catch (error) {
      console.error('Error while fetching teams', error);
    }
  }

  const handleDeleteEmployee = async (employeeId) => {
    const confirmDeletion = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this employee!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (confirmDeletion.isConfirmed) {
      try {
        const response = await axios.delete(`${DELETE_EMPLOYEE_API}/${employeeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
  
        if (response.data.message) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500
          });
          // Refresh the employee list after deletion
          setDataChanged(true);
        }
      } catch (error) {
        console.error('Error while deleting employee', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    }
  }

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept.departmentId === departmentId);
    return department ? department.departmentName : 'Unknown Department';
  };

  const getTeamName = (teamId) => {
    const team = teams.find((team) => team.teamId === teamId);
    return team ? team.teamName : 'Unknown Team';
  }

  const openEditModal = (employee) => {
    const departmentName = getDepartmentName(employee.departmentId);
    const teamName = getTeamName(employee.teamId);
    setSelectedEmployee({ ...employee, departmentName, teamName });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employeeAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown !== null && !event.target.closest('.dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const handleEmployeeEdit = () => {
    setDataChanged(true); 
  }

  return (
    <>
      <Bar />
      <div className='right-content'>
        <div className="upper-right-side">
          <h1>Employees</h1>
          <input 
            className="search-bar-managee-employee"
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
            style={{ width: "10px", marginBottom: "10px"}}
          />
        </div>
        <section className="table-manage-leave-section">
           <div className="list-of-employes">
             <table id="styled-table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Employee Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>PhoneNumber</th>
                  <th>Department</th>
                  <th>Team</th>
                  <th>Position</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee, index) => (
                  <tr key={index}>
                    <td>{index + 1 + page * rowsPerPage}</td>
                    <td>{employee.employeeName}</td>
                    <td>{employee.email}</td>
                    <td>{employee.employeeAddress}</td>
                    <td>{employee.phoneNumber}</td>
                    <td>{getDepartmentName(employee.departmentId)}</td>
                    <td>{getTeamName(employee.teamId)}</td>
                    <td>{employee.position}</td>
                    <td style={{ display: "flex", width: "100%", columnGap: "20px", justifyContent: "center" }}>
                      <Link to={`/EmployeeUsedApp/${employee.employeeId}`}>
                        <img src={eye} alt="View" />
                      </Link>
                      <Link to="#" onClick={() => openEditModal(employee)}>
                        <img src={edit} alt="Edit" />
                      </Link>
                      <Link to="#" onClick={() => handleDeleteEmployee(employee.employeeId)}>
                        <img src={del} alt="Delete Icon" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ position: 'sticky', bottom: 10, backgroundColor: '#fff', zIndex: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        />

        {isModalOpen && 
          <EmployeeEditModal 
            employee={selectedEmployee} 
            onClose={closeEditModal} 
            onEditEmployee={handleEmployeeEdit}
          />}
      </div>
    </>
  );
};

export default ManageEmployee;
