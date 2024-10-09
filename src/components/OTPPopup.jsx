import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Navigate, useNavigate } from 'react-router-dom'
import { BaseApiURL } from '../contexts/ApiURL'

const OTPPopup = ({isOpen, onClose, companyEmail}) => {
    console.log(companyEmail)

    const [OTP, setOTP] = useState(null)

    const navigate = useNavigate()

    const OTP_VERIFICATION_API = `${BaseApiURL}/company/verify-company-registration-otp`;

    const handleInputChange = (e) =>{
        
     const{name, value} = e.target 
      setOTP({...OTP, [name]: value})

    }

    const handleSubmit = async(e) => {

        e.preventDefault()
        try {

        const OPT_Verification_Response = await axios.post(OTP_VERIFICATION_API,{companyEmail,otp:OTP.otp})
        console.log(OPT_Verification_Response.data.message)

        Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${OPT_Verification_Response.data.message}`,
                    showConfirmButton: false,
                    timer: 1500
                    });
        navigate("/LoginPage")
          
        } catch (error) {

          navigate("/LoginPage")
          
        }
        



    }

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Enter OTP</h2>
        <form onSubmit={handleSubmit}>
          <label>
            OTP:
            <input
              type="numeric"
              name="otp"
            //   value={departmentData.departmentName}
              onChange={handleInputChange}
              required
            />
          </label>
          
      

          <div className="modal-buttons">
            <button type="submit" onClick={handleSubmit}>Save Changes</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OTPPopup