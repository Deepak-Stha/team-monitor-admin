import React from "react";
import "../assets/css/letsgetstarted.css";
import { Link } from 'react-router-dom';


function LetsGetStarted() {
    return(
        <div> 
            {/* <!-----MAIN SECTION STARTS FROM HERE--------->   */}
            <section className="lets-start-section">
                <h1>TEAM-MONITOR</h1>
                <p>The Complete Team Monitoring System</p>
                <Link to={`/LoginPage`} className="lets-start-button">Lets Start Monitoring!</Link>
            </section>   
        </div>
    )
}

export default LetsGetStarted;