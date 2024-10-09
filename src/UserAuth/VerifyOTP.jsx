import React, { useState } from 'react';
import axios from 'axios';
import { BaseApiURL } from '../contexts/ApiURL';
import { useNavigate } from 'react-router-dom';  

function VerifyOTP({ onClose }) {
    const VERIFY_OTP = `${BaseApiURL}/company/verify-forget-pw-otp`;

    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(VERIFY_OTP, form);
            if (response.status === 200) {
                navigate('/ResetPw');  
            }
        } catch (error) {
            console.error('OTP verification error:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>Enter your OTP</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="otp" onChange={handleInputChange} placeholder="Enter OTP" required />
                    <button type="submit">{loading ? 'Verifying...' : 'Verify OTP'}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default VerifyOTP;
