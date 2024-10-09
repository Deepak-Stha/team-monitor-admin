import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/bar.css";
import dashboard from "../assets/images/dashboard-link.svg";
import bell from '../assets/images/bell-icon.svg';
import logout from "../assets/images/logout.svg.svg";
import Swal from "sweetalert2";

const Bar = () => {

    const handleLogOut = () => {
        window.localStorage.removeItem("token");
        window.localStorage.setItem('isLoggedIn', 'false');

        Swal.fire({
            icon: 'success',
            title: 'LogOut Successful!',
            text: 'You have been successfully logged out.',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
        });

        setTimeout(() => {
            window.location.href = "/SuperAdminLogin";
        }, 200);
    };

    return (
        <div>
            {/* LEFT SIDE NAVBAR AND RIGHT SIDE HEADER AND BANNER STARTS FROM HERE */}
            <div className="leftside-navbar-section">
                <div className="main-content-sidenav">
                    <div className="sidenav-logo">
                        <h2>TEAM-MONITOR</h2>
                        <p>The Complete Team Monitoring System</p>
                    </div>
                    <div className="main-nav-menu">
                        <ul className="nav-ul">
                            <li>
                                <Link to="/SuperAdminPannel" className="atag">
                                    <div className="logo-link">
                                        <div className="space-betwn-navbar">
                                            <img src={dashboard} alt="" />
                                            <h3>Manage Company</h3>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <div className="atag" onClick={handleLogOut}>
                                    <div className="logo-link">
                                        <div className="space-betwn-navbar">
                                            <img src={logout} alt="" />
                                            <h3>Logout</h3>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="right-side-content">
                <div className="right-main-header">
                    <div className="notification-container">
                    <div className="bell-btn">
                        <img src={bell} alt="Notifications" />
                        {/* {unreadCount > 0 &&  */}
                        <span className="notification-badge">
                            {/* {unreadCount} */}
                            
                        </span>
                        {/* } */}
                    </div>
                    {/* <div className="notifications-dropdown">
                        {notifications.length === 0 ? (
                            <p>No new notifications</p>
                        ) : ( 
                        <ul>
                            <li>
                                <div className="notification-by">Employee Name</div>
                                <div className="notification-message">Requested to approve the company verification</div>
                                <div className="notification-time">2024-9-19</div>
                            </li>
                        </ul>
                    </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bar;
