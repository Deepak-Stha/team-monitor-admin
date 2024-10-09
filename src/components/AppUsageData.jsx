// src/BarGraph.js
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Label } from 'recharts';
import axios from 'axios';
import { BaseApiURL } from '../contexts/ApiURL';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/auth/authSlice';

const AppUsageData = () => {
  const token = useSelector(selectCurrentToken)
    const [data, setData] = useState([]);
    const APP_ANALYSIS_API = `${BaseApiURL}/dashboard/used-app-analysis`;

    const fetchMostUsedAppAnalysis = async () => {
        // Fetch data from the API
        const fetchData = await axios.get(APP_ANALYSIS_API, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        setData(fetchData.data);
    }

    useEffect(() => {
        fetchMostUsedAppAnalysis();
    }, []);


  return (
    <div>
      {/* <h2>Application Usage Analysis</h2> */}
      {data.length > 0 ? (
        <BarChart width={800} height={240} data={data}>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis dataKey="appName" style={{fontSize: "0.7rem"}}/>
            {/* <Label value="Used Apps" offset={-3} position="insideBottom" /> */}
         {/* </XAxis> */}
          <YAxis label={{ value: 'No of Employees', angle: -90, position: 'insideBottomLeft' }} style={{fontSize: "0.7rem"}}/>
          <Tooltip />
          <Bar dataKey="noOfEmployee" barSize={35} fill="#6f92d6 " />
        </BarChart>
      ) : (
        <p>No app used</p>
      )}
    </div>
  );
};

export default AppUsageData;