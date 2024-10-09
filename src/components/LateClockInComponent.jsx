import React, { useState, useEffect } from "react";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from "axios";
import { BaseApiURL } from "../contexts/ApiURL";
import savereport from "../assets/images/save-report-icon.svg";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";


export function LateClockInComponent() {
    const token = useSelector(selectCurrentToken)
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [todayAttendanceData, setTodayAttendanceData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);

    const department_api = `${BaseApiURL}/department/get-all-department`;
    const team_api = `${BaseApiURL}/team/get-all-team-of-department`;
    const employee_api = `${BaseApiURL}/company/all-employees-team`;
    const employee_all_attendance_api = `${BaseApiURL}/attendance/get-employee-all-attendance`;
    const get_all_attendance_api = `${BaseApiURL}/attendance/now`;

    // Fetch today’s attendance data
    useEffect(() => {
        const fetchTodayAllAttendance = async () => {
            try {
                const response = await axios.get(get_all_attendance_api, {
                    headers: { 
                        'Authorization': `Bearer ${token}`, 
                        'Accept': 'application/json' 
                    }
                });
                setTodayAttendanceData(response.data.attendance);
            } catch (error) {
                console.error('Error fetching today all attendance:', error);
            }
        }

        fetchTodayAllAttendance();
    }, [get_all_attendance_api, token]);

    // Fetch departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(department_api, {
                    headers: { 
                        'Authorization': `Bearer ${token}`, 
                        'Accept': 'application/json' 
                    }
                });
                setDepartments(response.data.departments);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching departments:', error);
                setLoading(false);
            }
        };

        fetchDepartments();
    }, [department_api, token]);

    // Fetch teams when department is selected
    useEffect(() => {
        if (selectedDepartment) {
            const fetchTeams = async () => {
                try {
                    const response = await axios.get(`${team_api}/${selectedDepartment}`, {
                        headers: { 
                            'Authorization': `Bearer ${token}`, 
                            'Accept': 'application/json' 
                        }
                    });
                    setTeams(response.data.teams);
                } catch (error) {
                    console.error('Error fetching teams:', error);
                }
            };

            fetchTeams();
        } else {
            setTeams([]);
        }
    }, [selectedDepartment, team_api, token]);

    // Fetch employees when team is selected
    useEffect(() => {
        if (selectedTeam) {
            const fetchEmployees = async () => {
                try {
                    const response = await axios.get(`${employee_api}/${selectedTeam}`, {
                        headers: { 
                            'Authorization': `Bearer ${token}`, 
                            'Content-Type': 'application/json' 
                        }
                    });
                    setEmployees(response.data.employees);
                } catch (error) {
                    console.error('Error fetching employees:', error);
                }
            };

            fetchEmployees();
        } else {
            setEmployees([]);
        }
    }, [selectedTeam, employee_api, token]);

    // Fetch attendance data when employee is selected
    useEffect(() => {
        if (selectedEmployee) {
            const fetchAttendance = async () => {
                try {
                    const response = await axios.get(`${employee_all_attendance_api}/${selectedEmployee}`, {
                        headers: { 
                            'Authorization': `Bearer ${token}`, 
                            'Content-Type': 'application/json' 
                        }
                    });
                    const attendanceRecords = Array.isArray(response.data.attendacneRecord)
                        ? response.data.attendacneRecord
                        : [response.data.attendacneRecord];
                    setAttendanceData(attendanceRecords);
                } catch (error) {
                    console.error('Error fetching attendance:', error);
                    setAttendanceData([]); 
                }
            };
            fetchAttendance();
        } else {
            setAttendanceData([]);
        }
    }, [selectedEmployee, employee_all_attendance_api, token, currentMonth, currentYear]);

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
        setSelectedTeam('');
        setSelectedEmployee('');
    };

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
        setSelectedEmployee('');
    };

    const handleEmployeeChange = (event) => {
        setSelectedEmployee(event.target.value);
    };

    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const displayData = () => {
        if (selectedEmployee) {
            return attendanceData;
        } else if (selectedTeam) {
            return todayAttendanceData; 
        } else if (selectedDepartment) {
            return todayAttendanceData; 
        } else {
            return todayAttendanceData;
        }
    };

    const attendanceToDisplay = displayData();

    const downloadPDF = () => {
        const input = document.getElementById('styled-table');
        if (!input) {
            console.error('Element with id "styled-table" not found.');
            return;
        }
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        
        // Add employee name to the PDF
        const employeeName = employees.find(emp => emp.employeeId === selectedEmployee)?.employeeName || 'Employee';

        // Extract table headers and data
        const headers = Array.from(input.querySelectorAll('thead th')).map(th => th.textContent);
        const data = Array.from(input.querySelectorAll('tbody tr')).map(row => {
            return Array.from(row.querySelectorAll('td')).map(td => td.textContent);
        });

        // Create a new PDF document
        const pdf = new jsPDF('p', 'mm', 'a4');
    
        // Add title and employee name
        pdf.setFontSize(12);
        pdf.text(`Date: ${formattedDate}`, 160, 20);
    
        pdf.setFontSize(16);
        pdf.text(`Late Clock-In Report of ${employeeName}`, 15, 30);

        // Add table to PDF
        pdf.autoTable({
            head: [headers],
            body: data,
            startY: 40,
            margin: { top: 40 },
            styles: { overflow: 'linebreak' },
            pageBreak: 'auto'
        });
    
        // Save the PDF
        pdf.save(`${employeeName}_lateClockIn_report.pdf`);
    };
    
    

    return (
        <div> 
            <div style={{ columnGap: '20px', display: 'flex', padding: '20px', justifyContent: 'right' }}>

                <FormControl sx={{ minWidth: 120 }} style={{ background: "white"}}>
                    <Select
                        labelId="yearSelect"
                        onChange={event => setCurrentYear(parseInt(event.target.value, 10))}
                        value={currentYear}
                        displayEmpty
                    >
                        <MenuItem value="">Select Year</MenuItem>
                        {[...Array(1).keys()].map(i => (
                            <MenuItem key={i} value={currentYear}>{currentYear}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }} style={{ background: "white"}}>
                    <Select
                        labelId="monthSelect"
                        onChange={event => setCurrentMonth(parseInt(event.target.value, 10))}
                        value={currentMonth}
                        displayEmpty
                    >
                        <MenuItem value="">Select Month</MenuItem>
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                            <MenuItem key={index} value={index}>{month}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }} style={{ background: "white"}}>
                    <Select
                        labelId="departmentSelect"
                        onChange={handleDepartmentChange}
                        value={selectedDepartment}
                        displayEmpty
                    >
                        <MenuItem value="">Select Department</MenuItem>
                        {departments.length > 0 ? (
                            departments.map(department => (
                                <MenuItem key={department.departmentId} value={department.departmentId}>
                                    {department.departmentName}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem value="">No Departments</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }} style={{ background: "white"}}>
                    <Select
                        labelId="teamSelect"
                        onChange={handleTeamChange}
                        value={selectedTeam}
                        displayEmpty
                    >
                        <MenuItem value="">Select Team</MenuItem>
                        {teams.length > 0 ? (
                            teams.map(team => (
                                <MenuItem key={team.teamId} value={team.teamId}>
                                    {team.teamName}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem value="">No Teams</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }} style={{ background: "white"}}>
                    <Select
                        labelId="employeeSelect"
                        onChange={handleEmployeeChange}
                        value={selectedEmployee}
                        displayEmpty
                    >
                        <MenuItem value="">Select Employee</MenuItem>
                        {employees.length > 0 ? (
                            employees.map(employee => (
                                <MenuItem key={employee.employeeId} value={employee.employeeId}>
                                    {employee.employeeName}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem value="">No Employees</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <button onClick={downloadPDF} className="download-btn">
                    <img src={savereport} alt="" />
                    Save Report
                </button>

            </div>

            <section className="table-manage-leave-section">
                <table id="styled-table">
                    <thead className="manage-leave-heading-table" >
                        <tr >
                            <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}}>ID</th>
                            <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}}>Date</th>
                            <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}}>Clock-In</th>
                            <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}}>Clock-Out</th>
                            <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}}>Late Clock-In Time</th>
                        </tr>
                    </thead>
                    <tbody style={{background: "white"}}>
                        {Array.isArray(attendanceToDisplay) && attendanceToDisplay.length > 0 ? (
                            attendanceToDisplay.map((attendance, index) => (
                                <tr key={index} className="tr-table-leave">
                                    <td>{attendance.employeeId}</td>
                                    <td>{attendance.actualDate}</td>
                                    <td>{formatTime(attendance.employeeLoginTime)}</td>
                                    <td>{formatTime(attendance.employeeLogoutTime)}</td>
                                    <td>{attendance.lateClockIn}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{textAlign: "center"}}>No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
