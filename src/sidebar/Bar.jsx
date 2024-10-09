import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../assets/css/bar.css";
import AddUser from "../components/AddUser";                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
import dashboard from "../assets/images/dashboard-link.svg";
import myteams from "../assets/images/myteams-link.svg";
import dropDownSidebar from "../assets/images/leave-management.svg";
import arrowdown from "../assets/images/arrow-down.svg";
import proofofwork from "../assets/images/proofofwork-link.svg";
import appusages from "../assets/images/app-usages-link.svg";
import configuration from "../assets/images/Configuration-link.svg";
import report from "../assets/images/report-link.svg";
import logout from "../assets/images/logout.svg.svg";
import addUser from "../assets/images/Vector.svg";
import manageleave from "../assets/images/Manage Leave.svg";
import manageholiday from "../assets/images/Manage Holiday.svg";
import leavesummary from "../assets/images/Leave Summary.svg";
import camera from "../assets/images/Camera.svg";
import video from "../assets/images/Video.svg";
import calendar from "../assets/images/Calendar.svg";
import danger from "../assets/images/Danger Triangle.svg";
import timecircle from "../assets/images/Time Circle.svg";
import reviewapp from "../assets/images/Review App.svg";
import apphistory from "../assets/images/App History.svg";
import settingicon from "../assets/images/Settings.svg";
import dailyatticon from "../assets/images/daily-attendance.svg";
import monthlyatticon from "../assets/images/Monthly Attendance.svg";
import monthyinouticon from "../assets/images/monthly-in-out.svg";
import lateclockinicon from "../assets/images/late-clock-in.svg";
import overtime from "../assets/images/over-time-report.svg";
import deleteUser from "../assets/images/delete-user.png";
// import logout from "../assets/images/logout.svg.svg"
import Swal from "sweetalert2";
import Notification from "../sidebar/notification";
// import profile from "../assets/images/profile-picture.png";
import { Icon } from "@iconify/react";
import "../assets/css/important.css";
import { useDispatch, useSelector } from "react-redux";
import { loggedOut, selectCurrentToken } from "../redux/auth/authSlice";

import "../assets/css/important.css";

function FaSolidUserAlt(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0S112 64.5 112 144s64.5 144 144 144m128 32h-55.1c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16H128C57.3 320 0 377.3 0 448v16c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-16c0-70.7-57.3-128-128-128"
      />
    </svg>
  );
}

