import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Bar from "../sidebar/Bar";
import "../assets/css/style.css";
import bluecircle from "../assets/images/blue-circle.svg";
import yellowcircle from "../assets/images/yellow-circle.svg";
import circlestatusbar from "../assets/images/circle-status-bar-icon.svg";
import pendingicon from "../assets/images/pending-icon.svg";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import rejectedicon from "../assets/images/rejected-icon.svg";
import RequestIcon from "../assets/images/request-icon.svg";
import axios from "axios";
import Swal from "sweetalert2";
import { BaseApiURL } from "../contexts/ApiURL";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";

function ManageLeave() {
    const token = useSelector(selectCurrentToken)
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [requestedCount, setRequestedCount] = useState(0);
    const [selectedLeaveType, setSelectedLeaveType] = useState("all-leave");
    const [dataChanged, setDataChanged] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [leavesPerPage] = useState(10); // Number of leaves to display per page

    const GET_ALL_LEAVE_API = `${BaseApiURL}/leave/get-all-leave`
    const UPDATE_LEAVE_STATUS_API = `${BaseApiURL}/leave/leave-status-update`

    const handle_get_all_leave = async () => {
        try {
            const response = await axios.get(GET_ALL_LEAVE_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const allLeaves = response.data.allLeave;
            setLeaves(allLeaves);
            filterLeaves(allLeaves, selectedLeaveType);
            setDataChanged(true)
        } catch (error) {
            console.error("Error fetching leave data", error);
        }
    };

    const filterLeaves = (allLeaves, leaveType) => {
        const filtered = allLeaves.filter(leave =>
            (leaveType === "all-leave" || leave.leaveType === leaveType) &&
            leave.leaveStatus === 'PENDING'
        );

        setFilteredLeaves(filtered);

        setApprovedCount(
            allLeaves.filter(leave =>
                (leaveType === "all-leave" || leave.leaveType === leaveType) &&
                leave.leaveStatus === 'APPROVE'
            ).length
        );

        setRejectedCount(
            allLeaves.filter(leave =>
                (leaveType === "all-leave" || leave.leaveType === leaveType) &&
                leave.leaveStatus === 'DECLINED'
            ).length
        );
    };

    const handle_update_status = async (leaveId, employeeId, leaveStatus) => {
        try {
            const response = await axios.put(`${UPDATE_LEAVE_STATUS_API}/${leaveId}`, { leaveStatus, employeeId }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.data.message) {
                Swal.fire({
                    icon: 'success',
                    title: 'Leave Status Updated Successfully',
                    text: response.data.message
                });
                handle_get_all_leave();
            }
            setDataChanged(true);
        } catch (error) {
            console.error("Error updating leave status", error);
        }
    };

    // useEffect(() => {
    //     handle_get_all_leave();
    // }, [selectedLeaveType, dataChanged]);


    useEffect(() => {
        handle_get_all_leave();
        
        const intervalId = setInterval(() => {
            handle_get_all_leave();
        }, 60000); // Poll every 60 seconds

        return () => clearInterval(intervalId); 
    }, [selectedLeaveType]);
    

    useEffect(() => {
        if (leaves.length > 0) {
            const totalLeave = leaves.length;
            const approvedProgress = (approvedCount / totalLeave) * 100;
            const pendingProgress = (filteredLeaves.length / totalLeave) * 100;

            const radius = 135;
            const circumference = 2 * Math.PI * radius;

            const approvedCircle = document.querySelector('.progress-circle');
            const pendingCircle = document.querySelector('.progress-circle-yellow');

            approvedCircle.style.strokeDasharray = `${circumference}`;
            approvedCircle.style.strokeDashoffset = `${circumference - (approvedProgress / 100) * circumference}`;

            pendingCircle.style.strokeDasharray = `${circumference}`;
            pendingCircle.style.strokeDashoffset = `${circumference - (pendingProgress / 100) * circumference}`;
        }
    }, [leaves, approvedCount, filteredLeaves, selectedLeaveType]);

    const handleLeaveTypeChange = (event) => {
        setSelectedLeaveType(event.target.value);
    };

    // Get current leaves for the current page
    const indexOfLastLeave = currentPage * leavesPerPage;
    const indexOfFirstLeave = indexOfLastLeave - leavesPerPage;
    const currentLeaves = filteredLeaves.slice(indexOfFirstLeave, indexOfLastLeave);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle previous and next page
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < pageNumbers.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Create page numbers for pagination
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredLeaves.length / leavesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <Bar />
            <div className="right-content">
                <div className="flex-main-heading">
                    <div className="manage-desc">
                        <h2>Manage Leave Requests</h2>
                        <p>Manage all the Leave Requests in your organization</p>
                    </div>
                    <FormControl sx={{ minWidth: 120 }}>
                        <Select
                            labelId="leave-type-selector"
                            onChange={handleLeaveTypeChange}
                            value={selectedLeaveType}
                            displayEmpty
                        >
                            <MenuItem value="all-leave">All Leave Type</MenuItem>
                                <MenuItem value="SICKLEAVE">Sick Leave</MenuItem>
                                <MenuItem value="CASUALLEAVE">Casual Leave</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="main-circle-content">
                    <div className="two-progress-circle">
                        <div className="main-progress-bar">
                            <svg className="progress-bar" width="300" height="300">
                                <circle className="progress-circle-bg" cx="150" cy="150" r="135"></circle>
                                <circle className="progress-circle" cx="150" cy="150" r="135"></circle>
                            </svg>
                            <div className="image-circle">
                                <img src={bluecircle} alt="" />
                            </div>
                            <p>Approved Leave</p>
                        </div>
                        <div className="main-progress-bar">
                            <svg className="progress-bar-yellow" width="300" height="300">
                                <circle className="progress-circle-bg" cx="150" cy="150" r="135"></circle>
                                <circle className="progress-circle-yellow" cx="150" cy="150" r="135"></circle>
                            </svg>
                            <div className="image-circle">
                                <img src={yellowcircle} alt="" />
                            </div>
                            <p>Pending Leave</p>
                        </div>
                    </div>
                    <div className="main-circle-status-bar">
                        <div className="circle-status-box">
                            <img src={circlestatusbar} alt="" />
                            <div className="text-status-circle">
                                <h3>{approvedCount}</h3>
                                <p>Approved</p>
                            </div>
                        </div>
                        <div className="circle-status-box">
                            <img src={pendingicon} alt="" />
                            <div className="text-status-circle">
                                <h3>{filteredLeaves.length}</h3>
                                <p>Pending</p>
                            </div>
                        </div>
                        
                        {/* <div className="circle-status-box">
                            <img src={RequestIcon} alt="" />
                            <div className="text-status-circle">
                                <h3>{requestedCount}</h3>
                                <p>Request</p>
                            </div>
                        </div> */}
                        <div className="circle-status-box">
                            <img src={rejectedicon} alt="" />
                            <div className="text-status-circle">
                                <h3>{rejectedCount}</h3>
                                <p>Rejected</p>
                            </div>
                        </div>
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLeaves.length > 0 ? (
                                    currentLeaves.map((leave, i) => (
                                        <tr key={leave.leaveId} className="tr-table-leave">
                                            <td>{i + 1 + indexOfFirstLeave}</td>
                                            <td>{leave.employee.employeeName}</td>
                                            <td>{leave.department.departmentName}</td>
                                            <td>{leave.employee.position}</td>
                                            <td>{leave.leaveType}</td>
                                            <td>{leave.reason}</td>
                                            <td>{leave.leaveFrom.split('T')[0]}</td>
                                            <td>{leave.leaveTo.split('T')[0]}</td>
                                            <td>{leave.noOfDays}</td>
                                            <td>{leave.leaveStatus}</td>
                                            <td style={{display:"flex", columnGap: "13px"}}>
                                                <Link to="#" onClick={() => handle_update_status(leave.leaveId, leave.employeeId, "APPROVE")}>
                                                    <img src={circlestatusbar} alt="" /> 
                                                </Link>
                                                <Link to="#" onClick={() => handle_update_status(leave.leaveId, leave.employeeId, "DECLINED")}>
                                                    <img src={rejectedicon} alt="" /> 
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11">No leaves to display</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="pagination-btn"
                            style={{borderRadius: "25px"}} 
                        >
                            Previous
                        </button>
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`pagination-btn ${number === currentPage ? 'active' : ''}`}
                            
                            >
                                {number}
                            </button>
                        ))}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === pageNumbers.length}
                            className="pagination-btn"
                            style={{borderRadius: "25px"}} 
                        >
                            Next
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ManageLeave;
