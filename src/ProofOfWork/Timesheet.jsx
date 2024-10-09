import React, { useEffect, useState } from "react";
import Bar from "../sidebar/Bar";
import plus from "../assets/images/plus-icon.svg";
import axios from "axios";
import Swal from "sweetalert2";
import { BaseApiURL } from "../contexts/ApiURL";
import TablePagination from '@mui/material/TablePagination';
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";

function Timesheet() {
  const token = useSelector(selectCurrentToken)
  const [timeSheet, setTimeSheet] = useState([]);
  const [riskUsers, setRiskUsers] = useState(new Set()); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const ADD_TO_RISK_USER_API = `${BaseApiURL}/riskuser/add-to-riskUser`;
  const GET_ATTENDANCE_SHEET_API = `${BaseApiURL}/attendance/now`;
  const GET_RISK_USERS_API = `${BaseApiURL}/riskuser/list`; 

  const handle_get_attendance_sheet = async () => {
    try {
      const response = await axios.get(GET_ATTENDANCE_SHEET_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const allAttendance = response.data.message;
      setTimeSheet(allAttendance);
    } catch (error) {
      console.error("Error while fetching data", error);
    }
  };

  const fetchRiskUsers = async () => {
    try {
      const response = await axios.get(GET_RISK_USERS_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const riskUserIds = new Set(response.data.map(user => user.employeeId));
      setRiskUsers(riskUserIds);
    } catch (error) {
      console.error("Error while fetching risk users:", error);
    }
  };

  const addToRiskUser = async (employeeId) => {
    // Show confirmation dialog
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add this user to the risk list?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel!',
    });
  
    if (isConfirmed) {
      try {
        const response = await axios.post(`${ADD_TO_RISK_USER_API}/${employeeId}`, {}, {
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
  
          // Refresh timesheet and risk users list
          handle_get_attendance_sheet();
          fetchRiskUsers();
        }
      } catch (error) {
        console.error("Error while adding to risk user:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'An error occurred'
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

  useEffect(() => {
    handle_get_attendance_sheet();
    fetchRiskUsers();
  }, []);

  return (
    <div>
      <Bar />
      <div className="right-content">
        <div className="screenshot-heading-starts">
          <div className="left-screenshot-heading">
            <h3 style={{fontSize: "2rem", color: "rgba(0, 0, 0, 0.7)"}}>Time Sheet</h3>
            <p style={{fontSize: "1rem"}}>Manage all the time sheets of work in your organization</p>
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
                  <th>Work Time Details</th>
                  <th>Total Work Summary</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {timeSheet.length > 0 ? (
                  timeSheet.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((eachTimesheet, i) => (
                    <tr key={i} className="tr-table-leave">
                      <td>{i + 1}</td>
                      <td>{eachTimesheet.employee?.employeeName || 'N/A'}</td>
                      <td>{eachTimesheet.department?.departmentName || 'N/A'}</td>
                      <td>
                        <div className="work-time-details">
                          <h4>{eachTimesheet.actualDate}</h4>
                          <div className="work-time-pink">
                            <div className="time-stautus-sheet">
                              <p><b>Login Time</b></p>
                              <p>{eachTimesheet.employeeLoginTime || 'N/A'}</p>
                            </div>
                            <div className="time-stautus-sheet">
                              <p><b>Logout Time</b></p>
                              <p>{eachTimesheet.employeeLogoutTime || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="work-summary">
                          <div className="work-time-yellow">
                            <div className="time-stautus-sheet">
                              <p><b>OverTime</b></p>
                              <p>{eachTimesheet.overTime || 'N/A'}</p>
                            </div>
                            <div className="time-stautus-sheet">
                              <p><b>Late ClockIn</b></p>
                              <p>{eachTimesheet.lateClockIn || 'N/A'}</p>
                            </div>
                            <div className="time-stautus-sheet">
                              <p><b>Early Clockout</b></p>
                              <p>{eachTimesheet.earlyClockOut || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {riskUsers.has(eachTimesheet.employeeId) ? (
                          <span>Already in Risk User</span>
                        ) : (
                          <a href="#" className="download-btn" onClick={(e) => { e.preventDefault(); addToRiskUser(eachTimesheet.employeeId); }}>
                            <img src={plus} alt="Add to Risk User" />
                            Add to Risk User
                          </a>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={timeSheet.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ position: 'sticky', bottom: 10, backgroundColor: '#fff', zIndex: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
        />
      </div>
    </div>
  );
}

export default Timesheet;
