import React from "react";
import Bar from "../../sidebar/Bar";
import { Link } from "react-router-dom";

function UnReviewed(){
    return(
        <div>
            <Bar/> 
            <div className="right-content">
                <div class="right-main-upper-content">
                    <div class="holidays">
                        <h6>Unreviewed Apps</h6>
                        <p class="page">Mange all the app used in your organization</p>
                    </div>
                    <div class="down">
                        {/* <!-- <input type="date" class="date-picker-input"> --> */}
                        <div class="dropdown-containers">
                            <select class="dropdowns">
                                <option value="" disabled selected><p style={{fontWeight:"400", fontSize : "16px", lineHeight:"24px"}}>Unreviewed Apps</p></option>
                                <option value="vacation">App1</option>
                                <option value="business">App2</option>
                                <option value="family">App3</option>
                                <option value="adventure">App4</option>
                            </select>
                            <div class="dropdown-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="Unreviewed-apps">
                    <table>
                        <tr>
                            <th class="app" style={{ textAlign:"left"}} >Apps</th>
                            <th class="actions" style={{ textAlign:"left", paddingLeft:"6px"}} >Select Actions</th>
                        </tr>
                        <tr>
                            <td><Link to="#"><img src="" alt="ChatGPT Logo"/> ChatGPT</Link></td>
                            <td>
                                <div class="action-btns">
                                    <div class="green-btn">Productive</div>
                                    <div class="red-btn">Unproductive</div>
                                    <div class="grey-btn">Neutral</div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div> 
        </div>
    )
}


export default UnReviewed
