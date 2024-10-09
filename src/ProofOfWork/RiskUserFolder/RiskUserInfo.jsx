import React from 'react';
import './riskUserDetail.css';

const RiskUserInfo = ({ userDetail, workedDays, lateDays, overtimeDays, leaveApplied, approvedLeave }) => {
    if (!userDetail) return null;

    return (
        <div>
            <div className='user-details'>
                <div className='user-info'>
                    <h5>ID: </h5><p>{userDetail.employeeId}</p>
                </div>
                <div className='user-info'>
                    <h5>Email: </h5><p>{userDetail.employee?.email || 'N/A'}</p> 
                </div>
                <div className='user-info'>
                    <h5>Address: </h5><p>{userDetail.employee?.employeeAddress || 'N/A'}</p> 
                </div>
                <div className='user-info'>
                    <h5>Contact No: </h5><p>{userDetail.employee?.phoneNumber || 'N/A'}</p> 
                </div>
                <div className='user-info'>
                    <h5>Department: </h5><p>{userDetail.department?.departmentName || 'N/A'}</p> 
                </div>
                <div className='user-info'>
                    <h5>Team: </h5><p>{userDetail.employee?.team?.teamName || 'N/A'}</p> 
                </div>
                <div className='user-info'>
                    <h5>Position: </h5><p>{userDetail.employee?.position || 'N/A'}</p> 
                </div>
                
            </div>

            <div className='working-info'>
                <div className='work'>
                    <h5>Total worked days: </h5><p>{workedDays}</p>
                </div>
                <div className='work'>
                    <h5>Total late days: </h5><p>{lateDays}</p>
                </div>
                {/* <div className='work'>
                    <h5>Total overtime hours: </h5><p>{`${overTime.totalHours} hrs, ${overTime.totalMinutes} mins, ${overTime.totalSeconds} secs`}</p>
                </div> */}
                <div className='work'>
                    <h5>Total overtime days: </h5><p>{overtimeDays}</p>
                </div>
                <div className='work'>
                    <h5>Total leave applied: </h5><p>{leaveApplied}</p>
                </div>
                <div className='work'>
                    <h5>Total leave approved: </h5><p>{approvedLeave}</p>
                </div>
            </div>
        </div>
    );
};

export default RiskUserInfo;
