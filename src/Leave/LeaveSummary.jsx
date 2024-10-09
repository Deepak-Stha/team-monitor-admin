import React, { useEffect, useState } from "react";
import Bar from "../sidebar/Bar";
import "../assets/css/leaveSummary.css";
import axios from "axios";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { BaseApiURL } from "../contexts/ApiURL";
import TablePagination from '@mui/material/TablePagination';
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";

function LeaveSummary() {
    const token = useSelector(selectCurrentToken)

    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState("all-leave");
    const [selectedLeaveStatus, setSelectedLeaveStatus] = useState("all-status");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(9);

    const GET_ALL_LEAVE_API = `${BaseApiURL}/leave/get-all-leave`;

    const handle_get_all_leave = async () => {
        try {
            const get_all_leave_response = await axios.get(GET_ALL_LEAVE_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            setLeaves(get_all_leave_response.data.allLeave);
            setFilteredLeaves(get_all_leave_response.data.allLeave);
        } catch (error) {
            console.error("Error fetching leave data", error);
        }
    };

    useEffect(() => {
        handle_get_all_leave();
        
        const intervalId = setInterval(() => {
            handle_get_all_leave();
        }, 60000); // Poll every 60 seconds

        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      }
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }
    

    useEffect(() => {
        let filtered = leaves;

        if (selectedLeaveType !== "all-leave") {
            filtered = filtered.filter(leave => leave.leaveType === selectedLeaveType);
        }

        if (selectedLeaveStatus !== "all-status") {
            filtered = filtered.filter(leave => leave.leaveStatus === selectedLeaveStatus);
        }

        setFilteredLeaves(filtered);
    }, [selectedLeaveType, selectedLeaveStatus, leaves]);

    const handleLeaveTypeChange = (event) => {
        setSelectedLeaveType(event.target.value);
    };

    const handleLeaveStatusChange = (event) => {
        setSelectedLeaveStatus(event.target.value);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVE':
                return 'green';
            case 'PENDING':
                return 'orange';
            case 'DECLINED':
                return 'red';
            default:
                return 'white'; 
        }
    };

    return (
        <div>
            <Bar />
            <div className="right-content">
                <div className="right-main-upper-content">
                    <div className="flex-main-heading">
                        <div className="manage-desc">
                            <h2>Leave Summary</h2>
                            <p>Manage all the leave summary in your organization</p>
                        </div>
                    </div>
                    <div className="down">
                        <FormControl sx={{ minWidth: 120 }}>
                            <Select
                                labelId=""
                                onChange={handleLeaveTypeChange}
                                value={selectedLeaveType || ""}
                                displayEmpty
                            >
                                <MenuItem value="all-leave">All Leave</MenuItem>
                                <MenuItem value="CASUALLEAVE">Casual Leave</MenuItem>
                                <MenuItem value="SICKLEAVE">Sick Leave</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120 }}>
                            <Select
                                labelId=""
                                onChange={handleLeaveStatusChange}
                                value={selectedLeaveStatus || ""}
                                displayEmpty
                            >
                                <MenuItem value="all-status">All Status</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="APPROVE">Approved</MenuItem>
                                <MenuItem value="DECLINED">Declined</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <section className="table-manage-leave-section">
                    <div className="list-of-employes">
                        <table id="styled-table">
                            <thead className="manage-leave-heading-table">
                                <tr>
                                    <th>ID</th>
                                    <th>Employee Name</th>
                                    <th>Department</th>
                                    <th>Employee Position</th>
                                    <th>Leave Type</th>
                                    <th>Leave Reason</th>
                                    <th>Leave From</th>
                                    <th>Leave To</th>
                                    <th>No of Days</th>
                                    <th>Leave Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.length > 0 ? (
                                    filteredLeaves.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((leave, i) => (
                                        <tr key={leave.leaveId} className="tr-table-leave">
                                            <td>{i + 1}</td>
                                            <td>{leave.employee.employeeName}</td>
                                            <td>{leave.department.departmentName}</td>
                                            <td>{leave.employee.position}</td>
                                            <td>{leave.leaveType}</td>
                                            <td>{leave.reason}</td>
                                            <td>{leave.leaveFrom.split('T')[0]}</td>
                                            <td>{leave.leaveTo.split('T')[0]}</td>
                                            <td>{leave.noOfDays}</td>
                                            <td style={{ color: getStatusColor(leave.leaveStatus) }}>
                                                {leave.leaveStatus}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
                <TablePagination
                    rowsPerPageOptions={[9]}
                    component="div"
                    count={filteredLeaves.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={{ position: 'sticky', bottom: 10, backgroundColor: '#fff', zIndex: 0 , display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}
                />
            </div>
        </div>
    );
}

export default LeaveSummary;
