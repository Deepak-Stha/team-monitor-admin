import React from "react";
import "../assets/css/howknowaboutus.css";
import { Link } from "react-router-dom";

function HowKnowAboutUs(){
    return(
        <div className="body">
           {/* <!-----MAIN SECTION STARTS FROM HERE--------->   */}
            <section className="main-section">
                <div className="main-container">
                    <div className="main-heading-section">
                        <h2>How did you knew about us?</h2>
                        <p>Provide us your feedback</p>
                        <div className="blue-line"></div>
                    </div>
                    <div className="how-know-aboutus">
                        <div className="every-field">
                            <input type="checkbox" className="checkbox"/>
                            <h3>Google</h3>
                        </div>
                        <div className="every-field">
                            <input type="checkbox" className="checkbox"/>
                            <h3>Youtube</h3>
                        </div>
                        <div className="every-field">
                            <input type="checkbox" className="checkbox"/>
                            <h3>Facebook</h3>
                        </div>
                        <div className="every-field">
                            <input type="checkbox" className="checkbox"/>
                            <h3>Instagram</h3>
                        </div>
                        <div className="every-field">
                            <input type="checkbox" className="checkbox"/>
                            <h3>LinkedIn</h3>
                        </div>
                        <div className="every-field">
                            <input type="checkbox" className="checkbox"/>
                            <h3>Others</h3>
                        </div>
                        <textarea className="textarea-field" placeholder="Please write about it..."></textarea>
                    </div>
                    <div className="last-below-content">
                        <h3>Lets Move Further...</h3>
                        <Link to={`/LetsGetStarted`} className="next-button">Next</Link>
                    </div>
                </div>
            </section>    
            {/* <!-----MAIN SECTION STARTS FROM HERE--------->  */}
        </div>
    )
}

export default HowKnowAboutUs;