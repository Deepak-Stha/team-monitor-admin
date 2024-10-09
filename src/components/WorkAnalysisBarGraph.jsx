import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Label, Legend } from 'recharts';
import axios from 'axios';
import { BaseApiURL } from '../contexts/ApiURL';
import { format } from 'date-fns'; // Import date-fns for formatting
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/auth/authSlice';

const WorkAnalysisBarGraph = () => {
    const token = useSelector(selectCurrentToken)
    const [data, setData] = useState([]);
    const WORK_ANALYSIS_API = `${BaseApiURL}/dashboard/work-analysis`;

    const fetchWorkAnalysis = async () => {
        try {
            const response = await axios.get(WORK_ANALYSIS_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            console.log('API Response:', response.data.data); 
            setData(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchWorkAnalysis();
    }, []);

    // Custom tick formatter for XAxis
    const formatXAxis = (tickItem) => {
        return format(new Date(tickItem), 'MM-dd'); 
    };

    return (
        <div>
            {data.length > 0 ? (
                <BarChart data={data} width={800} height={240}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="actualDate" tickFormatter={formatXAxis} style={{fontSize: "0.7rem"}}/>    
                    <YAxis label={{ value: 'No of Employees', angle: -90, position: 'insideBottomLeft' }} style={{fontSize: "0.7rem"}}/>
                    <Tooltip />
                    <Bar dataKey="overUtilized" barSize={15} fill="#003FB6" name="Over Utilized" />
                    <Bar dataKey="healthy" barSize={15} fill="#00A46B" name="Healthy" />
                    <Bar dataKey="lessUtilized" barSize={15} fill="#FF6A61" name="Less Utilized" />
                </BarChart>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

export default WorkAnalysisBarGraph;
