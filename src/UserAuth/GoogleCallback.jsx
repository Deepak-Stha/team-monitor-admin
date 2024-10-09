import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { BaseApiURL } from '../contexts/ApiURL';

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');

            if (code) {
                try {
                    const response = await axios.post(`${BaseApiURL}/auth/google/callback`, { code });
                    const token = response.data.token;

                    // Store the token in localStorage
                    localStorage.setItem("token", token);
                    localStorage.setItem("companyEmail", response.data.companyEmail);
                    localStorage.setItem("companyId", response.data.companyId);
                    localStorage.setItem("isLoggedIn", true);

                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful!',
                        text: 'You have been successfully logged in.',
                    });

                    navigate("/Dashboard");
                } catch (err) {
                    console.error('Error during Google authentication:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Authentication Failed',
                        text: err.response ? err.response.data.message : 'An error occurred.',
                    });
                }
            }
        };

        fetchData();
    }, [navigate]);

    return <div>Loading...</div>;
};

export default GoogleCallback;
