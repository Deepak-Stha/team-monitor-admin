import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseApiURL } from '../contexts/ApiURL.jsx';

const ValidationPage = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('companyData'));
        if (!data) {
            navigate('/Register'); 
        }
    }, [navigate]);

    const handleVerification = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${BaseApiURL}/company/verify`, { otp });
            if (response.status === 200) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Verification successful!',
                    showConfirmButton: false,
                    timer: 1500
                });
                localStorage.removeItem('companyData'); // Clean up local storage
                navigate('/Dashboard'); // Redirect to dashboard
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Verification failed',
                    text: response.data.message,
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred during verification.',
            });
        }
    };

    return (
        <div>
            <h1>Verify Your Account</h1>
            <form onSubmit={handleVerification}>
                <input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    placeholder="Enter OTP" 
                    required 
                />
                <button type="submit">Verify</button>
            </form>
        </div>
    );
};

export default ValidationPage;
