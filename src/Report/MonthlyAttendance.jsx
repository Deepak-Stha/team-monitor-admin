import Bar from '../sidebar/Bar';
import { MonthlyAttendanceComponent } from '../components/MonthlyAttendanceComponent';
import { selectCurrentToken } from '../redux/auth/authSlice';
import { useSelector } from 'react-redux';

const MonthlyAttendance = () => {
  const token = useSelector(selectCurrentToken)

  return (
    <div>
      <Bar />
      <div className="right-content">
        <div className="right-main-upper-content">
          <div className="holidays">
            <h6>Monthly Attendance Report</h6>
            <p className="page">Manage all the daily attendance report in your organization</p>
          </div>
          <div className="down"></div>
        </div>
        

        <div style={{  }}>
          <MonthlyAttendanceComponent />
        </div>

      </div>
    </div>
  );
};

export default MonthlyAttendance;
