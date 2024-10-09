import React, { useEffect } from "react";
import Bar from "../sidebar/Bar";
import savereport from "../assets/images/save-report-icon.svg"
import { useState } from "react";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axios from "axios";
import { BaseApiURL } from "../contexts/ApiURL";
import TablePagination from '@mui/material/TablePagination';
import { selectCurrentToken } from "../redux/auth/authSlice";
import { useSelector } from "react-redux";

function DailyAttendance(){
    const token = useSelector(selectCurrentToken)
    const GET_ATTENDANCE_SHEET_API = `${BaseApiURL}/attendance/now`
    const [timeSheet, setTimeSheet] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(9);

    const handle_get_now_timesheet = async () =>{
        const get_now_timesheet_response = await axios.get(GET_ATTENDANCE_SHEET_API,{
            headers:{
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
       })
        setTimeSheet(get_now_timesheet_response.data.message)           
    }

    useEffect(()=>{
        handle_get_now_timesheet()
    },[])

    const downloadPDF = () => {
        const input = document.getElementById('styled-table');
        if (!input) {
            console.error('Element with id "styled-table" not found.');
            return;
        }

        // Get current date
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

        // Extract table headers and data
        const headers = Array.from(input.querySelectorAll('thead th')).map(th => th.textContent);
        const data = Array.from(input.querySelectorAll('tbody tr')).map(row => {
            return Array.from(row.querySelectorAll('td')).map(td => td.textContent);
        });

        // Create a new PDF document
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Add title and date
        pdf.setFontSize(12);
        pdf.text(`Date: ${formattedDate}`, 160, 20);
        pdf.setFontSize(16);
        pdf.text('Daily Attendance Report', 15, 30);

        // Add table data with autoTable plugin
        pdf.autoTable({
            head: [headers],
            body: data,
            startY: 40,
            margin: { top: 40 },
            styles: { overflow: 'linebreak' },
            pageBreak: 'auto'
        });

        // Save the PDF
        pdf.save('dailyAttendance_report.pdf');
    }

    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      }
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      }

    return(
        <div>
            <Bar/>
            <div className="right-content">
                <div className="flex-main-heading">
                    <div className="manage-desc">
                        <h2>Daily Attendance Report</h2>
                        <p>Mange all the daily attendance report in your organization</p>
                    </div>
                    <button onClick={downloadPDF} className="download-btn">
                        <img src={savereport} alt="Download icon" />
                        Save Report
                    </button>
                </div>

                <section className="table-manage-leave-section">
                    <div className="list-of-employes">
                        <table id="styled-table">
                            <thead className="manage-leave-heading-table">
                                <tr>
                                    <th>SN</th>
                                    <th>Employee Name</th>
                                    <th>Date</th>
                                    <th>Clock-In</th>
                                    <th>Clock-Out</th>
                                    <th>Late Clock-In Time</th>
                                    <th>Early Clock Out</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timeSheet?.length > 0 && timeSheet.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage ).map((eachTimeSheet,i)=>(

                                    <tr key={i} className="tr-table-leave">
                                    <td>{i + 1 + page * rowsPerPage}</td>
                                    <td>{eachTimeSheet.employee.employeeName}</td>
                                    <td>{eachTimeSheet.actualDate}</td>
                                    <td>{formatTime(eachTimeSheet.employeeLoginTime)}</td>
                                    <td>{formatTime(eachTimeSheet.employeeLogoutTime)}</td>
                                    <td>{eachTimeSheet.lateClockIn}</td>
                                    <td>{eachTimeSheet.earlyClockOut}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                <TablePagination
                    rowsPerPageOptions={[9]}
                    component="div"
                    count={timeSheet.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={{ position: 'sticky', bottom: 10, backgroundColor: '#fff', zIndex: 0, display: "flex" , justifyContent: 'center', alignItems: 'center' }}
                />
            </div>
        </div>
    )
}

export default DailyAttendance