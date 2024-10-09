import React, { useState, useEffect } from 'react';
import Bar from "../sidebar/Bar";
import { FilterEmployee } from '../components/FilterEmployee';

const OverTimeReport = () => {  

  return (
    <div>
      <Bar />
      <div className="right-content">
        <div className="right-main-upper-content">
          <div className="holidays">
            <h6>Over Time Report</h6>
            <p className="page">Manage all the daily attendance report in your organization</p>
          </div>
        </div>
          <FilterEmployee />          
        </div>
      </div>
  );
};

export default OverTimeReport;


