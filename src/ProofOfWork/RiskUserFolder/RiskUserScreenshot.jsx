import React from 'react';
import { url } from '../../contexts/ApiURL';

const RiskUserScreenshot = ({ screenshots, openModal }) => {
    return (
        <div className="screenshot-card">
            {screenshots.length > 0 ? (
                screenshots.map((ss, index) => (
                    <div key={index} className="ss-card">
                        <div className="ss-card-content">
                            <img src={`${url}/${ss.imageLink}`} 
                                alt="Screenshot"
                                onClick={() => openModal(`${url}/${ss.imageLink}`)}
                            />
                        </div>
                        <div className="screenshot-info">
                            <span className="time">{new Date(ss.time).toLocaleString()}</span> 
                        </div>
                    </div>
                ))
            ) : (
                <p>No screenshots available.</p>
            )}
        </div>
    );
};

export default RiskUserScreenshot;
