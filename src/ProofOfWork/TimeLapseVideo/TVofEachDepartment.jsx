
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Bar from "../../sidebar/Bar";
import "../../assets/css/screenshot.css";
import monitoring from "../../assets/images/monitoring.svg";
import axios from "axios";
import { BaseApiURL, url } from "../../contexts/ApiURL";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { selectCurrentToken } from "../../redux/auth/authSlice";
import { useSelector } from "react-redux";

function TvofEachDepartment() {
    const token = useSelector(selectCurrentToken)

    const GET_ALL_VIDEO_API = `${BaseApiURL}/timelapsevideo/getallvideoofDay`
    const GET_VIDEOS_BY_DATE_API = `${BaseApiURL}/timelapsevideo/get-video-of-specific-day`

    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("all-departments");
    const [selectedDate, setSelectedDate] = useState("");

    // Fetch all videos initially
    const fetchInitialData = async () => {
        try {
            const response = await axios.get(GET_ALL_VIDEO_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const allVideos = response.data.timeLapseVideo;
            setVideos(allVideos);
            setFilteredVideos(allVideos);

            // Extract unique department names
            const uniqueDepartments = [...new Set(allVideos.map(video => video.department.departmentName))];
            setDepartments(uniqueDepartments);
        } catch (error) {
            console.error("Error while fetching initial data", error);
        }
    };

    // Fetch videos based on selected date
    const fetchDataByDate = async (date) => {
        try {
            const response = await axios.get(`${GET_VIDEOS_BY_DATE_API}/${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const videosByDate = response.data.getVideo; // Use the correct key here
            setVideos(videosByDate);
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
        // Apply department filter
        const filtered = videos.filter(video => 
            selectedDepartment === "all-departments" || video.department.departmentName === selectedDepartment
        );
        setFilteredVideos(filtered);
    }, [selectedDepartment, videos]);

    const handleLatestUpdates = () => {
        // Sort filtered videos by time in descending order
        const sortedVideos = [...filteredVideos].sort((a, b) => new Date(b.time) - new Date(a.time));
        setFilteredVideos(sortedVideos);
    };

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <div>
            <Bar />
            <div className="right-content">
                <div className="right-main-upper-content">
                    <div className="holidays">
                        <h6>Time Lapse Video of Work/IT Department</h6>
                        <p className="page">Manage all the time lapse videos of work in your organization</p>
                    </div>
                    <div className="down" style={{ gap: "20px" }}>
                        {/* <div className="date-picker-input">
                            <img src={monitoring} alt="Monitor Live" />
                            <span>Monitor Live</span>
                        </div> */}

                        <input type="date" className="date-picker-input" value={selectedDate} onChange={handleDateChange} />

                        {/* <button className="latest-updt-btn" style={{cursor:"pointer"}} onClick={handleLatestUpdates}>Latest Updates</button> */}

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

                        {/* <div>
                            <select id="department-selector" value={selectedDepartment} onChange={handleDepartmentChange}>
                                <option value="all-departments">All Departments</option>
                                {departments.map((department, index) => (
                                    <option key={index} value={department}>{department}</option>
                                ))}
                            </select>
                        </div> */}
                    </div>
                </div>

                

                <div className="video-cont">
                    {filteredVideos?.length > 0 ? (
                        filteredVideos.map((video) => (
                            <div key={video.timeLapseVideoId} className="video-item">
                                {video.videoLink.includes('youtube.com') ? (
                                    <iframe
                                        width="560"
                                        height="315"
                                        // src={`${url}/${new URL(video.videoLink).searchParams.get('v')}`}
                                        src={`${url}/${video.videoLink}`}

                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <video controls>
                                        <source src={`${url}/${video.videoLink}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                <div className="video-info">
                                    <span className="name">{video.employee.employeeName}</span>
                                    <span className="time">{new Date(video.time).toLocaleString()}</span> 
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No videos available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TvofEachDepartment;


