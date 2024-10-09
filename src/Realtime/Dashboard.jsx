import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Bar from "../sidebar/Bar";
import "../assets/css/dashboard.css";
import blueicon from "../assets/images/blue-icon.svg";
import currentlyworking from "../assets/images/currently-wroking.svg";
import onbreak from "../assets/images/on-break-icon.svg";
import app from "../assets/images/app-icon.svg";
import rightarrow from "../assets/images/right-arrow.svg";
import axios from "axios";
import { useState } from "react";
import AppUsageData from "../components/AppUsageData"; 
import WorkAnalysisBarGraph from "../components/WorkAnalysisBarGraph";
import { BaseApiURL, url } from "../contexts/ApiURL";
import { selectCurrentToken } from "../redux/auth/authSlice";
import { useSelector } from "react-redux";

const getLastWeekDates = () => {
    const current = new Date();
    const daysOfWeek = [];

    for (let i = 6; i >= 0; i--) {
        const day = new Date(current);
        day.setDate(current.getDate() - i)
        const formattedDate = day.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short'
        }); 
        daysOfWeek.push(formattedDate);
    }

    return daysOfWeek;
};

function Dashboard() {
    const token = useSelector(selectCurrentToken)
    
    const [screenshots, setScreenshots] = useState([]);
    const [timeSheet, setTimeSheet] = useState([]);
    const [currentlyWorkingCount, setCurrentlyWorkingCount] = useState(0);
    const [onBreakCount, setOnBreakCount] = useState(0);
    const [countData, setCountData] = useState();
    const [appUsageData, setAppUsageData] = useState([]);
    const [workAnalysisData, setWorkAnalysisData] = useState([]);

    // Constants for API endpoints
    const GET_COUNT_API = `${BaseApiURL}/dashboard/`
    const GET_ALL_SCREENSHOT_API = `${BaseApiURL}/screenshot/get-screenshot-of-day`;
    const GET_ATTENDANCE_SHEET_API = `${BaseApiURL}/attendance/now`;

    const handle_get_all_screenshot = async () => {
        try {
            const response = await axios.get(GET_ALL_SCREENSHOT_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const allScreenshots = response.data.screenshots;
            setScreenshots(allScreenshots);
        } catch (error) {
            console.error("Error while fetching data", error);
        }
    };

    const countNunbers = async () => {
        try {
            const response = await axios.get(GET_COUNT_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const countData = response.data;
            setCountData(countData);
            console.log(countData)
            
        } catch (error) {
            console.error("Error while fetching data");
        }
    }

    const handle_get_now_timesheet = async () => {
        try {
            const response = await axios.get(GET_ATTENDANCE_SHEET_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const timeSheetData = response.data.message;
            setTimeSheet(timeSheetData);

            let currentlyWorking = 0;
            let currentlyOnBreak = 0;
            const attendedEmployeeIds = new Set();

            timeSheetData.forEach(item => {
                if (item.employeeLoginTime && !item.employeeLogoutTime) {
                    if (item.breakIn && !item.breakOut) {
                        currentlyOnBreak += 1;
                    } else {
                        currentlyWorking += 1;
                    }
                    attendedEmployeeIds.add(item.employee.id);
                }
            });

            setCurrentlyWorkingCount(currentlyWorking);
            setOnBreakCount(currentlyOnBreak);

            // Count employees who do not have any attendance
                
        } catch (error) {
            console.error("Error fetching timesheet data:", error);
        }
    };

    useEffect(() => {
        countNunbers();
        handle_get_all_screenshot();
        handle_get_now_timesheet();
    }, []);

    return (
        <div>
            <Bar />
            <div className="right-content">
            <div className="blue-banner-total">
                    {/* Directly access properties of countData */}
                    {countData && (
                        <>
                            <div className="blue-box-content">
                                <div className="total-number">
                                    <h3>Total Employee</h3>
                                    <p>{countData.noOfEmployees}</p>
                                </div>
                                <img src={blueicon} alt="" />
                            </div>
                            <div className="blue-box-content">
                                <div className="total-number">
                                    <h3>Total Team</h3>
                                    <p>{countData.noOfTeams}</p>
                                </div>
                                <img src={blueicon} alt="" />
                            </div>
                            <div className="blue-box-content">
                                <div className="total-number">
                                    <h3>Currently Working</h3>
                                    <p>{currentlyWorkingCount}</p>
                                </div>
                                <img src={currentlyworking} alt="" />
                            </div>
                            <div className="blue-box-content">
                                <div className="total-number">
                                    <h3>On Break</h3>
                                    <p>{onBreakCount}</p>
                                </div>
                                <img src={onbreak} alt="" />
                            </div>
                            <div className="blue-box-content">
                                <div className="total-number">
                                    <h3>App Not Used</h3>
                                    <p>{countData.appNotUsed}</p>
                                </div>
                                <img src={app} alt="" />
                            </div>
                        </>
                    )}
                </div>

                {/* <!---------CHART FOR RIGHT SIDE ENDS FROM HERE-----------/> */}
                <div className="main-grid-charts">
                    <div className="left-main-single-chart">
                        <div className="text-content">
                            <h3>Activity track</h3>
                            <h2>Most Used App</h2>
                        </div>
                        <div className="chart-container">
                            <AppUsageData data={appUsageData} />
                        </div>
                    </div>
                    {/* <!---------RIGHT SIDE RECENT PROOF OF WORK------------> */}
                    <div className="recent-work">
                        <h2>Recent Proof of work</h2>
                        <div className="main-recent-flex">
                            {screenshots?.length > 0 && screenshots?.slice(0, 10).map((screenshot, i) => (
                                <div className="flex-content" key={i}>
                                    <img src={`${url}/${screenshot.imageLink}`} alt="" />
                                    <p>{screenshot.employee.employeeName}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="left-main-single-chart">
                        <div className="text-content">
                            <h3>Work Analysis</h3>
                            <div className="work-content">
                                <p className="index orange">Less Utilized</p>
                                <p className="index green">Healthy</p>
                                <p className="index blue">Over Utilized</p>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div className="chart-container">
                            <WorkAnalysisBarGraph data={workAnalysisData} />
                        </div>
                    </div>
                    {/* <!---------RIGHT SIDE RECENT PROOF OF WORK------------> */}
                    <div className="recent-work">
                        <div className="top-heading">
                            <h2>Recent Proof of work</h2>
                            <Link to="/Timesheet">View All <img src={rightarrow} alt="" /></Link>
                        </div>
                        <div className="table-recent-work">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} >Name</th>
                                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} >Department</th>
                                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} >Clock in</th>
                                        <th style={{background: "rgba(0, 63, 182, 0.1019607843)"}} >Clock out</th>
                                    </tr>
                                </thead>
                                <tbody style={{background: "white"}}>
                                    {timeSheet?.length > 0 && timeSheet?.slice(0, 4).map((eachTimesheet, i) => (
                                        <tr key={i}>
                                            <td>{eachTimesheet.employee.employeeName}</td>
                                            <td>{eachTimesheet.department.departmentName}</td>
                                            <td>{eachTimesheet.employeeLoginTime}</td>
                                            <td>{eachTimesheet.employeeLogoutTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
