import React, { useState, useEffect } from "react";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { BaseApiURL } from "../contexts/ApiURL";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";

export function FilterEmployee() {
    const token = useSelector(selectCurrentToken)
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
    const [loading, setLoading] = useState(true);

    const department_api = `${BaseApiURL}/department/get-all-department`;
    const team_api = `${BaseApiURL}/team/get-all-team-of-department`;
    const employee_api = `${BaseApiURL}/company/all-employees-team`;
    const employee_all_attendance_api = `${BaseApiURL}/attendance/get-employee-all-attendance`;
    

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
        setAttendanceData('');
    };

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const startDay = (month, year) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const days = [];
        const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
        const startDayOfWeek = startDay(currentMonth, currentYear);
    
        // Add empty cells for the days before the start of the month
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(<td key={`empty-${i}`}></td>);
        }
    
        // Ensure attendanceData is an array
        const validAttendanceData = Array.isArray(attendanceData) ? attendanceData : [];
    
    
        // Add cells for each day of the month
        for (let day = 1; day <= daysInCurrentMonth; day++) {
            const formattedDay = day < 10 ? `0${day}` : day; // Add leading zero if needed
            const formattedMonth = (currentMonth + 1) < 10 ? `0${currentMonth + 1}` : currentMonth + 1;
            const dateString = `${currentYear}-${formattedMonth}-${formattedDay}`;
    
            // Debugging line to check dateString
            console.log('Date String:', dateString);
    
            const attendance = validAttendanceData.find(record => record.actualDate === dateString);
            console.log(`Attendance for ${dateString}:`, attendance);
    
            days.push(
                <td key={day}>
                    {day}
                    {attendance ? (
                        <div>
                            {attendance.overTime ? (
                                <div className="overTime">Overtime: {attendance.overTime}</div>
                            ) : (
                                <div className="overTime">Regular</div>
                            )}
                        </div>
                    ) : (
                        <div>

                        </div>
                    )}
                </td>
            );
        }
    
        // Add empty cells to fill out the last row to complete the week
        const totalCells = days.length + (7 - (days.length % 7)) % 7;
        for (let i = days.length; i < totalCells; i++) {
            days.push(<td key={`empty-end-${i}`}></td>);
        }
    
        // Group days into rows of weeks
        const weeks = [];
        for (let i = 0; i < totalCells; i += 7) {
            weeks.push(<tr key={`week-${i / 7}`}>{days.slice(i, i + 7)}</tr>);
        }
    
        return weeks;
    };
    
    
    return (
        <div> 
            <div style={{ columnGap: '20px', display: 'flex', padding:'20px', justifyContent: 'right' }}>
            <FormControl sx={{ minWidth: 120 }} style={{background: "white"}}>
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

                <FormControl sx={{ minWidth: 120 }} style={{background: "white"}}>
                    <Select
                    labelId="yearSelect"
                    onChange={event => setCurrentYear(parseInt(event.target.value, 10))}
                    value={currentYear}
                    displayEmpty
                    >
                    <MenuItem value="">Select Year</MenuItem>
                    {[...Array(1).keys()].map(i => (
                        <MenuItem key={i} value={currentYear }>{currentYear}</MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }} style={{background: "white"}}>
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

                <FormControl sx={{ minWidth: 120 }} style={{background: "white"}}>
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

                <FormControl sx={{ minWidth: 120 }} style={{background: "white"}}>
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
            </div>

            <div className="dates">
                <table className="calendar">
                    <thead>
                        <tr>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} className="header">Sun</th>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} className="header">Mon</th>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}}  className="header">Tue</th>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}}  className="header">Wed</th>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}}  className="header">Thu</th>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}}  className="header">Fri</th>
                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}}  className="header">Sat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderCalendar()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

