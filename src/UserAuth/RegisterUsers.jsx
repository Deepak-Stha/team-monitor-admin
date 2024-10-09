import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { BaseApiURL } from '../contexts/ApiURL'
const RegisterUsers = () => {

    const RegisterUser_API = `${BaseApiURL}/api/auth/register/user`
    // const baseUrl = process.env.baseURL;
    // console.log(process.env.baseURL)
    const [form, setform] = useState({})
    const [error, seterror] = useState(null)

    const handleChange = (e) =>{
        setform({
            ...form,
            [e.target.name ]: e.target.value
        })
    }   
    const handleSubmit = async(e) =>{
        e.preventDefault()

        try{
            const response = await axios.post(`${RegisterUser_API}`,{form})
            console.log(response,"REsp")
            if (response.data.message) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `${response.data.message}`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }catch (err) {
            console.log("Request Error:", err)
            seterror(err.response ? err.response.data : {messgae: 'An error occured'})
        }
    }

  return (
    <div>
            <h1>Register Users</h1>
                 <div style={{ backgroundColor: "teal", display: 'flex', justifyContent: "center" }}>
                <form onSubmit={handleSubmit} method='post'>
                    <input type="text" name="name" placeholder='Name' onChange={handleChange} required />
                    <br /><br />
                    <input type="email" name="email" placeholder='Email' onChange={handleChange} required />
                    
                    <br /><br />
                    <input type="password" name="password" placeholder='Password' onChange={handleChange} required />
                    <br /><br />
                    <input type="password" name="confirmPassword" placeholder='Confirm Password' onChange={handleChange} required />
                    <br /><br />
            
                    <input type="text" name="role" placeholder='Role' onChange={handleChange} required />

                    
                    <button type="submit">Register</button>
                </form>
            </div>
    </div>
  )
}

export default RegisterUsers