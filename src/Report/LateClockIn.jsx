import React from "react";
import Bar from "../sidebar/Bar";
import {LateClockInComponent} from '../components/LateClockInComponent';

function LateClockIn(){
    return(
        <div>
            <Bar/>`
            <div className="right-content">
                <div className="flex-main-heading">
                <div className="manage-desc">
                    <h2 style={{fontSize: "2rem", color: "rgba(0, 0, 0, 0.7)"}}>Late Clock-In </h2>
                    <p>Mange all the late clock in report in your organization</p>
                </div>
            </div>
            {/* <!----------MAIN TABLE SECTION STARTS FROM HERE-----------> */}
            
            <LateClockInComponent/>

            </div>
        </div>
    )
}

export default LateClockIn;