import React from 'react'
import { useDispatch } from 'react-redux';
import { loggedOut } from '../redux/auth/authSlice';

export function Logout (userDetails) {
    const dispatch = useDispatch()

    const user = userDetails.user;
    
    const handleLogOut = () => {
        // Perform the logout API call
        window.open(`${BaseApiURL}/google/auth/logout`, "_self");

        dispatch(loggedOut())

        // Show success alert
        Swal.fire({
            icon: 'success',
            title: 'Log Out Successful!',
            text: 'You have been successfully logged out.',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
        });

        // Redirect after a brief delay
        setTimeout(() => {
            window.location.href = "/LoginPage";
        }, 200);
    };

    return (
        <div className="logo-link">
            <div className="space-betwn-navbar" >
                <img src={logout} alt="" />
                <h3 onClick={()=>{handleLogOut()}} >Logout</h3>
            </div>
        </div>
    )
}