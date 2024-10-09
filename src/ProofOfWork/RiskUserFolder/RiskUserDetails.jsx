import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import Bar from '../../sidebar/Bar';
import { BaseApiURL } from '../../contexts/ApiURL';
import axios from 'axios';
import UserDetails from './RiskUserInfo';
import Attendance from './RiskUserAttendance';
import Modal from './Modal'; 
import './riskUserDetail.css'
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../redux/auth/authSlice';

const RiskUserScreenshot = lazy(() => import('./RiskUserScreenshot'));
const RiskUserVideo = lazy(() => import('./RiskUserTimelapseVideo'));

const RiskUserDetails = () => {
    const { state } = useLocation();
    const { employeeId } = state || {};
    const token = useSelector(selectCurrentToken)

    const [userDetail, setUserDetail] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [screenshots, setScreenshots] = useState([]);
    const [selectedScreenshot, setSelectedScreenshot] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [timelapseVideo, setTimelapseVideo] = useState([]);
    const [leaveRecords, setLeaveRecords] = useState([]);
    const [absentDays, setAbsentDays] = useState(0);

    const getDetailApi = `${BaseApiURL}/riskuser/getRiskUserDetail`;
    const getTimelapseVideoApi = `${BaseApiURL}/timelapsevideo/get-timelapse`;
    const getScreenshotApi = `${BaseApiURL}/screenshot/get-screenshot`;
    const getAttendanceApi = `${BaseApiURL}/attendance/get-employee-all-attendance`;
    const getLeaveApi = `${BaseApiURL}/leave/view-all-leave-of-specific-employees`;

    useEffect(() => {
        if (employeeId) {
            getUserDetail();
            getVideo();
            getScreenshot();
            getAttendance();
            getLeave();
        }
    }, [employeeId]);

    const getUserDetail = async () => {
        try {
            const response = await axios.get(`${getDetailApi}/${employeeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const riskUsers = response.data.riskUser;
            setUserDetail(Array.isArray(riskUsers) && riskUsers.length > 0 ? riskUsers[0] : null);
        } catch (error) {
            console.error("Error fetching user details:", error);
            setUserDetail(null);
        }
    };

    const getAttendance = async () => {
        try {
            const response = await axios.get(`${getAttendanceApi}/${employeeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = response.data.attendacneRecord || []; 
            setAttendance(data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    const getScreenshot = async () => {
        try {
            const response = await axios.get(`${getScreenshotApi}/${employeeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            setScreenshots(response.data.screenshots || []); 
        } catch (error) {
            console.error("Error fetching screenshots:", error);
        }
    };

    const getVideo = async () => {
        try {
            const response = await axios.get(`${getTimelapseVideoApi}/${employeeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            setTimelapseVideo(response.data.timeLapseVideo || []);
        } catch (error) {
            console.error("Error fetching timelapse video:", error);
        }
    };

    const getLeave = async () => {
        try {
            const response = await axios.get(`${getLeaveApi}/${employeeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const leave = response.data.allLeave || [];
            setLeaveRecords(leave);
        } catch (error) {
            console.error("Error fetching leave records:", error);
        }
    }

    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const openModal = (imageSrc) => {
        setSelectedScreenshot(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedScreenshot("");
    };

    const calculateTotalWorkingDays = () => {
        return attendance.length;
    };

    const calculateLateDays = () => {
        return attendance.filter(att => att.lateClockIn).length;
    };

    const overtimeDayCount = () => {
        return attendance.filter(att => att.overTime).length;
    }

    console.log("overtime", overtimeDayCount())

    const calculateTotalOvertime = () => {
        let totalOvertimeSeconds = 0;

        attendance.forEach(att => {
            const overtimeString = att.overTime || "0 hrs, 0 mins, 0 sec overtime"; 
            const regex = /(\d+)\s+hrs|\s+(\d+)\s+mins|\s+(\d+)\s+sec/g;
            let match;

            while ((match = regex.exec(overtimeString)) !== null) {
                if (match[1]) totalOvertimeSeconds += parseInt(match[1]) * 3600;
                if (match[2]) totalOvertimeSeconds += parseInt(match[2]) * 60;
                if (match[3]) totalOvertimeSeconds += parseInt(match[3]);
            }
        });

        const totalHours = Math.floor(totalOvertimeSeconds / 3600);
        const totalMinutes = Math.floor((totalOvertimeSeconds % 3600) / 60);
        return { totalHours, totalMinutes };
    };

    const calculateTotalWorkedHours = () => {
        let totalWorkedSeconds = 0;

        attendance.forEach(att => {
            const loginTime = new Date(att.employeeLoginTime);
            const logoutTime = new Date(att.employeeLogoutTime);
            totalWorkedSeconds += (logoutTime - loginTime) / 1000; 
        });

        const totalHours = Math.floor(totalWorkedSeconds / 3600);
        const totalMinutes = Math.floor((totalWorkedSeconds % 3600) / 60);
        return { totalHours, totalMinutes };
    };

    const calculateTotalLeaveApplied = () => {
        return leaveRecords.length; 
    };

    const calculateTotalApprovedLeave = () => {
        return leaveRecords.filter(leave => leave.leaveStatus === "APPROVE").length; 
    };

    const calculateTotalAbsent = () => {
        const totalDays = attendance.length; 
        const presentDays = attendance.filter(att => att.employeeLoginTime).length; 
        return totalDays - presentDays; 
    };

    if (!userDetail) {
        return <p>Loading user details...</p>;
    }

    const { totalHours: overtimeHours, totalMinutes: overtimeMinutes } = calculateTotalOvertime();
    const { totalHours: workedHours, totalMinutes: workedMinutes } = calculateTotalWorkedHours();
    const totalLeaveApplied = calculateTotalLeaveApplied();
    const totalApprovedLeave = calculateTotalApprovedLeave();
    const totalAbsent = calculateTotalAbsent();
    const overTimeDays = overtimeDayCount();

    return (
        <div>
            <Bar />
            <div className="right-content">
                <div className="upper-right-side">
                    <h2>Risk User: {userDetail.employee.employeeName}</h2>
                </div>

                <UserDetails 
                    userDetail={userDetail} 
                    workedDays={calculateTotalWorkingDays()} 
                    lateDays={calculateLateDays()} 
                    overtimeDays={overTimeDays}
                    overTime={{ totalHours: overtimeHours, totalMinutes: overtimeMinutes }} 
                    workedHours={{ totalHours: workedHours, totalMinutes: workedMinutes }} 
                    leaveApplied={totalLeaveApplied} 
                    approvedLeave={totalApprovedLeave}
                    absentDays={totalAbsent} 
                />

                <Attendance attendance={attendance} formatTime={formatTime} />

                <Suspense fallback={<div>Loading screenshots...</div>}>
                    <RiskUserScreenshot screenshots={screenshots} openModal={openModal} />
                </Suspense>

                <Suspense fallback={<div>Loading screenshots...</div>}>
                    <RiskUserVideo videos={timelapseVideo} />
                </Suspense>

            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                imageSrc={selectedScreenshot} 
            />
        </div>
    );
};

export default RiskUserDetails;
