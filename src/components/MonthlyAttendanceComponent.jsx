import React, { useState, useEffect } from "react";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { BaseApiURL } from "../contexts/ApiURL";
import axios from "axios";
import savereport from "../assets/images/save-report-icon.svg";
import PIcon from '../assets/images/P.svg';
import LIcon from '../assets/images/l.svg';
import AIcon from '../assets/images/a.svg';
import DIcon from '../assets/images/d.svg';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";

export function MonthlyAttendanceComponent() {
    const token = useSelector(selectCurrentToken)
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [employee, setEmployee] = useState(''); 
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
    const [loading, setLoading] = useState(true);
    const [presentDays, setPresentDays] = useState(0);
    const [delayCount, setDelayCount] = useState(0);
    const [leave, setLeave] = useState([]);
    const [leaveCount, setLeaveCount] = useState(0)
    const [absentDays, setAbsentDays] = useState(0);

    const department_api = `${BaseApiURL}/department/get-all-department`;
    const team_api = `${BaseApiURL}/team/get-all-team-of-department`;
    const employee_api = `${BaseApiURL}/company/all-employees-team`;
    const employee_all_attendance_api = `${BaseApiURL}/attendance/get-employee-all-attendance`;
    const emloyee_leave_api = `${BaseApiURL}/leave/view-all-leave-of-specific-employees`;
    const employee_details_api = `${BaseApiURL}/company/employee-profile`;

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
                    console.error('Error fetching employees:', error.response ? error.response.data : error.message);
                }
            };

            fetchEmployees();
        } else {
            setEmployees([]);
        }
    }, [selectedTeam, employee_api, token]);

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
    
                    const presentDays = attendanceRecords.filter(record => record.employeeLoginTime).length;
                    setPresentDays(presentDays);
    
                    const totalDelayCount = attendanceRecords.filter(record => record.lateClockIn).length;
                    setDelayCount(totalDelayCount);
    
                } catch (error) {
                    console.error('Error fetching attendance:', error);
                    setAttendanceData([]);
                    setPresentDays(0);
                    setDelayCount(0);
                }
            };
            fetchAttendance();
        } else {
            setAttendanceData([]);
            setPresentDays(0);
            setDelayCount(0);
        }
    }, [selectedEmployee, employee_all_attendance_api, token, currentMonth, currentYear]);         
    

    useEffect(() => {
        if (selectedEmployee) {
            const fetchleave = async () => {
                try {
                    const response = await axios.get(`${emloyee_leave_api}/${selectedEmployee}`, {
                        headers: { 
                            'Authorization': `Bearer ${token}`, 
                            'Accept': 'application/json' 
                        }
                    });
                    setLeave(response.data.allLeave);
                    setLeaveCount(leave.length);
                } catch (error) {
                    console.error('Error fetching leaves:', error);
                }
            }
            fetchleave();
        } else {
            setLeave([]);
            setLeaveCount(0);
        }
    }, [selectedEmployee, emloyee_leave_api, token])

    useEffect(() => {
        if (attendanceData.length > 0 && employee) {
            const today = new Date();
            const profileCreatedDate = new Date(employee.createdAt);
    
            let totalDaysFromCreated = 0;
            let totalAbsentDays = 0;
    
            for (
                let date = new Date(profileCreatedDate);
                date <= today;
                date.setDate(date.getDate() + 1)
            ) {
                if (date.getDay() !== 6) { 
                    totalDaysFromCreated++; 
                }
            }
    
            totalAbsentDays = totalDaysFromCreated - presentDays;

            console.log("Total Days from createdAt till now (excluding Saturdays):", totalDaysFromCreated);
            console.log("Total Absent Days:", totalAbsentDays);
            console.log("Total Present Days:", presentDays);
            setAbsentDays(totalAbsentDays);
        }
    }, [attendanceData, employee, presentDays]);

    console.log("Employee:", employee)

    

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
        setSelectedTeam('');
        setSelectedEmployee('');
    };

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
        setSelectedEmployee('');
    };

    const handleEmployeeChange = async (event) => {
        const selectedValue = event.target.value;
        const selectEmp = employees.find(emp => emp.employeeName === selectedValue);
        if (selectEmp) {
            setSelectedEmployee(selectEmp.employeeId);
        }
        console.log(selectEmp)
        
        try {
            const response = await axios.get(`${employee_details_api}/${selectEmp.employeeId}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Accept': 'application/json' 
                }
            });
            setEmployee(response.data.profile);
            setAttendanceData('');
            console.log("attendamce", attendanceData)
        } catch (error) {
            console.error('Error fetching employee details:', error.response ? error.response.data : error.message);
        }
    };

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const startDay = (month, year) => new Date(year, month, 1).getDay();
    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    
    const renderCalendar = () => {
        if (!employee) {
            return <td colSpan={7}>No employee selected</td>;
        }


    
        const days = [];
        const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
        const startDayOfWeek = startDay(currentMonth, currentYear);
    
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(<td key={`empty-${i}`}></td>);
        }
    
        const today = new Date();
        const profileCreatedDate = new Date(employee.createdAt.split('T')[0]);
    
        const validAttendanceData = Array.isArray(attendanceData) ? attendanceData : [];
    
        for (let day = 1; day <= daysInCurrentMonth; day++) {
            const formattedDay = day < 10 ? `0${day}` : day;
            const formattedMonth = (currentMonth + 1) < 10 ? `0${currentMonth + 1}` : currentMonth + 1;
            const dateString = `${currentYear}-${formattedMonth}-${formattedDay}`;
            const date = new Date(dateString);
    
            const isSaturday = date.getDay() === 6;
            const isInProfilePeriod = profileCreatedDate <= date && date <= today;
            const attendance = validAttendanceData.find(record => record.actualDate === dateString);
    
            const isAbsent = isInProfilePeriod && !attendance && !isSaturday;
            const showAbsent = isAbsent && date >= profileCreatedDate;
    
            days.push(
                <td key={day}>
                    {day}
                    <div className="time-details">
                        {attendance ? (
                            <div >
                                {attendance.employeeLoginTime && (
                                    <div className="clockIn">
                                        Login: {new Date(attendance.employeeLoginTime).toLocaleTimeString()}
                                    </div>
                                )}
                                {attendance.employeeLogoutTime && (
                                    <div className="clockOut">
                                        Logout: {new Date(attendance.employeeLogoutTime).toLocaleTimeString()}
                                    </div>
                                )}
                            </div>
                        ) : showAbsent ? (
                            <div className='absent'>Absent</div>
                        ) : null}
                    </div>
                </td>
            );
        }
    
        const totalCells = days.length + (7 - (days.length % 7)) % 7;
        for (let i = days.length; i < totalCells; i++) {
            days.push(<td key={`empty-end-${i}`}></td>);
        }
    
        const weeks = [];
        for (let i = 0; i < totalCells; i += 7) {
            weeks.push(<tr key={`week-${i / 7}`}>{days.slice(i, i + 7)}</tr>);
        }
    
        return weeks;
    };
    

    const renderMonthDaysWithAttendance = () => {
        if (!Array.isArray(attendanceData)) {
            console.error('attendanceData is not an array:', attendanceData);
            return [];
        }
    
        const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
        const today = new Date();
        const profileCreatedDate = employee ? new Date(employee.createdAt) : new Date(0)
    
        const attendance = [];
        
    
        for (let day = 1; day <= daysInCurrentMonth; day++) {
            const formattedDay = day < 10 ? `0${day}` : day;
            const formattedMonth = (currentMonth + 1) < 10 ? `0${currentMonth + 1}` : currentMonth + 1;
            const dateString = `${currentYear}-${formattedMonth}-${formattedDay}`;
            const date = new Date(dateString);
            const dayOfWeek = date.getDay(); 
    
            const isSaturday = dayOfWeek === 6;
            const isInProfilePeriod = profileCreatedDate <= date && date <= today; 
    
            const attendanceRecord = attendanceData.find(record => record.actualDate === dateString);
    
            const isAbsent = isInProfilePeriod && !attendanceRecord?.employeeLoginTime && !isSaturday;
    
            attendance.push({
                date: dateString,
                loginTime: attendanceRecord ? formatTime(attendanceRecord.employeeLoginTime) : '',
                logoutTime: attendanceRecord ? formatTime(attendanceRecord.employeeLogoutTime) : '',
                lateClockIn: attendanceRecord ? attendanceRecord.lateClockIn : '',
                earlyClockOut: attendanceRecord ? attendanceRecord.earlyClockOut : '',
                overTime: attendanceRecord ? attendanceRecord.overTime : '',
                isAbsent: isAbsent,
                isSaturday: isSaturday
            });
        }
    
        return attendance.map(entry => {
            if (entry.isAbsent) {
                return {
                    ...entry,
                    loginTime: 'Absent',
                    logoutTime: 'Absent',
                    lateClockIn: 'Absent',
                    earlyClockOut: 'Absent',
                    overTime: 'Absent'
                };
            }
    
            if (entry.isSaturday) {
                return {
                    ...entry,
                    loginTime: 'Saturday',
                    logoutTime: 'Saturday',
                    lateClockIn: 'Saturday',
                    earlyClockOut: 'Saturday',
                    overTime: 'Saturday'
                };
            }
    
            return entry;
        });
    };
    
    const downloadPDF = () => {
        const input = document.getElementById('styled-table');
        if (!input) {
            console.error('Element with id "styled-table" not found.');
            return;
        }
        
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        
        const employeeName = employees.find(emp => emp.employeeId === selectedEmployee)?.employeeName || 'Employee';
    
        try {
            const headers = Array.from(input.querySelectorAll('thead th')).map(th => th.textContent);
    
            const data = Array.from(input.querySelectorAll('tbody tr')).map(row => {
                return Array.from(row.querySelectorAll('td')).map(td => td.textContent);
            });
    
            const pdf = new jsPDF('p', 'mm', 'a4');
    
            pdf.setFontSize(12);
            pdf.text(`Date: ${formattedDate}`, 160, 20); 
            pdf.setFontSize(16);
            pdf.text(`Monthly Attendance Report of ${employeeName}`, 15, 30);
            
            pdf.autoTable({
                head: [headers],
                body: data,
                startY: 40,
                margin: { top: 40 },
                styles: { overflow: 'linebreak' },
                pageBreak: 'auto'
            });
    
            pdf.save(`${employeeName}_attendance_report.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };
    
    return (
        <div>
            <div className="profile-container">
                {selectedEmployee && employees.length > 0 ? (
                    employees.filter(employee => employee.employeeId === selectedEmployee).map(employee => (
                        <div key={employee.employeeId} className="profile-info">
                            <div className="flex-img">
                                <h2>{employee.employeeName}</h2>
                                <h3>{employee.position}</h3>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>Select an employee to see their details</div>
                )}
            
            <div className="main-attendance">
                <div className="attendance-info-container-green">
                    <div className="icon">
                        <img src={PIcon} alt="" />
                    </div>

                    <div className="info">
                        <h3>{presentDays}</h3>
                        <p>Total Present</p>
                    </div>
                </div>

                <div className="attendance-info-container-green">
                    <div className="icon">
                        <img src={LIcon} alt="" />
                    </div>

                    <div className="info">
                        <h3>{leaveCount}</h3>
                        <p>Total Leave</p>
                    </div>
                </div>

                <div className="attendance-info-container-green">
                    <div className="icon">
                        <img src={AIcon} alt="" />
                    </div>
                    <div className="info">
                        <h3>{absentDays}</h3>
                        <p>Total Absent</p>
                    </div>
                </div>

                <div className="attendance-info-container-green">
                    <div className="icon">
                        <img src={DIcon} alt="" />
                    </div>
                    <div className="info">
                        <h3>{delayCount}</h3>
                        <p>Total Delay</p>
                    </div>
                </div>

            </div>
        </div>
        <div style={{ columnGap: '20px', display: 'flex', padding: '20px', justifyContent: 'right' }}>
            <FormControl sx={{ minWidth: 120 }}  style={{ background: "white"}}>
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

            <FormControl sx={{ minWidth: 120 }}  style={{ background: "white"}}>
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

            <FormControl sx={{ minWidth: 120 }} style={{ background: "white"}} >
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
            <FormControl sx={{ minWidth: 120 }}  style={{ background: "white"}} >
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

            <div className="filter-content">
                <input list="employees"
                    placeholder="Select Employee"
                    onChange={handleEmployeeChange}
                    className="employee-input" 
                />
                <datalist className="data-list" id="employees">
                    {employees.length > 0 ? (
                        employees.map(employee => (
                            <option key={employee.employeeId} value={employee.employeeName} />
                        ))
                    ) : (
                        <option value="">No Employees</option>
                    )}
                </datalist>
            </div>

            <button onClick={downloadPDF} className="download-btn">
                <img src={savereport} alt="" />
                Save Report
            </button>
        </div>
            
        <div className="dates">
            <table className="calendar">
                <thead>
                    <tr>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} className="header">Sun</th>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} className="header">Mon</th>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} className="header">Tue</th>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} className="header">Wed</th>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} className="header">Thu</th>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} className="header">Fri</th>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} className="header">Sat</th>
                    </tr>
                </thead>
                <tbody>
                    {renderCalendar()}
                </tbody>
            </table>
        </div>

        <section style={{display:`none`}} className="table-manage-leave-section">
            <table id="styled-table">
                <thead className="manage-leave-heading-table" >
                    <tr>
                        <th>Date</th>
                        <th>Clock-In</th>
                        <th>Clock-Out</th>
                        <th>Late Clock-In Time</th>
                        <th>Early Clock-Out</th>
                        <th>Over Time</th>
                    </tr>
                </thead>
                <tbody>
                    {renderMonthDaysWithAttendance().length > 0 ? (
                        renderMonthDaysWithAttendance().map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.date}</td>
                                <td>{entry.loginTime}</td>
                                <td>{entry.logoutTime}</td>
                                <td>{entry.lateClockIn || 'N/A'}</td>
                                <td>{entry.earlyClockOut || 'N/A'}</td>
                                <td>{entry.overTime || 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    </div>
    );
}

