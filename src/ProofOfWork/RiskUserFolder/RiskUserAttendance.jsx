import React from 'react';
import './riskUserDetail.css';

const RiskUserAttendance = ({ attendance, formatTime }) => {
    // Debugging: Log the attendance data
    console.log('Attendance Data:', attendance);

    return (
        <div>
            <section className="attendance-table">
                <div className="list-of-employes">
                    <table id="style-attendance">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Clock-In</th>
                                <th>Clock-Out</th>
                                <th>Late Clock-In Time</th>
                                <th>Early Clock Out</th>
                                <th>Over Time</th>
                                <th>Break In</th>
                                <th>Break Out</th>
                                <th>Total Break Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance && attendance.length > 0 ? (
                                attendance.map((eachTimeSheet, i) => (
                                    eachTimeSheet ? (
                                        <tr key={i}>
                                            <td>{eachTimeSheet.actualDate || '-'}</td>
                                            <td>{formatTime(eachTimeSheet.employeeLoginTime) || '-'}</td>
                                            <td>{formatTime(eachTimeSheet.employeeLogoutTime) || '-'}</td>
                                            <td>{eachTimeSheet.lateClockIn || '-'}</td>
                                            <td>{eachTimeSheet.earlyClockOut || '-'}</td>
                                            <td>{eachTimeSheet.overTime || '-'}</td>
                                            <td>{eachTimeSheet.breakIn || '-'}</td>
                                            <td>{eachTimeSheet.breakOut || '-'}</td>
                                            <td>{eachTimeSheet.breakInMinutes || '-'}</td>
                                        </tr>
                                    ) : (
                                        <tr key={i}>
                                            <td colSpan="9">Invalid attendance record</td>
                                        </tr>
                                    )
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9">No attendance records available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default RiskUserAttendance;
