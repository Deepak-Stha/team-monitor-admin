import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import OTPPopup from '../components/OTPPopup';
import LeftContent from './LeftContent';
import google from "../assets/images/Google.svg";
import { BaseApiURL } from '../contexts/ApiURL.jsx';
import { Icon } from '@iconify/react';

const Register = () => {
    const REGISTER_API = `${BaseApiURL}/company/register`;
    const [form, setForm] = useState({});
    const [error, setError] = useState(null);
    const [companyEmail, setCompanyEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [isOTPModelOpen, setIsOTPModelOpen] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        setCompanyEmail(form.companyEmail);
        console.log(companyEmail);
    };

    const openOTPModel = () => {
        setIsOTPModelOpen(!isOTPModelOpen);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        console.log('Submitting form data:', form);  
        try {
            const response = await axios.post(REGISTER_API, form);
            
            console.log(response, "RESP");
            if (response.data.message) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${response.data.message}`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            if (response.status === 200) {
                localStorage.setItem('companyData', JSON.stringify(form));
                openOTPModel();
            }
            console.log('Server response:', response.data);
            
        } catch (err) {
            console.error('Request error:', err.response ? err.response.data : err.message);
            setError(err.response ? err.response.data : { message: 'An error occurred' });
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: `${err.response.data.message}`,
                showConfirmButton: false,
                timer: 1500
            });
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const googleAuth = () => {
        window.location.href = `${BaseApiURL}/auth/google`;
    };

    return (
        <div className="register-grid">
            <LeftContent />
            <div style={{ backgroundColor: "#005BC4", display: 'flex', justifyContent: "center" }}>
                <form onSubmit={handleSubmit} method='post' className="register-form">
                    <h1>Register Your Company</h1>
                    <input type="email" name="companyEmail" placeholder='Company email' onChange={handleChange} required />
                    <input type="text" name="companyName" placeholder='Company name' onChange={handleChange} required />
                    <input type="tel" name="companyPhoneNumber" placeholder='Company phone number' onChange={handleChange} required />
                    <input type="text" name='location' placeholder='Location' onChange={handleChange} />
                    <div style={{ position: 'relative' }}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            placeholder='Password' 
                            onChange={handleChange} 
                            required 
                        />
                        <span 
                            onClick={togglePasswordVisibility} 
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        >
                            <Icon icon={showPassword ? 'octicon:eye-24' : 'ri:eye-close-line'} style={{ color: "rgba(0, 91, 196, 1)", fontSize: "20px" }} />
                        </span>
                    </div>               
                    <button type="submit" disabled={loading}>
                        {loading ? "Processing..." : "Register"}
                    </button>
                    <p className="register-prompt">Already have an account? <Link to="/LoginPage">Login Now</Link></p>
                </form>
            </div>
            {error && (
                <div style={{ color: 'red' }}>
                    {error.message}
                    {error.errors && (
                        <ul>
                            {Object.keys(error.errors).map(key => (
                                <li key={key}>{key}: {error.errors[key]}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {isOTPModelOpen && (
                <OTPPopup isOpen={isOTPModelOpen} onClose={openOTPModel} companyEmail={companyEmail} />
            )}
        </div>
    );
};

export default Register;

