
import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LeftContent from './LeftContent';
import google from "../assets/images/Google.svg";
import { BaseApiURL } from '../contexts/ApiURL';
import { Icon } from '@iconify/react';
import { selectCurrentToken, updateCredentials } from '../redux/auth/authSlice';
import { useDispatch, useSelector } from "react-redux";



const LoginPage = () => {
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();
    const LOGIN_API = `${BaseApiURL}/company/login`
    const [form, setform] = useState({});
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false); 
    

    const navigate = useNavigate()

    const handleChange = (e) =>{
        setform({
            ...form,
            [e.target.name] : e.target.value,
        })
    }


    useEffect(() => {
        if (token) {
          navigate("/dashboard");
        }
    }, [token]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', form);
        try {
            const response = await axios.post(`${LOGIN_API}`,form)
            const {company, token} = response.data;
            // dispatch({
            //     type: 'UPDATE_CREDENTIALS',
            //     payload: {
            //       company,
            //       token
            //     }
            //   });
            dispatch(updateCredentials(company))
            dispatch(updateCredentials({token}))

            // Show success message using SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: 'You have been successfullly logined.',
            });
            navigate("/Dashboard")

        } catch (err) {
            console.error('Request error:', err.response ? err.response.data : err.message);
            setError(err.response ? err.response.data : { message: 'An error occurred' });
            // Show error message using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.response ? err.response.data.message : 'An error occurred.',
            });
        };
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const googleAuth = () => {
        window.location.href = `${BaseApiURL}/auth/google`;
    };


    return (
    <div className="register-grid">
            <LeftContent/>
            <div style={{ backgroundColor: "#005BC4", display: 'flex', justifyContent: "center" }}>
                <form onSubmit={handleSubmit} method='post' className="register-form">
                    <h1>Login Company</h1>
                        <input type="email" name="companyEmail" placeholder='Company Email' onChange={handleChange} required/>
                        <div style={{ position: 'relative' }} className='password-input-login'>
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
                                <Icon icon={showPassword ? 'octicon:eye-24' : 'ri:eye-close-line'} style={{color:"rgba(0, 91, 196, 1)", fontSize:"20px"}} />
                            </span>
                        </div>
                        <button type="submit">Login</button>
                        <p className="register-prompt">I don't have an account? <Link to="/Register">Register Now</Link></p>
                        <p> <Link to="/ForgetPw" className="register-prompt"  > Forget Password </Link></p>
                        {/* <p className="or">OR</p>
                        <button type="button" className="google-btn" onClick={googleAuth}>
                            <img src={google} alt="" />Continue with Google
                        </button> */}
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
        </div>
  )
}
export default LoginPage
