const Bar = () => {
  const token = useSelector(selectCurrentToken)
  const dispatch = useDispatch()

  // const userRole = JSON.parse(atob(token.split('.')[1])).role; // Decode JWT to get user role
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState({
    dropDownSidebar: false,
    proofOfWork: false,
    appUsages: false,
    configuration: false,
    reports: false,
  });

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown((prevState) => ({
      ...prevState,
      [dropdownName]: !prevState[dropdownName],
    }));
  };
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const addUserModel = () => {
    setIsAddUserOpen(!isAddUserOpen);
  };

  const handleLogOut = () => {
    dispatch(loggedOut())

    Swal.fire({
      icon: "success",
      title: "LogOut Successful!",
      text: "You have been successfully logged out.",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    setTimeout(() => {
      window.location.href = "/LoginPage";
    }, 200);
  };
  

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    //search logic here
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* LEFT SIDE NAVBAR AND RIGHT SIDE HEADER AND BANNER STARTS FROM HERE */}
      <div className="leftside-navbar-section">
        <div
          className={`main-content-sidenav ${isSidebarOpen ? "open" : ""}`}
        >
          <div className="sidenav-logo">
            <h2>TEAM-MONITOR</h2>
            <p>The Complete Team Monitoring System</p>
          </div>
          <div className="main-nav-menu">
            <ul className="nav-ul">
              <li>
                <NavLink
                  to="/Dashboard"
                  className="atag"
                  activeClassName="active"
                >
                  <div className="logo-link">
                    <div className="space-betwn-navbar">
                      <img
                        src={dashboard}
                        alt=""
                        style={{ marginTop: "-9px" }}
                      />
                      <h3>Dashboards</h3>
                    </div>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/ManageEmployee"
                  className="atag"
                  activeClassName="active"
                >
                  <div className="logo-link">
                    <div className="space-betwn-navbar">
                      <img src={myteams} alt="" style={{ marginTop: "-9px" }} />
                      <h3>Manage Employee</h3>
                    </div>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink to="/MyTeam" className="atag" activeClassName="active">
                  <div className="logo-link">
                    <div className="space-betwn-navbar">
                      <img src={myteams} alt="" style={{ marginTop: "-9px" }} />
                      <h3>My Team</h3>
                    </div>
                  </div>
                </NavLink>
              </li>

              {/* Leave Management */}
              <li
                className={`sideBar-text ${
                  openDropdown.dropDownSidebar ? "expanded" : ""
                }`}
                onClick={() => handleDropdownToggle("dropDownSidebar")}
              >
                <div className="atag">
                  <div className="logo-link">
                    <div className="space-betwn-navbar">
                      <img
                        src={dropDownSidebar}
                        alt=""
                        style={{ marginTop: "-9px" }}
                      />
                      <h3>Leave Management</h3>
                    </div>
                    <div className="down-arrow-svg">
                      <img src={arrowdown} alt="" />
                    </div>
                  </div>
                </div>
                {openDropdown.dropDownSidebar && (
                  <div className="sideBar-dropdown-content">
                    <NavLink
                      to="/ManageLeave"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={manageleave} alt="" />
                      Manage Leave
                    </NavLink>
                    <NavLink
                      to="/ManageHoliday"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={manageholiday} alt="" />
                      Manage Holiday
                    </NavLink>
                    <NavLink
                      to="/LeaveSummary"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={leavesummary} alt="" />
                      Leave Summary
                    </NavLink>
                  </div>
                )}
              </li>

              {/* Proof Of Work */}
              <li
                className={`sideBar-text ${
                  openDropdown.proofOfWork ? "expanded" : ""
                }`}
                onClick={() => handleDropdownToggle("proofOfWork")}
              >
                <div className="atag">
                  <div className="logo-link">
                    <div className="space-betwn-navbar">
                      <img
                        src={proofofwork}
                        alt=""
                        style={{ marginTop: "-9px" }}
                      />
                      <h3>Proof Of Work</h3>
                    </div>
                    <div className="down-arrow-svg">
                      <img src={arrowdown} alt="" />
                    </div>
                  </div>
                </div>
                {openDropdown.proofOfWork && (
                  <div className="sideBar-dropdown-content">
                    <NavLink
                      to="/SSofEachDepartment"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={camera} alt="" />
                      Screenshots
                    </NavLink>
                    <NavLink
                      to="/TVofEachDepartment"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={video} alt="" />
                      Timelapse Videos
                    </NavLink>
                    <NavLink
                      to="/Timesheet"
                      className="dropdown-list"
                      activeClassName="active "
                    >
                      <img src={calendar} alt="" />
                      Timesheet
                    </NavLink>
                    <NavLink
                      to="/RiskUser"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={danger} alt="" />
                      Risk Users
                    </NavLink>
                    <NavLink
                      to="/Timeline"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={timecircle} alt="" />
                      Timeline
                    </NavLink>
                  </div>
                )}
              </li>

              {/* App Usages */}
              <li
                className={`sideBar-text ${
                  openDropdown.appUsages ? "expanded" : ""
                }`}
                onClick={() => handleDropdownToggle("appUsages")}
              >
                <div className="atag">
                  <div className="logo-link">
                    <div className="space-betwn-navbar">
                      <img
                        src={appusages}
                        alt=""
                        style={{ marginTop: "-9px" }}
                      />
                      <h3>App Usages</h3>
                    </div>
                    <div className="down-arrow-svg">
                      <img src={arrowdown} alt="" />
                    </div>
                  </div>
                </div>
                {openDropdown.appUsages && (
                  <div className="sideBar-dropdown-content">
                    <NavLink
                      to="/ReviewApp"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={reviewapp} alt="" />
                      Review App
                    </NavLink>
                    <NavLink
                      to="/AppHistory"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={apphistory} alt="" />
                      App History
                    </NavLink>
                  </div>
                )}
              </li>

              {/* Reports */}
              <li
                className={`sideBar-text ${
                  openDropdown.reports ? "expanded" : ""
                }`}
                onClick={() => handleDropdownToggle("reports")}
              >
                <div className="atag">
                  <div className="logo-link">
                    <div className="space-betwn-navbar">
                      <img src={report} alt="" style={{ marginTop: "-9px" }} />
                      <h3>Reports</h3>
                    </div>
                    <div className="down-arrow-svg">
                      <img src={arrowdown} alt="" />
                    </div>
                  </div>
                </div>
                {openDropdown.reports && (
                  <div className="sideBar-dropdown-content">
                    <NavLink
                      to="/DailyAttendance"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={dailyatticon} alt="" />
                      Daily Attendance
                    </NavLink>
                    <NavLink
                      to="/MonthlyAttendance"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={monthlyatticon} alt="" />
                      Monthly Attendance
                    </NavLink>
                    <NavLink
                      to="/monthly-in-out"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={monthyinouticon} alt="" />
                      Monthly In Out
                    </NavLink>
                    <NavLink
                      to="/LateClockIn"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={lateclockinicon} alt="" />
                      Late Clock-In
                    </NavLink>
                    <NavLink
                      to="/OverTimeReport"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={overtime} alt="" />
                      Over time report
                    </NavLink>
                    <NavLink
                      to="/deletedUsers"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={deleteUser} alt="" />
                      Deleted Users
                    </NavLink>
                  </div>
                )}
              </li>

              {/* Configuration */}
              <li
                className={`sideBar-text ${
                  openDropdown.configuration ? "expanded" : ""
                }`}
                onClick={() => handleDropdownToggle("configuration")}
              >
                <div className="atag">
                  <div className="logo-link">
                    <div className="space-betwn-navbar">
                      <img
                        src={configuration}
                        alt=""
                        style={{ marginTop: "-9px" }}
                      />
                      <h3>Configuration</h3>
                    </div>
                    <div className="down-arrow-svg">
                      <img src={arrowdown} alt="" />
                    </div>
                  </div>
                </div>
                {openDropdown.configuration && (
                  <div className="sideBar-dropdown-content">
                    <NavLink
                      to="/Setting"
                      className="dropdown-list"
                      activeClassName="active"
                    >
                      <img src={settingicon} alt="" />
                      Settings
                    </NavLink>
                  </div>
                )}
              </li>

              <li>
                <div className="atag" onClick={handleLogOut}>
                  <div className ="logo-link">
                    <div className="space-betwn-navbar">
                      <img src={logout} alt="" style={{ marginTop: "-9px" }} />
                      <h3>Logout</h3>
 </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <button
        className="toggle-button"
        onClick={handleSidebarToggle}
      >
        <Icon icon="ic:baseline-menu" />
      </button>

      {/* RIGHT SIDE HEADER AND BANNER STARTS FROM HERE */}
      <div className="right-side-content">
        <div className="right-main-header">
          <div className="search-bar">
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ outline: "none" }}
            />
            <Icon
              icon="ic:twotone-search"
              style={{
                position: "absolute",
                top: "25px",
                right: "15px",
                color: "gray",
                fontSize: "30px",
              }}
            />
          </div>
          <div
            className="download-btn"
            onClick={addUserModel}
            style={{ cursor: "pointer" }}
          >
            <img src={addUser} alt="" />
            Add User
          </div>
          <Notification />
          <div className="user-image">
            <FaSolidUserAlt />
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <AddUser isOpen={isAddUserOpen} onClose={addUserModel} />
      )}
    </div>
  );
};

export default Bar;