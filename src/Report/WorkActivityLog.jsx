import React from "react";
import Bar from "../sidebar/Bar";
import savereport from "../assets/images/save-report-icon.svg";
import arrowdown from "../assets/images/arrow-down.svg";
import { Link } from "react-router-dom";

function WorkActivityLog(){
    return(
        <div>
            <Bar/>
            <div className="right-content">
                <div className="flex-main-heading">
                    <div className="manage-desc">
                        <h2>Daily Attendance Report</h2>
                        <p>Mange all the daily attendance report in your organization</p>
                    </div>
                    <div className="right-screenshot-btn">
                        <input type="date" className="date"/>
                        <div className="dropdown-manage-leave">
                            <Link to="javascript:void(0)" className="dropbtn">Working Employee 
                                <img src={arrowdown} alt="" className="drop-down-manage"/></Link>
                            <div className="dropdown-content-manage-leave">
                                <Link to="#">All Leave</Link>
                                <Link to="#">Paid Leave</Link>
                                <Link to="#">Unpaid Leave</Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!----------MAIN TABLE SECTION STARTS FROM HERE-----------> */}
                <section className="table-manage-leave-section">
                    <table id="styled-table">
                        <thead className="manage-leave-heading-table">
                            <tr>
                                <th>ID</th>
                                <th>Employee Name</th>
                                <th>Date</th>
                                <th>Clock-In</th>
                                <th>Clock-Out</th>
                                <th>Duration</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="tr-table-leave">
                                <td>e-2012</td>
                                <td>Nirnaya Bhattarai</td>
                                <td>20/06/2024</td>
                                <td>09:00:12 am</td>
                                <td>06:10:52 pm</td>
                                <td>08:05:15 hr</td>
                                <td>
                                    <Link to="http://" className="download-btn">
                                        <img src={savereport} alt="" srcset=""/>
                                        Save Report
                                    </Link>
                                </td>
                            </tr>
                            <tr className="tr-table-leave">
                                <td>e-2012</td>
                                <td>Nirnaya Bhattarai</td>
                                <td>20/06/2024</td>
                                <td>09:00:12 am</td>
                                <td>06:10:52 pm</td>
                                <td>08:05:15 hr</td>
                                <td>
                                    <Link to="http://" className="download-btn">
                                        <img src={savereport} alt="" srcset=""/>
                                        Save Report
                                    </Link>
                                </td>
                            </tr>
                            <tr className="tr-table-leave">
                                <td>e-2012</td>
                                <td>Nirnaya Bhattarai</td>
                                <td>20/06/2024</td>
                                <td>09:00:12 am</td>
                                <td>06:10:52 pm</td>
                                <td>08:05:15 hr</td>
                                <td>
                                    <Link to="http://" className="download-btn">
                                        <img src={savereport} alt="" srcset=""/>
                                        Save Report
                                    </Link>
                                </td>
                            </tr>
                            <tr className="tr-table-leave">
                                <td>e-2012</td>
                                <td>Nirnaya Bhattarai</td>
                                <td>20/06/2024</td>
                                <td>09:00:12 am</td>
                                <td>06:10:52 pm</td>
                                <td>08:05:15 hr</td>
                                <td>
                                    <Link to="http://" className="download-btn">
                                        <img src={savereport} alt="" srcset=""/>
                                        Save Report
                                    </Link>
                                </td>
                            </tr>
                            <tr className="tr-table-leave">
                                <td>e-2012</td>
                                <td>Nirnaya Bhattarai</td>
                                <td>20/06/2024</td>
                                <td>09:00:12 am</td>
                                <td>06:10:52 pm</td>
                                <td>08:05:15 hr</td>
                                <td>
                                    <Link to="http://" className="download-btn">
                                        <img src={savereport} alt="" srcset=""/>
                                        Save Report
                                    </Link>
                                </td>
                            </tr>
                            <tr className="tr-table-leave">
                                <td>e-2012</td>
                                <td>Nirnaya Bhattarai</td>
                                <td>20/06/2024</td>
                                <td>09:00:12 am</td>
                                <td>06:10:52 pm</td>
                                <td>08:05:15 hr</td>
                                <td>
                                    <Link to="http://" className="download-btn">
                                        <img src={savereport} alt="" srcset=""/>
                                        Save Report
                                    </Link>
                                </td>
                            </tr>
                            <tr className="tr-table-leave">
                                <td>e-2012</td>
                                <td>Nirnaya Bhattarai</td>
                                <td>20/06/2024</td>
                                <td>09:00:12 am</td>
                                <td>06:10:52 pm</td>
                                <td>08:05:15 hr</td>
                                <td>
                                    <Link to="http://" className="download-btn">
                                        <img src={savereport} alt="" srcset=""/>
                                        Save Report
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    )
}

export default WorkActivityLog