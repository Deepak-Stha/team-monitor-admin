import React, { useState, useEffect } from "react";
import SideBar from "../sidebar/Bar";
import axios from 'axios';
import { BaseApiURL } from "../contexts/ApiURL";
import DatePicker from "react-datepicker";
import { BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar, Cell } from 'recharts';
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";
// import { color } from "html2canvas/dist/types/css/types/color";

function Timeline() {
    const token = useSelector(selectCurrentToken)
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [employeeAppData, setEmployeeAppData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    
    const employee_api = `${BaseApiURL}/company/all-employees`;
    const get_employee_used_app_api = `${BaseApiURL}/app/get-employee-used-app`;

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(employee_api, {
                    headers: { 
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json' 
                    }
                });
                setEmployees(response.data.employees);
                setSelectedEmployee(employees.employeeId)
            } catch (error) {
                console.error('Error fetching employees:', error.response ? error.response.data : error.message);
            }
        };
        fetchEmployees();
    }, [employee_api, token]);


    console.log(selectedEmployee)

    useEffect(() => {
        if (selectedEmployee) {
            const handleGetEmployeeAppData = async () => {
                const formattedStartDate = startDate.toISOString().slice(0, 10);
                try {
                    const response = await axios.get(`${get_employee_used_app_api}/${selectedEmployee}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'                
                        },
                        params: { 
                            date: formattedStartDate 
                        }
                    });
                    const data = response.data.employeeUsedAppsOfDay || [];
                    
                    const transformedData = data.map(item => {
                        const totalSeconds = Math.round(item.appUsedDuration / 1000);
                        console.log("fillcolor", getFillColor(item.appType))

                        return {
                            ...item,
                            appUsedDuration: totalSeconds,
                            fillColor: getFillColor(item.appType) 
                        };
                    });
                    setEmployeeAppData(transformedData); 
                    console.log(transformedData)
                } catch (error) {
                    console.error(error);
                }
            };
            handleGetEmployeeAppData();
        } else {
            setEmployeeAppData([]);
        }
    }, [selectedEmployee, get_employee_used_app_api, token, startDate]);

    const getFillColor = (appType) => {
        switch (appType) {
            case 'PRODUCTIVE':
                return '#00A46B';
            case 'NEUTRAL':
                return '#0074D9';
            case 'UNPRODUCTIVE':
                return '#FF4136';
            default:
                return '#6f92d6';
        }
    };

    const handleEmployeeChange = (event) => {
        const selectedValue = event.target.value;
        const selectEmp = employees.find(emp => emp.employeeName === selectedValue);
        if (selectEmp) {
            setSelectedEmployee(selectEmp.employeeId);
        }
    };

    const formatYAxisTicks = (tickValue) => {
        if (tickValue >= 3600) {
            // Convert seconds to hours and minutes
            const hours = Math.floor(tickValue / 3600);
            const minutes = Math.floor((tickValue % 3600) / 60);
            return `${hours}h ${minutes}m`;
        } 
        else if (tickValue >= 60) {
            // Convert seconds to minutes and seconds
            const minutes = Math.floor(tickValue / 60);
            const seconds = tickValue % 60;
            return `${minutes}m ${seconds}s`;
        } 
        else {
            // Display in seconds
            return `${tickValue}s`;
        }
    };

    return (
        <div>
            <SideBar />
            <div className="right-content">
                <div className="right-main-upper-content" style={{display: "flex", alignItems: "center"}}>
                    <div className="holidays">
                        <h6>Timeline</h6>
                        <p className="page" style={{fontSize: "1rem"}}>Manage all the users' timelines in your organization</p>
                    </div>
    
                    <div className="filter-content">
                        <input list="employees"
                            placeholder="Select Employee"
                            onChange={handleEmployeeChange}
                            className="employee-input" 
                            style={{width: "200px" }}
                            id="timelineinput"
                        />
                        <datalist className="data-list" id="employees" >
                            {employees.map(employee => (
                                <option key={employee.employeeId} value={employee.employeeName} />
                            ))}
                        </datalist>
    
                        <DatePicker 
                            selected={startDate} 
                            onChange={(date) => setStartDate(date)}
                            style={{width: "200px"}}
                            id="timelinedatepicker"
                        />

                    </div>
                </div> 
    
                <div className="upper-text">
                    <div className="color-index">
                        <p style={{fontSize: "1rem"}}>Color Index</p>
                    </div>
                    <div className="indexes">
                        <div className="index green">
                            <p>Productive Apps Time</p>
                        </div>
                        <div className="index blue">
                            <p>Neutral Apps Time</p>
                        </div>
                        <div className="index red">
                            <p>Unproductive Apps Time</p>
                        </div>
                        <div className="index brown">
                            <p>Idle Time</p>
                        </div>
                        <div className="index orange">
                            <p>Not in work</p>
                        </div>
                        <div className="index grey">
                            <p>Untracked</p>
                        </div>
                    </div>
                </div>
    
                <div className="timeline-chart">
    {employeeAppData.length > 0 ? (
        <>
            <p style={{ transform: "rotate(-90deg)", color: "rgba(0, 0, 0, 0.7)", fontSize: "1.1rem"}}>Time Spent</p>
            <BarChart width={1400} height={500} data={employeeAppData}>
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="appName" style={{fontSize: "0.9rem"}} />
                <YAxis
                    tickFormatter={formatYAxisTicks}
                    style={{fontSize: "0.9rem"}} 
                />
                <Tooltip formatter={(value) => formatYAxisTicks(value)} />
                <Bar dataKey="appUsedDuration" barSize={35} fill={null} isAnimationActive={false}>
                    {employeeAppData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fillColor} />
                    ))}
                </Bar>
            </BarChart>
        </>
    ) : (
        <p>No data available for the selected employee and date.</p>
    )}
</div>

            </div>
        </div>
    );    
}

export default Timeline;
