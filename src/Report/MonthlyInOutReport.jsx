import React, { useState, useEffect } from "react";
import Bar from "../sidebar/Bar";
import axios from "axios";
import { BaseApiURL } from "../contexts/ApiURL";
import { extractTime } from "../lib/extractTime";
import { selectCurrentToken } from "../redux/auth/authSlice";
import { useSelector } from "react-redux";

const MonthlyInOutReport = () => {
    const token = useSelector(selectCurrentToken)
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formattedMonthDate, setFormattedMonthDate] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const monthIndex = new Date(Date.parse(`${month}, ${year}`)).getMonth();
            const formattedMonth = (monthIndex + 1).toString().padStart(2, '0');
            setFormattedMonthDate(formattedMonth);
            
            // Update days in the month
            const days = new Date(year, monthIndex + 1, 0).getDate();
            setDaysInMonth([...Array(days).keys()].map(i => i + 1));
            
            try {
                const result = await axios.post(`${BaseApiURL}/attendance/monthly-report`,
                    { date: `${year}-${formattedMonth}` },
                    { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } }
                );
                setAttendanceData(result.data);
            } catch (error) {
                console.error("Error fetching attendance data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [year, month, token]);

    const groupedRecords = attendanceData.reduce((acc, record) => {
        const { employeeName } = record.employee;
        if (!acc[employeeName]) {
            acc[employeeName] = [];
        }
        acc[employeeName].push(record);
        return acc;
    }, {});

    const renderTableRows = () => {
        return Object.entries(groupedRecords).map(([employeeName, records]) => (
            <tr key={employeeName}>
                <td className="sticky-column">{employeeName}</td>
                <td className="sticky-column">{records.length}</td>
                <td className="scrollable-content">
                    <table>
                    <tbody>
                        <tr>
                            {daysInMonth.map((day) => {
                                const dayStr = `${String(day).padStart(2, '0')}`;
                                const record = records.find(att => att.actualDate === `${year}-${formattedMonthDate}-${dayStr}`);
                                return (
                                    <React.Fragment key={day}>
                                        <td>{record ? extractTime(record.employeeLoginTime) : "-"}</td>
                                        <td>{record && record.employeeLogoutTime ? extractTime(record.employeeLogoutTime) : "-"}</td>
                                    </React.Fragment>
                                );
                            })}
                        </tr>
                    </tbody>
                    </table>
                </td>
            </tr>
        ));
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    return (
        <div>
            <Bar />
            <div className="right-content">
                <div className="right-main-upper-content">
                    <div className="holidays">
                        <h6 style={{
                            fontSize: "2rem",
                            color: "rgba(0,0,0,0.7)"
                        }}>Monthly In-Out Report</h6>
                        <p className="page">Manage all the monthly in-out reports in your organization</p>
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
                <div className="table-wrapper">
                    <table className="fixed-table">
                        <thead className="sticky-column-header">
                            <tr>
                                <th className="sticky-column">Employee Name</th>
                                <th className="sticky-column">Total Worked Days</th>
                                <th className="scrollable-content">
                                    <div className="scrollable-content">
                                        <table>
                                            <thead >
                                                <tr >
                                                    {daysInMonth.map(day => (
                                                        <th key={day} colSpan="2">{String(day).padStart(2, '0')}</th>
                                                    ))}
                                                </tr>
                                                <tr>
                                                    {daysInMonth.map(day => (
                                                        <React.Fragment key={day}>
                                                            <th style={{fontWeight:"500"}} >In</th>
                                                            <th style={{fontWeight:"500"}}>Out</th>
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
                                    <td colSpan={daysInMonth.length * 2 + 2}>Loading...</td>
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
};

export default MonthlyInOutReport;
