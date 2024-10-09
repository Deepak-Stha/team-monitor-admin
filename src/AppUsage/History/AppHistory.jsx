import React, { useState, useEffect } from "react";
import Bar from "../../sidebar/Bar";
import axios from "axios";
import { BaseApiURL } from "../../contexts/ApiURL";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../redux/auth/authSlice";

function AppHistory() {
    const token = useSelector(selectCurrentToken)
    const [allApp, setAllApp] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [selectedEmployee, setSelectedEmployee] = useState("");

    const handle_get_all_app = async () => {
        if (!selectedEmployee) return;

        const formattedStartDate = startDate.toISOString().slice(0, 10);

        try {
            const response = await axios.get(`${BaseApiURL}/app/get-employee-used-app/${selectedEmployee}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                
                params: { date: formattedStartDate }
            });
            setAllApp(response.data.employeeUsedAppsOfDay);
        } catch (error) {
            console.log("Error while fetching all apps", error);
        }
    };

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const employee = await axios.get(`${BaseApiURL}/company/all-employees`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEmployees(employee?.data?.employees);
                setSelectedEmployee(employee?.data?.employees[0].employeeId)
            } catch (error) {
                console.log("Error while fetching employees", error);
            }
        };
        fetchEmployee();
    }, []);

    useEffect(() => {

        handle_get_all_app();
    }, [startDate, selectedEmployee]);

    const handleEmployeeSelect = (e) => {
        const selectedValue = e.target.value;
        const selectedEmp = employees.find(emp => emp.employeeName === selectedValue);
        if (selectedEmp) {
            setSelectedEmployee(selectedEmp.employeeId);
        }
    };

    return (
        <div>
            <Bar />
            <div className="right-content">
                <div className="right-main-upper-content">
                    <div className="holidays">
                        <h6>App History</h6>
                        <p className="page">Manage all the app history in your organization</p>
                    </div>
                </div>
                <div className="date-picker" style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <DatePicker
                    id="datePicker" 
                        selected={startDate} 
                        onChange={(date) => setStartDate(date)} 
                    />

                   <> <input 
                        list="employees" 
                        placeholder="Select Employee"
                        onChange={handleEmployeeSelect}  
                        className="employee-input"
                    />
                    <datalist className="data-list" id="employees">
                        {employees?.length > 0 && employees.map((employee) => (
                            <option key={employee.employeeId} value={employee.employeeName} />
                        ))}
                    </datalist></>
                </div>
                <div className="table-container">
                    <table className="progress-table">
                        <thead>
                            <tr>
                                <th className="user-name">App Name</th>
                                <th>Time</th>
                                <th className="progress-type">Progress Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allApp?.length > 0 ? allApp.map((app) => (
                                <tr key={app.appId}>
                                    <td className="user-name">{app.appName}</td>
                                    <td className="center">{(app.appUsedDuration/ 1000).toFixed(2)} seconds</td>
                                    <td><div className={`${app.appType =="NEUTRAL" ? "progress-neutral": app.appType =="PRODUCTIVE" ? "progress-productive":"progress-unproductive" }`}>{app.appType}</div></td>
                                </tr>
                            )) : <p className="no-data">No data</p> }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AppHistory;
