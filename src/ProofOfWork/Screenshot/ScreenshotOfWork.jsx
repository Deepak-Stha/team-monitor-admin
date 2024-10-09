import React from "react";
import { Link } from "react-router-dom";
import Bar from "../../sidebar/Bar";
import checking from "../../assets/images/checking.jpg";
import monitering from "../../assets/images/monitoring.svg";


function ScreenshotOfWork(){
    return(
        <div>
            <Bar/>
            <div className="right-content">
                <div className="right-main-upper-content">
                    <div className="holidays">
                        <h6 style={{fontsize: "24px", lineheight: "32px"}}>Screenshots of work</h6>
                        <p className="page">Mange all the screenshots of work  in your organization</p>
                    </div>
                    <div className="down" style={{gap: "20px"}}>
                        <div className="date-picker-input">
                            <img src={monitering} alt="Save Report"/>
                            <span>Monitor Live</span>
                        </div>
                        <input type="date" className="date-picker-input"/>
                        <button>Latest Updates</button>
                    </div>
                </div>
                <div className="grid-containers">
                    <Link to="/SSofEachDepartment">
                        <div className="card">
                            <p>IT Department</p>
                            <img src={checking} className="card-imgs" alt="checking"/>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ScreenshotOfWork