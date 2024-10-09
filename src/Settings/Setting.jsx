import React, { useState, useEffect } from "react";
import Bar from "../sidebar/Bar";
// import "../assets/css/setting.css";
import { BaseApiURL } from "../contexts/ApiURL";
import axios from "axios";
import Swal from "sweetalert2";
import eye from "../assets/images/eye.svg";
import eyeClose from '../assets/images/eyeClose.svg';
import "../assets/css/newsetting.css";
import { useSelector } from "react-redux";
import { selectCurrentCompanyEmail, selectCurrentToken } from "../redux/auth/authSlice";

function Setting() {
    const token = useSelector(selectCurrentToken)
    const companyEmail = useSelector(selectCurrentCompanyEmail)


    const [time, setTime] = useState({
        actualLoginTime: "",
        actualLogoutTime: "",
    });

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [timeId, setTimeId] = useState("");
    const [loading, setLoading] = useState(true);const [isVerifyOTP, setIsVerifyOTP] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showResetNewPass, setShowResetNewPass] = useState(false);
    const [showResetConfirmPass, setShowResetConfirmPass] = useState(false);
    const [otp, setOtp] = useState("");
    const [isOTPLoading, setIsOTPLoading] = useState(false);
    const [isResetLoading, setIsResetLoading] = useState(false);
    const [isForgetPasswordLoading, setIsForgetPasswordLoading] = useState(false); // New loading state

    const UPDATE_TIME_API = `${BaseApiURL}/company/update-company-time`;
    const FETCH_API = `${BaseApiURL}/company/company-actual-time`;
    const CHANGE_PW_API = `${BaseApiURL}/company/change-password`;
    const FORGET_PASSWORD_API = `${BaseApiURL}/company/forget-password`;
    const VERIFY_OTP_API = `${BaseApiURL}/company/verify-forget-pw-otp`;
    const RESET_API = `${BaseApiURL}/company/reset-password`;


    useEffect(() => {
        const fetchTimeData = async () => {
            try {
                const response = await axios.get(FETCH_API, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                // const { actualLoginTime, actualLogoutTime } = response.data;
                // setTime({
                //     actualLoginTime: actualLoginTime,
                //     actualLogoutTime: actualLogoutTime 
                // });

                setTime(response.data.actualCompanyTime)
                setTimeId(response.data.actualCompanyTime.actualTimeId);
            } catch (error) {
                console.error("Failed to fetch company time data:", error);
                setTime({
                    actualLoginTime: "9:00",
                    actualLogoutTime: "18:00"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchTimeData();
    }, [token]);

    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        setTime(prevTime => ({ ...prevTime, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPassword(prevPassword => ({ ...prevPassword, [name]: value }));
    };

    const handleForgetPassword = async () => {
        setIsForgetPasswordLoading(true); // Start loading
        try {
            const response = await axios.post(FORGET_PASSWORD_API, {
                companyEmail
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200) {
                setIsVerifyOTP(true); // Open OTP modal after successful request
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : error.message;
            Swal.fire({ icon: "error", title: "Error", text: errorMessage });
        } finally {
            setIsForgetPasswordLoading(false); // End loading
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsOTPLoading(true);
        try {
            const response = await axios.post(VERIFY_OTP_API, { otp }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200) {
                Swal.fire("OTP verified successfully!");
                setIsResetPasswordModalOpen(true); // Open reset password modal
                setIsVerifyOTP(false); // Close OTP modal
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : error.message;
            Swal.fire({ icon: "error", title: "Error", text: errorMessage });
        } finally {
            setIsOTPLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsResetLoading(true);
    
        try {
            const response = await axios.patch(RESET_API, {
                companyEmail,
                newPassword: password.newPassword,
                confirmPassword: password.confirmPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
    
            if (response.status === 200) {
                Swal.fire("Password reset successfully!");
                setIsResetPasswordModalOpen(false); // Close the reset password modal
                // Clear the password form values
                setPassword({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : error.message;
            Swal.fire({ icon: "error", title: "Error", text: errorMessage });
        } finally {
            setIsResetLoading(false);
        }
    };

    const handleTimeSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`${UPDATE_TIME_API}/${timeId}`, time, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Company time set updated",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to update company time",
                text: error.response ? error.response.data.message : error.message,
                showConfirmButton: true,
            });
        }
    };


    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmPassword) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Passwords do not match",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        try {
            const response = await axios.patch(CHANGE_PW_API, password, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Password changed successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to change password",
                text: error.response ? error.response.data.message : error.message,
                showConfirmButton: true
            });
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Bar />
            <div className="right-content">
                <div className="settings-head">
                    <h2>Settings</h2>
                    <h4>Customize all the app settings in your organization</h4>
                </div>
                <div className="settings-main-section">
                    <div className="settings-left-content">
                        <div className="work-time-settings">
                            <h3>Work Time Settings</h3>
                            <p>Customize your work time settings for employees</p>
                            <form onSubmit={handleTimeSubmit}>
                                <div className="work-time-settings-input">
                                    <label>Expected Clock-In Time</label>
                                    <input
                                        type="text"
                                        name="actualLoginTime"
                                        placeholder={time.actualLoginTime || "Enter Clock-In Time"}
                                        value={time.actualLoginTime}
                                        onChange={handleTimeChange}
                                        required
                                    />
                                    <label>Expected Clock-Out Time</label>
                                    <input
                                        type="text"
                                        name="actualLogoutTime"
                                        placeholder="Clock-Out Time"
                                        value={time.actualLogoutTime}
                                        onChange={handleTimeChange}
                                        required
                                    />
                                </div>
                                <div className="settings-save">
                                    <button type="submit" className="settings-save-btn">
                                        Save Settings
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="settings-left-content">
                        <div className="work-time-settings">
                            <h3>Password Settings</h3>
                            <p>Change Your Password</p>
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="work-time-settings-input">
                                    <label>Current Password</label>
                                    <div className="password-input-container">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            placeholder="Current Password"
                                            value={password.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                        <span onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                            <img src={showCurrentPassword ? eye : eyeClose} alt="Toggle Visibility" />
                                        </span>
                                    </div>

                                    <label>New Password</label>
                                    <div className="password-input-container">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            placeholder="New Password"
                                            value={password.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                        <span onClick={() => setShowNewPassword(!showNewPassword)}>
                                            <img src={showNewPassword ? eye : eyeClose} alt="Toggle Visibility" />
                                        </span>
                                    </div>

                                    <label>Confirm Password</label>
                                    <div className="password-input-container">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={password.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <img src={showConfirmPassword ? eye : eyeClose} alt="Toggle Visibility" />
                                        </span>
                                    </div>
                                </div>
                                <p onClick={handleForgetPassword} className="register-prompt">
                                    {isForgetPasswordLoading ? "Loading..." : "Forget Password"}
                                </p>
                                <div className="settings-save">
                                    <button type="submit" className="settings-save-btn">
                                        Save Settings
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* OTP Verification Modal */}
                {isVerifyOTP && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Verify OTP</h2>
                            <p>Otp has been sent to your mail</p>
                            <form onSubmit={handleVerifyOtp}>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                    required
                                />
                                <button type="submit" disabled={isOTPLoading}>
                                    {isOTPLoading ? "Verifying..." : "Verify OTP"}
                                </button>
                                <button type="button" onClick={() => setIsVerifyOTP(false)}>Close</button>
                            </form>
                            
                        </div>
                    </div>
                )}

                {/* Reset Password Modal */}
                {isResetPasswordModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Reset Password</h2>
                            <form onSubmit={handleResetPassword}>
                                <label>New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showResetNewPass ? "text" : "password"}
                                        value={password.newPassword}
                                        onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                                        placeholder="New Password"
                                        required
                                    />
                                    <span onClick={() => setShowResetNewPass(!showResetNewPass)}>
                                        <img src={showResetNewPass ? eye : eyeClose} alt="Toggle Visibility" />
                                    </span>
                                </div>

                                <label>Confirm Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showResetConfirmPass ? "text" : "password"}
                                        value={password.confirmPassword}
                                        onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                                        placeholder="Confirm Password"
                                        required
                                    />
                                    <span onClick={() => setShowResetConfirmPass(!showResetConfirmPass)}>
                                        <img src={showResetConfirmPass ? eye : eyeClose} alt="Toggle Visibility" />
                                    </span>
                                </div>
                                <button type="submit" disabled={isResetLoading}>
                                    {isResetLoading ? "Resetting..." : "Reset Password"}
                                </button>
                                <button type="button" onClick={() => setIsResetPasswordModalOpen(false)}>Close</button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Setting;