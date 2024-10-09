import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { BaseApiURL } from '../contexts/ApiURL'
import image from '../assets/images/reewazdaiaiimg 1.jpg'
import vector from "../assets/images/Vector.png"
import "../assets/css/superAdmin.css"

const SuperAdminLogin = () => {

    const SUPER_ADMIN_REGISTER_API = `${BaseApiURL}/superadmin/login`
    const navigate = useNavigate()
    const [form, setForm] = useState({})

    const handleInputChange= (e) =>{
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()

        const superAdminLoginResponse = await axios.post(SUPER_ADMIN_REGISTER_API,form)
        console.log(superAdminLoginResponse)
        localStorage.setItem("superAdminToken",superAdminLoginResponse.data.token)

        if(superAdminLoginResponse.status === 200){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${superAdminLoginResponse.data.message}`,
                showConfirmButton: false,
                timer: 1500
            });
            navigate("/SuperAdminPannel")
            console.log(superAdminLoginResponse.status)
        }

    }
  return (
    <div style={{display:"flex", overflow:"hidden"}}>
        <img className="super-admin" src={image} alt="Reewaz sir" />
        <div className="login-super-admin">
            {/* <img className="v1" src={vector} alt="Vector" /> */}
            <img className="v2" src={vector} alt="Vector" />
            <img className="v3" src={vector} alt="Vector" />
            <img className="v4" src={vector} alt="Vector" />
            <img className="v5" src={vector} alt="Vector" />
            <div className=''>
                <form className='super-admin-form' onSubmit={handleSubmit} >
                    <div  className="label">
                        <h1 className="head">Team Monitor</h1>
                        <p className='saying'>Reewaz, hit the button and let’s tear it up!</p>
                    </div>
                    <div className='out-form'>
                        <div className='input-and-lables'>
                            <label >Enter Your Email</label>
                            <input type="email" name='email' style={{margin:"0%"}} placeholder='Email' onChange={handleInputChange} required/>
                        </div>
                        <div className='input-and-lables'>
                            <label >Password</label>
                            <input type="password" name='password' style={{margin:"0%"}} placeholder='Password' onChange={handleInputChange} required />
                        </div>
                    </div>

                    
                    <button type='submit' className="super-login-btn">Let’s Go Reewaz</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default SuperAdminLogin