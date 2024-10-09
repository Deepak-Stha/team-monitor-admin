import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Bar from '../../sidebar/Bar';
import DatePicker from "react-datepicker";
import { BaseApiURL } from '../../contexts/ApiURL';
import { useParams } from 'react-router-dom'; // Import useParams hook
import { selectCurrentToken } from '../../redux/auth/authSlice';
import { useSelector } from 'react-redux';

const UsedApp = () => {
  const { employeeId } = useParams(); 
  const token = useSelector(selectCurrentToken)
  const GET_EMPLOYEE_USED_APP_API = `${BaseApiURL}/app/get-employee-used-app`;
  const [employeeAppData, setEmployeeAppData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const handleGetEmployeeAppData = async () => {
    const formattedStartDate = startDate.toISOString().slice(0, 10);
    try {
      const response = await axios.get(`${GET_EMPLOYEE_USED_APP_API}/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'                
        },
        params: { date: formattedStartDate }
      });
      setEmployeeAppData(response.data.employeeUsedAppsOfDay || []); 
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // if (employeeId) {  
      handleGetEmployeeAppData();
    // }
  }, [startDate, employeeId]);

  return (
    <>
      <Bar/>
      <div className='right-content'>
        <h1>Employee App Usage</h1>
        <DatePicker 
          selected={startDate} 
          onChange={(date) => setStartDate(date)} 
        />

      <section className="table-manage-leave-section">
        <div className="list-of-employes">
          {employeeAppData.length > 0 ? (
            <table id="styled-table">
              <thead>
                <tr>
                  <th>App Name</th>
                  <th>App Used Duration</th>
                  <th>App Type</th>
                </tr>
              </thead>
              <tbody>
                {employeeAppData.map((appData) => (
                  <tr key={appData.appId}>
                    <td>
                      <img src={appData.appLogo} alt={appData.appName} style={{ width: '30px', height: '30px' }} />
                      {appData.appName}
                    </td>
                    <td>{appData.appUsedDuration}</td>
                    <td>{appData.appType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            ) : (
              <p>No data available or Loading...</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default UsedApp;
