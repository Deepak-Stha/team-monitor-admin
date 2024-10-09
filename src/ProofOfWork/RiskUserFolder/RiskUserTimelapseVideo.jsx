import React from 'react';
import { url } from '../../contexts/ApiURL';
import './riskUserDetail.css';

const RiskUserTimelapseVideo = ({ videos }) => {
    return (
        <div className="timelapsevideo-card">
            <div className="video-cont">
                {videos.length > 0 ? (
                    videos.map((video, index) => (
                        <div key={index} className="video-item">
                            <video controls>
                                <source src={`${url}/${video.videoLink}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="video-info">
                                <span className="time">{new Date(video.time).toLocaleString()}</span> 
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No timelapse videos available.</p>
                )}
            </div>
        </div>
    );
};

export default RiskUserTimelapseVideo;
