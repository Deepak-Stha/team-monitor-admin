import React, { useState } from "react";
import LeftContent from "./LeftContent";
import axios from "axios";
import Swal from "sweetalert2";
import { BaseApiURL } from "../contexts/ApiURL";
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';

function ResetPw() {
    const [form, setForm] = useState({
        companyEmail: "",
        newPassword: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();
    const RESET_API = `${BaseApiURL}/company/reset-password`;
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { companyEmail, newPassword, confirmPassword } = form;
        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Passwords do not match",
                text: "Please make sure both password fields match."
            });
            return;
        }
        try {
            const response = await axios.patch(RESET_API, {
                companyEmail,
                newPassword
            });

            if (response.status === 200) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Password Reset Successful",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate("/LoginPage");
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while resetting your password. Please try again."
            });
        }
    };

    

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="register-grid">
            <LeftContent />
            <div style={{ backgroundColor: "#005BC4", display: 'flex', justifyContent: "center" }}>
                {/* <div className="lines"></div> */}
                <form onSubmit={handleSubmit} method='post' className="register-form">
                    <h1 className="login-title">Reset Password</h1>
                    {/* <p className="welcome-msg">Reset your password for smooth access</p> */}
                    <input type="email"
                        name="companyEmail"
                        placeholder="Company Email"
                        value={form.companyEmail}
                        onChange={handleInputChange}
                        required
                    />
                    <div style={{ position: 'relative' }}>
                        <input 
                            type={showNewPassword ? "text" : "password"} 
                            name="newPassword"
                            placeholder="New Password"
                            value={form.newPassword}
                            onChange={handleInputChange}
                            required 
                        />
                        <span 
                            onClick={() => setShowNewPassword(!showNewPassword)} 
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        >
                            <Icon icon={showNewPassword ? 'octicon:eye-24' : 'ri:eye-close-line'} style={{color:"rgba(0, 91, 196, 1)", fontSize:"20px"}} />
                        </span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleInputChange}
                        required 
                        />
                        <span 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        >
                            <Icon icon={showConfirmPassword ? 'octicon:eye-24' : 'ri:eye-close-line'} style={{color:"rgba(0, 91, 196, 1)", fontSize:"20px"}} />
                        </span>
                    </div>
                    <button type="submit" >
                        Reset Now
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPw;
