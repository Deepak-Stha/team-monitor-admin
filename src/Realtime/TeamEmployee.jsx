import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { BaseApiURL } from '../contexts/ApiURL';
import Bar from '../sidebar/Bar';
import eye from "../assets/images/eye.svg";
import edit from "../assets/images/edit.svg";
import del from "../assets/images/del.svg";
import TablePagination from '@mui/material/TablePagination';
import Swal from 'sweetalert2';
import { selectCurrentToken } from '../redux/auth/authSlice';
import { useSelector } from 'react-redux';

const TeamEmployee = () => {
    const token = useSelector(selectCurrentToken)
    const {id} = useParams();

    const [employees, setEmployees ] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const get_employee_api = `${BaseApiURL}/company/all-employees-team`;

    const handleGetEmployee = async () => {
        const response = await axios.get(`${get_employee_api}/${id}`, {
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Accept': 'application/json' 
            }
        });
        if (response.status === 200) {
            setEmployees(response.data.employees);
            console.log("employee", employees)
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    useEffect(() => {
        handleGetEmployee();
    }, [id])

    return (
        <>
            <Bar/>
            <div className="right-content">
                <div className="upper-right-side">
                    <h1>Team Members</h1>
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
                                <th>Position</th>
                                {/* <th>Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + page * rowsPerPage}</td>
                                    <td>{employee.employeeName}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.employeeAddress}</td>
                                    <td>{employee.phoneNumber}</td>
                                    <td>{employee.position}</td>
                                    {/* <td style={{ display: "flex", width: "100%", columnGap: "20px", justifyContent: "center" }}>
                                    </td> */}
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={employees.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={{ position: 'sticky', bottom: 10, backgroundColor: '#fff', zIndex: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                />
            </div>
        </>
    )
}

export default TeamEmployee