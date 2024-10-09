import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import LeftContent from "./LeftContent";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BaseApiURL } from "../contexts/ApiURL";
import { Icon } from '@iconify/react';

function ResetPw() {
    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get('token');
    console.log(token)

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const RESET_API = `${BaseApiURL}/company/reset-pw-company`;

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (newPassword !== confirmPassword) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Passwords do not match.",
            showConfirmButton: false,
            timer: 1500
          });
          return; // Early return if passwords don't match
        }
    
        try {
          const response = await axios.patch(RESET_API, {
            token,
            oldPassword,
            newPassword,
            confirmPassword,
          });
          console.log(response, "RESp");
        } catch (error) {
          console.log(error);
        }
    };

    return (
        <div className="register-grid">
            <LeftContent />
            <div className="login">
                <p className="login-title">Change Password</p>
                <p className="welcome-msg">Reset your password for smooth access</p>
                <div className="lines"></div>
                <form onSubmit={handleSubmit} >
                    <div style={{ position: 'relative' }}>
                        <input 
                            type={showOldPassword ? "text" : "password"} 
                            name="password" 
                            placeholder="Old Password" 
                            value={oldPassword} 
                            onChange={(e) => setOldPassword(e.target.value)}
                            required 
                        />
                        <span 
                            onClick={() => setShowOldPassword(!showOldPassword)} 
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        >
                            <Icon icon={showOldPassword ? 'octicon:eye-24' : 'ri:eye-close-line'} style={{color:"rgba(0, 91, 196, 1)", fontSize:"20px"}} />
                        </span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type={showNewPassword ? "text" : "password"} 
                            name="password" 
                            placeholder="New Password" 
                            value={newPassword} 
                            onChange={(e) =>  setNewPassword(e.target.value)}
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
                            name="password" 
                            placeholder= "Confirm Password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                        />
                        <span 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        >
                            <Icon icon={showConfirmPassword ? 'octicon:eye-24' : 'ri:eye-close-line'} style={{color:"rgba(0, 91, 196, 1)", fontSize:"20px"}} />
                        </span>
                    </div>
                    
                    <button type="submit" className="login-btn-p">
                        Change Password
                    </button>
                    {/* <p className="register-prompt">Having Problem? <Link to="/">Contact Support</Link></p> */}
                </form>
            </div>
        </div>
    );
}

export default ResetPw;
