import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Bar from "../../sidebar/Bar";
import "../../assets/css/screenshot.css";
import singal from "../../assets/images/signal-live.svg";
import axios from "axios";
import { BaseApiURL, url } from "../../contexts/ApiURL";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../redux/auth/authSlice";

// Modal component
const SSModal = ({ isOpen, onClose, imageSrc }) => {
    if (!isOpen) return null; // Ensure no hooks are called conditionally


    return(
        <div style={{padding: '20px' , borderRadius: '8px' ,  width: '400px',  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', position: 'relative'}}>
            <div >
                <span>&times</span>
                <img src={imageSrc} alt="Screenshot" />
            </div>
        </div>
    )
};

function ScreenshotOFEachUser() {
    const token = useSelector(selectCurrentToken)

    const GET_ALL_SCREENSHOT_API = `${BaseApiURL}/screenshot/get-screenshot-of-employee-specific-date`

    const [screenshots, setScreenshots] = useState([]);
    const [filteredScreenshots, setFilteredScreenshots] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("all-departments");
    const [selectedDate, setSelectedDate] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedScreenshot, setSelectedScreenshot] = useState("");
    const [employees, setEmployees] = useState([]); 
    const [selectedEmployee, setSelectedEmployee] = useState("");
    console.log(screenshots)


    useEffect(()=>{
        const fetchEmployee = async()=>{

            const employee = await axios.get(`${BaseApiURL}/company/all-employees`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setEmployees(employee?.data?.employees);
            setSelectedEmployee(employee?.data?.employees[0].employeeId)

        }
        fetchEmployee()

    },[token])

    const fetchInitialData = async () => {
        if (!selectedEmployee) return;
        try {
            const response = await axios.get(`${GET_ALL_SCREENSHOT_API}/${selectedEmployee}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                params: { date: selectedDate }
            });
            const allScreenshots = response.data || [];
            setScreenshots(allScreenshots);

            // Extract unique department names
            const uniqueDepartments = [...new Set(allScreenshots.map(screenshot => screenshot.department.departmentName))];
            setDepartments(uniqueDepartments);
        } catch (error) {
            console.error("Error while fetching initial data", error);
        }
    };

    useEffect(() => {
        fetchInitialData(); 
    }, [selectedDate, selectedEmployee]);

    useEffect(() => {
        if (Array.isArray(screenshots)) {
            const filtered = screenshots.filter(screenshot =>
                selectedDepartment === "all-departments" || screenshot.department.departmentName === selectedDepartment
            );
            setFilteredScreenshots(filtered);
        }
    }, [selectedDepartment, screenshots]);

    const handleLatestUpdates = () => {
        const sortedScreenshots = [...filteredScreenshots].sort((a, b) => new Date(b.time) - new Date(a.time));
        setFilteredScreenshots(sortedScreenshots);
    };

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const openModal = (imageSrc) => {
        setSelectedScreenshot(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedScreenshot("");
    };

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
                <div className="screenshot-heading-starts">
                    <div className="left-screenshot-heading">
                        <h3>Screenshots of work</h3>
                        <p>Manage all the screenshots of work in your organization</p>
                    </div>
                    <div className="right-screenshot-btn">
                        <Link to="http://" className="monitor-btn"><img src={singal} alt=""/>Monitor live</Link>
                        <input type="date" className="date" value={selectedDate} onChange={handleDateChange}/>
                        <Link to="#" onClick={handleLatestUpdates} className="latest-updt-btn">Latest Updates</Link>
                    </div>

                    <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                       <select onChange={handleEmployeeSelect}>
                        {
                            employees.map((employee)=>(
                                <option key={employee.employeeId} value={employee.employeeName}>{employee.employeeName}</option>
                            ))
                        }
                       </select>
                    </div>

                    <div>

                        {/* <select id="department-selector" value={selectedDepartment} onChange={handleDepartmentChange}>
                            <option value="all-departments">All Departments</option>
                            {departments?.map((department, index) => (
                                <option key={index} value={department}>{department}</option>
                            ))}
                        </select> */}
                        <FormControl sx={{ minWidth: 120 }}>
                            <Select
                                labelId="department-selector"
                                onChange={handleDepartmentChange}
                                value={selectedDepartment || ""}
                                displayEmpty
                            >
                                <MenuItem value="all-departments">All Department</MenuItem>
                                {departments?.map((department, index) => (
                                    <MenuItem key={index} value={department}>{department}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <div className="main-screenshot-cardbox">
                {filteredScreenshots?.length > 0 ? (
                    filteredScreenshots.map((screenshot) => (
                        <div key={screenshot.screenshotId} className="card-conent">
                            <div className="main-card-content">
                                <img 
                                    src={`${url}/${screenshot.imageLink}`}
                                    alt="Screenshot" 
                                    onClick={() => openModal(`${url}/${screenshot.imageLink}`)} 
                                />
                                <h3>{screenshot.employee.employeeName}</h3>
                                <p>{new Date(screenshot.time).toLocaleString()}</p> 
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No screenshots available</p>
                )}
                </div>
            </div>

            <SSModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                imageSrc={selectedScreenshot} 
            />
        </div>
    );
}

export default ScreenshotOFEachUser;
