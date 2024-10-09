import React from "react";
import "../assets/css/moreaboutyou.css";
import {Link} from "react-router-dom";

function MoreAboutYou(){
    return(
        <div>
            {/* <!-----MAIN SECTION STARTS FROM HERE--------->   */}
            <section className="main-section">
                <div className="main-container">
                    <div className="main-heading-section">
                        <h2>Let us Know more about you</h2>
                        <p>Welcome to Team - Monitor</p>
                        <div className="blue-line"></div>
                    </div>
                    <div className="more-about-you-content-grid">
                        <div className="more-about-you-content">
                            <h3>Organization Name</h3>
                            <input type="text" className="input-field" placeholder="Please enter your input...."/>
                        </div>
                        <div className="more-about-you-content">
                            <h3>Organization Address</h3>
                            <input type="text" className="input-field" placeholder="Please enter your input...."/>
                        </div>
                        <div className="more-about-you-content">
                            <h3>Organization Employee Size</h3>
                            <input type="text" className="input-field" placeholder="Please enter your input...."/>
                        </div>
                        <div className="more-about-you-content">
                            <h3>Domain for your Organization</h3>
                            <input type="text" className="input-field" placeholder="Please enter your input...."/>
                        </div>
                        <div className="more-about-you-content">
                            <h3>Organization Type</h3>
                            <div className="dropdown">
                                <input type="text" className="input-field dropdown-input" placeholder="Select input"/>
                                <div className="dropdown-arrow">&#x25BE;</div>
                                <ul className="dropdown-menu">
                                    <li>Type 1</li>
                                    <li>Type 2</li>
                                    <li>Type 3</li>
                                </ul>
                            </div>
                        </div>
                        <div className="more-about-you-content">
                            <h3>Province / State</h3>
                            <div className="dropdown">
                                <input type="text" className="input-field dropdown-input" placeholder="Select input"/>
                                <div className="dropdown-arrow">&#x25BE;</div>
                                <ul className="dropdown-menu">
                                    <li>State 1</li>
                                    <li>State 2</li>
                                    <li>State 3</li>
                                </ul>
                            </div>
                        </div>
                        <div className="more-about-you-content">
                            <h3>Select your country</h3>
                            <div className="dropdown">
                                <input type="text" className="input-field dropdown-input" placeholder="Select input"/>
                                <div className="dropdown-arrow">&#x25BE;</div>
                                <ul className="dropdown-menu">
                                    <li>Country 1</li>
                                    <li>Country 2</li>
                                    <li>Country 3</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="last-below-content">
                        <h3>Lets Move Further...</h3>
                        <Link to={`/HowKnowAboutUs`} className="next-button">Next</Link>
                    </div>
                </div>
            </section>    
        </div>
    )
}

export default MoreAboutYou;