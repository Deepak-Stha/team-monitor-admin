import React, { useEffect, useState } from 'react';
import SideBar from './superAdminBar';
import rejectedicon from "../assets/images/rejected-icon.svg";
import circlestatusbar from "../assets/images/circle-status-bar-icon.svg";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BaseApiURL } from '../contexts/ApiURL';
import Swal from 'sweetalert2';

const SuperAdminPannel = () => {
    const token = localStorage.getItem("superAdminToken");
    const [allCompanies, setAllCompanies] = useState([]);

    const GET_ALL_COMPANY_API = `${BaseApiURL}/superadmin/all-verified-not-approved-companies`;
    const PATCH_APPROVAL_STATUS_API = `${BaseApiURL}/superadmin/company-approve-status`;

    const handleGetAllCompany = async () => {
        try {
            const response = await axios.get(GET_ALL_COMPANY_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            setAllCompanies(response.data.allVerifiedNotApprovedCompanies);


           
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    const handleApprovalStatusChange = async (companyId, newStatus) => {
        const action = newStatus ? "approve" : "reject";
        const result = await Swal.fire({
            title: `Are you sure you want to ${action} this company?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        });

        if (result.isConfirmed) {
            try {
                await axios.patch(PATCH_APPROVAL_STATUS_API, {
                    companyId,
                    approveStatus: newStatus // Ensure this is a boolean value
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: `Company ${action}d successfully!`
                });
                
                // Update state to remove the company from the list
                setAllCompanies(prevCompanies => 
                    prevCompanies.filter(company => company.companyId !== companyId)
                );

            } catch (error) {
                console.error("Error updating approval status:", error.response ? error.response.data : error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to update approval status.'
                });
            }
        }
    };

    useEffect(() => {
        handleGetAllCompany();
    }, []);

    return (
        <div>
            <SideBar/>
            <div className="right-content">
                <div className="list-of-department">
                    <table>
                        <thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allCompanies?.map(company => (
                                <tr key={company.companyId}>
                                    <td>{company.companyName}</td>
                                    <td style={{ display: "flex", width: "100%", columnGap: "20px", justifyContent: "center" }}>
                                        <Link to="#" onClick={() => handleApprovalStatusChange(company.companyId, false)}>
                                            <img src={rejectedicon} alt="Reject Icon" />
                                        </Link>
                                        <Link to="#" onClick={() => handleApprovalStatusChange(company.companyId, true)}>
                                            <img src={circlestatusbar} alt="Approve Icon" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminPannel;
