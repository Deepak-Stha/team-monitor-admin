import React, { useState, useEffect } from "react";
import Bar from "../sidebar/Bar";
import axios from "axios";
import { BaseApiURL } from "../contexts/ApiURL";
import { selectCurrentToken } from "../redux/auth/authSlice";
import { useSelector } from "react-redux";

function MonthlyInOut() {
    const token = useSelector(selectCurrentToken)
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);
    const [selectedMonths,setSelectedMonths] = useState()
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(selectedMonths,year,"HLSHL")

    const ATTENDANCE_API = `${BaseApiURL}/attendance/all-employee-attendance`
    const EMPLOYEE_API = `${BaseApiURL}/company/all-employees`


    useEffect(() => {
        const monthIndex = new Date(Date.parse(`${month}, ${year}`)).getMonth();
        const formattedMonth = (monthIndex + 1).toString().padStart(2, '0');
        setSelectedMonths(formattedMonth);
        const days = new Date(year, monthIndex + 1, 0).getDate();
        setDaysInMonth([...Array(days).keys()].map(i => i + 1));
    }, [year, month]);

    const fetchData = async () => {
        try {
            const result = await axios.post(`${BaseApiURL}/attendance/monthly-report`, {
                "date": `${year}-${selectedMonths}`,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            setAttendanceData(result.data);
        } catch (error) {
            console.error('Error fetching data:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        if (selectedMonths) {
            fetchData();
        }
    }, [year, selectedMonths]);
    

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    handleGetEmployeesOfCompany(),
                    handleGetAttendanceRecord()
                ]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year, month]);

    const handleGetEmployeesOfCompany = async () => {
        try {
            const response = await axios.get(EMPLOYEE_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            setEmployeeData(response.data.employees);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGetAttendanceRecord = async () => {
        try {
            const response = await axios.get(ATTENDANCE_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            setAttendanceData(response.data.allAttendanceRecord);
        } catch (error) {
            console.error(error);
        }
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    // Combine employee data with their attendance records
    const employeeAttendanceMap = employeeData.reduce((acc, employee) => {
        acc[employee.employeeId] = {
            ...employee,
            attendance: []
        };
        return acc;
    }, {});

    attendanceData.forEach(record => {
        if (employeeAttendanceMap[record.employeeId]) {
            employeeAttendanceMap[record.employeeId].attendance.push(record);
        }
    });

    // Render table rows for employees
    const renderTableRows = () => {
        return Object.values(employeeAttendanceMap).map(employee => {
            const attendanceByDay = daysInMonth.map(day => {
                const dayStr = `${String(day).padStart(2, '0')}`;
                const record = employee.attendance.find(att => att.actualDate === `2024-08-${dayStr}`);
                return {
                    in: record ? new Date(record.employeeLoginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A',
                    out: record ? (record.employeeLogoutTime ? new Date(record.employeeLogoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A') : 'N/A'
                };
            });


            return (
                <tr key={employee.employeeId}>
                    <td className="sticky-column">{employee.employeeId}</td>
                    <td className="sticky-column">{employee.employeeName}</td>
                    <td className="sticky-column">{employee.attendance.length}</td>
                    <td className="scrollable-content">
                        <table>
                            <tbody>
                                {daysInMonth.map((day, index) => (
                                    <React.Fragment key={day}>
                                        <td>{attendanceByDay[index].in}</td>
                                        <td>{attendanceByDay[index].out}</td>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </td>
                </tr>
            );
        });
    };

    return (
        <div>
            <Bar />
            <div className="right-content">
                <div className="right-main-upper-content">
                    <div className="holidays">
                        <h6>Monthly In-Out Report</h6>
                        <p className="page" style={{fontSize:"1rem", color:"rgba(0,0,0,0.7)"}}>Manage all the monthly in-out reports in your organization</p>
                    </div>

                    <div className="down">
                        <div className="container-report-monthly">
                            <div className="select-container">
                                <img src="assets/images/calender-svg.svg" alt="" className="calender-svg" />
                                <i className="fas fa-calendar-alt"></i>
                                <select id="yearSelect" onChange={handleYearChange} value={year}>
                                    <option value="" disabled>Select Year</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                            </div>

                            <div className="select-container">
                                <img src="assets/images/calender-svg.svg" alt="" className="calender-svg" />
                                <i className="fas fa-calendar-alt"></i>
                                <select id="monthSelect" onChange={handleMonthChange} value={month}>
                                    <option value="" disabled>Select Month</option>
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-wrapper" style={{height: "74vh", overflowY: "scroll"}}>
                    <table className="fixed-table">
                        <thead className="sticky-column-header">
                            <tr>
                                <th className="sticky-column">Id</th>
                                <th className="sticky-column">Employee Name</th>
                                <th className="sticky-column">Total Worked Days</th>
                                <th className="sticky-column">
                                    <div className="scrollable-content">
                                        <table>
                                            <thead>
                                                <tr>
                                                    {daysInMonth.map(day => (
                                                        <th key={day} colSpan="2">{String(day).padStart(2, '0')}</th>
                                                    ))}
                                                </tr>
                                                <tr>
                                                    {daysInMonth.map(day => (
                                                        <React.Fragment key={day}>
                                                            <th>In</th>
                                                            <th>Out</th>
                                                        </React.Fragment>
                                                    ))}
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={daysInMonth.length * 2 + 2}
                                    >Loading...</td>
                                </tr>
                            ) : (
                                renderTableRows()
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MonthlyInOut;
