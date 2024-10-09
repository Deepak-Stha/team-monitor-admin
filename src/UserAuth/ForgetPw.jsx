import React, { useState } from 'react';
import LeftContent from './LeftContent';
import { BaseApiURL } from '../contexts/ApiURL';
import Swal from 'sweetalert2';
import axios from 'axios';
import VerifyOTP from './VerifyOTP';

const ForgetPw = () => {
    const [form, setForm] = useState({});
    const [isVerifyOTP, setIsVerifyOTP] = useState(false);

    const FORGET_PW_API = `${BaseApiURL}/company/forget-password`;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const openVerifyOTPModal = () => {
        setIsVerifyOTP(true);
    };

    const closeVerifyOTPModal = () => {
        setIsVerifyOTP(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(FORGET_PW_API, form);

            if (response.data.message) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                });
            }
            if (response.status === 200) {
                openVerifyOTPModal();
            }
        } catch (error) {
            console.error('Request error:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="register-grid">
            <LeftContent />
            <div style={{ backgroundColor: '#005BC4', display: 'flex', justifyContent: 'center' }}>
                <form method='post' onSubmit={handleSubmit} className="register-form">
                    <h1>Forget password</h1>
                    <input type="email" name="companyEmail" placeholder='Company email' onChange={handleInputChange} required />
                    <input type="text" name="companyName" placeholder='Company name' onChange={handleInputChange} required />
                    <button type="submit">Next</button>
                </form>
            </div>

            {/* Basic Modal Implementation */}
            {isVerifyOTP && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={closeVerifyOTPModal} className="modal-close-button">X</button>
                        <VerifyOTP onClose={closeVerifyOTPModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgetPw;
