import axios from 'axios';
import React from 'react';
// import LeftContent from './LeftContent';
import { useState } from 'react'
import { BaseApiURL } from '../contexts/ApiURL';


const OTPPage = () => {
    const OTP_VERIFICATION_API = `${BaseApiURL}/company/verify-company-registration-otp`;

    const [form, setForm] = useState(null)
    console.log(form,"FORM")

    const handleInputChange = (e)=>{
        e.preventDefault()
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value
            }
        )  
    }

    const handleOTPSubmit = async(e) =>{
        const OPT_Verification_Response = await axios.post(OTP_VERIFICATION_API,form)
    }

    return (
        <div className="register-grid">
            <div style={{ backgroundColor: "#005BC4", display: 'flex', justifyContent: "center" }}>
                <form onSubmit={handleOTPSubmit} method='post' className="register-form">
                <input type="numeric" name="otp" onChange={handleInputChange} placeholder='Enter OTP' />

                <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default OTPPage