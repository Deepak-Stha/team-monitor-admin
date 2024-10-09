import React, { useEffect, useState } from "react";
import axios from "axios";
import Bar from "../sidebar/Bar";
import Swal from "sweetalert2";
import { BaseApiURL } from "../contexts/ApiURL";
import { Link } from "react-router-dom";
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";

function RiskUser() {
    const token = useSelector(selectCurrentToken)
    const [riskedUsers, setRiskedUsers] = useState([]);
    const [employeeId, setEmployeeId] = useState("");
    const navigate = useNavigate();

    const ADD_TO_INACTIVE_USER_API = `${BaseApiURL}/riskuser/add-to-inactive`;
    const SAFE_FROM_RISKUSER_API = `${BaseApiURL}/riskuser/safe-from-riskUser`;
    const GET_ALL_RISKED_USERS = `${BaseApiURL}/riskuser/getRiskUser`;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handle_get_all_risked_users = async () => {
        const response = await axios.get(GET_ALL_RISKED_USERS, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        setRiskedUsers(response.data.riskUser || []);
    };

    const addToInactiveUser = async (employeeId, riskUserId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You want to add this user to inactive list.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel!',
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.put(`${ADD_TO_INACTIVE_USER_API}/${employeeId}`, { riskUserId }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.data.message) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `${response.data.message}`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
                handle_get_all_risked_users();

            } catch (error) {
                console.log("Error While Fetching Data");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'An unexpected error occurred.'
                });
            }
        }
    };

    const safeFromRiskUser = async (riskUserId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You want to mark this user as safe.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, mark as safe!',
            cancelButtonText: 'No, cancel!',
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${SAFE_FROM_RISKUSER_API}/${riskUserId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.data.message) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `${response.data.message}`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
                handle_get_all_risked_users();

            } catch (error) {
                console.log("Error While Fetching Data");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'An unexpected error occurred.'
                });
            }
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRiskUserDetails = (employeeId) => {
        setEmployeeId(employeeId);
        navigate("/RiskUserDetails", { state: { employeeId } });
    };

    useEffect(() => {
        handle_get_all_risked_users();
    }, []);

    return (
        <div>
            <Bar />
            <div className="right-content">
                <div className="right-main-upper-content">
                    <div className="holidays">
                        <h6>Risk Users</h6>
                        <p className="page">Manage all the risk users in your organization</p>
                    </div>
                </div>
                <section className="table-manage-leave-section">
                    <div className="list-of-employes">
                        <table id="styled-table">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>Id</th>
                                    <th>Employee Name</th>
                                    <th>Department</th>
                                    <th>Team</th>
                                    <th>Address</th>
                                    <th>Phone Number</th>
                                    <th>Position</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {riskedUsers.length > 0 && riskedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((riskUser, i) => (
                                    <tr key={riskUser.riskUserId} onClick={() => handleRiskUserDetails(riskUser.employeeId)}>
                                        <td>{i + 1}</td>
                                        <td>{riskUser.employeeId}</td>
                                        <td>{riskUser.employeeName}</td>
                                        <td>{riskUser.department.departmentName}</td>
                                        <td>{riskUser.employee.team.teamName}</td>
                                        <td>{riskUser.employee.employeeAddress}</td>
                                        <td>{riskUser.employee.phoneNumber}</td>
                                        <td>{riskUser.employee.position}</td>
                                        <td style={{ display: "flex", justifyContent: 'center', columnGap: "13px" }}>
                                            <Link
                                                to="#"
                                                style={{
                                                    backgroundColor: 'green',
                                                    borderRadius: '4px',
                                                    padding: '8px 12px',
                                                    textDecoration: 'none',
                                                    color: 'white'
                                                }}
                                                onClick={(e) => { e.stopPropagation(); safeFromRiskUser(riskUser.riskUserId); }}>
                                                Safe
                                            </Link>
                                            <Link
                                                to="#"
                                                style={{
                                                    backgroundColor: 'red',
                                                    borderRadius: '4px',
                                                    padding: '8px 12px',
                                                    textDecoration: 'none',
                                                    color: 'white'
                                                }}
                                                onClick={(e) => { e.stopPropagation(); addToInactiveUser(riskUser.employeeId, riskUser.riskUserId); }}>
                                                Inactive
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
                    count={riskedUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={{ position: 'sticky', bottom: 10, backgroundColor: '#fff', zIndex: 0,  display: "flex", justifyContent: "center", alignItems: "center" }}
                />
            </div>
        </div>
    );
}

export default RiskUser;
