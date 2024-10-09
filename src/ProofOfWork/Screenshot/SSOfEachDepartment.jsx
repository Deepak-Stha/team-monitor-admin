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
const Modal = ({ isOpen, onClose, imageSrc }) => {
    if (!isOpen) return null;

    return (
        <div className="screenshot">
            <div className="screenshot-content">
                <span className="close-btn" onClick={onClose}>&times;</span>
                <img src={imageSrc} alt="screenshot"  />
            </div>
        </div>
    );
};

function SSOfEachDepartment() {
    const token = useSelector(selectCurrentToken)

    const GET_ALL_SCREENSHOT_API = `${BaseApiURL}/screenshot/get-screenshot-of-day`
    const GET_SCREENSHOT_BY_DATE_API = `${BaseApiURL}/screenshot/get-screenshot-of-specific-date`

    const [screenshots, setScreenshots] = useState([]);
    const [filteredScreenshots, setFilteredScreenshots] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("all-departments");
    const [selectedDate, setSelectedDate] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedScreenshot, setSelectedScreenshot] = useState(""); 

    const fetchInitialData = async () => {
        try {
            const response = await axios.get(GET_ALL_SCREENSHOT_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const allScreenshots = response.data.screenshots || [];
            // Sort screenshots by time in descending order
            const sortedScreenshots = allScreenshots.sort((a, b) => new Date(b.time) - new Date(a.time));
            setScreenshots(sortedScreenshots);

            // Extract unique department names
            const uniqueDepartments = [...new Set(allScreenshots.map(screenshot => screenshot.department.departmentName))];
            setDepartments(uniqueDepartments);
        } catch (error) {
            console.error("Error while fetching initial data", error);
        }
    };

    const fetchDataByDate = async (date) => {
        try {
            const response = await axios.get(`${GET_SCREENSHOT_BY_DATE_API}/${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const screenshotsByDate = response.data || []; // Handle undefined
            // Sort screenshots by time in descending order
            const sortedScreenshots = screenshotsByDate.sort((a, b) => new Date(b.time) - new Date(a.time));
            setScreenshots(sortedScreenshots);
        } catch (error) {
            console.error("Error while fetching data by date", error);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            fetchDataByDate(selectedDate); // Fetch data based on selected date
        } else {
            fetchInitialData(); // Re-fetch initial data if no date is selected
        }
    }, [selectedDate]);

    useEffect(() => {
        if (Array.isArray(screenshots)) {
            // Apply department filter
            const filtered = screenshots.filter(screenshot =>
                selectedDepartment === "all-departments" || screenshot.department.departmentName === selectedDepartment
            );
            setFilteredScreenshots(filtered);
        }
    }, [selectedDepartment, screenshots]);

    const handleLatestUpdates = () => {
        // Ensure filtered screenshots are sorted by time in descending order
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

    return (
        <div>
            <Bar />
            <div className="right-content">
                <div className="screenshot-heading-starts">
                    <div className="left-screenshot-heading">
                        <h3>Screenshots of work/IT Department</h3>
                        <p>Manage all the screenshots of work in your organization</p>
                    </div>
                    <div className="right-screenshot-btn">
                        {/* <Link to="http://" className="monitor-btn"><img src={singal} alt=""/>Monitor live</Link> */}
                        <input type="date" className="date" value={selectedDate} onChange={handleDateChange}/>
                        {/* <Link to="#" onClick={handleLatestUpdates} className="latest-updt-btn">Latest Updates</Link> */}
                    
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
                                <div className="card-content">
                                <h3>{screenshot.employee.employeeName}</h3>
                                <p>{new Date(screenshot.time).toLocaleString()}</p> 
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No screenshots available</p>
                )}
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                imageSrc={selectedScreenshot} 
            />
        </div>
    );
}

export default SSOfEachDepartment;
