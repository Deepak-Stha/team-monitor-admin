import React, { Suspense, lazy } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import components
import LetsGetStarted from "./Landing/LetsGetStarted";
import HowKnowAboutUs from "./Landing/HowKnowAboutUs";
import MoreAboutYou from "./Landing/MoreAboutyou";
import LoginPage from "./UserAuth/LoginPage";
import ChangePw from "./UserAuth/ChangePw";
import ResetPw from "./UserAuth/ResetPw";
import ForgetPw from "./UserAuth/ForgetPw";
import Dashboard from "./Realtime/Dashboard";
import MyTeam from "./Realtime/MyTeam";
import SingleDepartmentView from "./components/SingleDepartmentView";
import TeamEmployee from "./Realtime/TeamEmployee";
import ScreenshotOfWork from "./ProofOfWork/Screenshot/ScreenshotOfWork";
import SSOfEachDepartment from "./ProofOfWork/Screenshot/SSOfEachDepartment";
import TimelapseVideos from "./ProofOfWork/TimeLapseVideo/TimelapseVideos";
import TvofEachDepartment from "./ProofOfWork/TimeLapseVideo/TVofEachDepartment";
import RealTimeReport from "./ProofOfWork/RealTimeReport";
import Report from "./ProofOfWork/Report";
import RiskUser from "./ProofOfWork/RiskUser";
import Timeline from "./ProofOfWork/Timeline";
import Timesheet from "./ProofOfWork/Timesheet";
import LeaveSummary from "./Leave/LeaveSummary";
import ManageLeave from "./Leave/ManageLeave";
import ManageHoliday from "./Leave/ManageHoliday";
import DailyAttendance from "./Report/DailyAttendance";
import LateClockIn from "./Report/LateClockIn";
import MonthlyAttendance from "./Report/MonthlyAttendance";
import MonthlyInOut from "./Report/MonthlyInOut";
import OverTimeReport from "./Report/OverTimeReport";
import ShiftTimeReport from "./Report/ShiftTimeReport";
import WorkActivityLog from "./Report/WorkActivityLog";
import WorkLoadAnalysis from "./Report/WorkLoadAnalysis";
import AppHistory from "./AppUsage/History/AppHistory";
import IndividualHistory from "./AppUsage/History/IndividualHistory";
import ReviewApp from "./AppUsage/Review/ReviewApp";
import UnReviewed from "./AppUsage/Review/UnReviewed";
import AppSummary from "./AppUsage/AppSummary";
import Setting from "./Settings/Setting";
import Register from "./UserAuth/Register";
import OTPPage from "./UserAuth/OTPPage";
import SuperAdminLogin from "./SuperAdmin/SuperAdminLogin"
import SuperAdminPannel from "./SuperAdmin/SuperAdminPannel";
import DeletedUsers from "./Report/DeletedUsers";
import UsedApp from "./AppUsage/Review/UsedApp";
import ManageEmployee from "./Realtime/ManageEmployee";
import MonthlyInOutReport from "./Report/MonthlyInOutReport";
import ScreenshotOFEachUser from "./ProofOfWork/Screenshot/ScreensotOfEachUser";
import ProtectedRoute from './components/ProtectedRoute'; 
import Validation from './UserAuth/ValidationPage';
import GoogleCallback from './UserAuth/GoogleCallback';
import RiskUserDetails from "./ProofOfWork/RiskUserFolder/RiskUserDetails";
import LeaveRequest from "./Leave/LeaveRequest";
const RiskUserScreenshot = lazy(() => import('./ProofOfWork/RiskUserFolder/RiskUserScreenshot'));
const RiskUserVideo = lazy(() => import('./ProofOfWork/RiskUserFolder/RiskUserTimelapseVideo'));
function App() {

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LetsGetStarted />} />
          <Route path="/LetsGetStarted" element={<LetsGetStarted />} />
          <Route path="/HowKnowAboutUs" element={<HowKnowAboutUs />} />
          <Route path="/MoreAboutYou" element={<MoreAboutYou />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/OTPPage" element={<OTPPage />} />
          <Route path="/ChangePw" element={<ChangePw />} />
          <Route path="/ResetPw" element={<ResetPw />} />
          <Route path="/ForgetPw" element={<ForgetPw />} />
          <Route path="/Validate" element={<Validation/>} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />

          <Route path="/SuperAdminPannel" element={<SuperAdminPannel />} />
          <Route path="/superAdminLogin" element={<SuperAdminLogin />} />

          {/* Protected routes */}
          <Route path="/Dashboard" element={ <ProtectedRoute element={<Dashboard/>} /> } />
          <Route path="/ManageEmployee" element={<ProtectedRoute element={<ManageEmployee />} />} />
          <Route path="/MyTeam" element={<ProtectedRoute element={<MyTeam />} />} />
          <Route path="/department/:id" element={<ProtectedRoute element={<SingleDepartmentView />} />} />
          <Route path="/team/:id" element={<ProtectedRoute element={<TeamEmployee />} />} />

          <Route path="/ScreenshotOfWork" element={<ProtectedRoute element={<ScreenshotOfWork />} />} />
          <Route path="/SSOfEachDepartment" element={<ProtectedRoute element={<SSOfEachDepartment />} />} />
          <Route path="/screenshot-of-each-user" element={<ProtectedRoute element={<ScreenshotOFEachUser />} />} />
          <Route path="/TimelapseVideos" element={<ProtectedRoute element={<TimelapseVideos />} />} />
          <Route path="/TvofEachDepartment" element={<ProtectedRoute element={<TvofEachDepartment />} />} />
          <Route path="/RealTimeReport" element={<ProtectedRoute element={<RealTimeReport />} />} />
          <Route path="/Report" element={<ProtectedRoute element={<Report />} />} />
          <Route path="/RiskUser" element={<ProtectedRoute element={<RiskUser />} />} />
          <Route path="/Timeline" element={<ProtectedRoute element={<Timeline />} />} />
          <Route path="/Timesheet" element={<ProtectedRoute element={<Timesheet />} />} />
          <Route path="/RiskUserDetails" element={<ProtectedRoute element={<RiskUserDetails />} />} />
          <Route path="/RiskUserScreenshot" element={<ProtectedRoute element={<RiskUserScreenshot />} />} />
          <Route path="/RiskUserVideo" element={<ProtectedRoute element={<RiskUserVideo />} />} />

          <Route path="/LeaveSummary" element={<ProtectedRoute element={<LeaveSummary />} />} />
          <Route path="/ManageLeave" element={<ProtectedRoute element={<ManageLeave />} />} />
          <Route path="/leave-request/:leaveId" element={<ProtectedRoute element={<LeaveRequest />} />} />
          <Route path="/ManageHoliday" element={<ProtectedRoute element={<ManageHoliday />} />} />

          <Route path="/DailyAttendance" element={<ProtectedRoute element={<DailyAttendance />} />} />
          <Route path="/LateClockIn" element={<ProtectedRoute element={<LateClockIn />} />} />
          <Route path="/MonthlyAttendance" element={<ProtectedRoute element={<MonthlyAttendance />} />} />
          <Route path="/MonthlyInOut" element={<ProtectedRoute element={<MonthlyInOut />} />} />
          <Route path="/monthly-in-out" element={<ProtectedRoute element={<MonthlyInOutReport />} />} />
          <Route path="/OverTimeReport" element={<ProtectedRoute element={<OverTimeReport />} />} />
          <Route path="/deletedUsers" element={<ProtectedRoute element={<DeletedUsers />} />} />
          <Route path="/ShiftTimeReport" element={<ProtectedRoute element={<ShiftTimeReport />} />} />
          <Route path="/WorkActivityLog" element={<ProtectedRoute element={<WorkActivityLog />} />} />
          <Route path="/WorkLoadAnalysis" element={<ProtectedRoute element={<WorkLoadAnalysis />} />} />

          <Route path="/AppHistory" element={<ProtectedRoute element={<AppHistory />} />} />
          <Route path="/IndividualHistory" element={<ProtectedRoute element={<IndividualHistory />} />} />
          <Route path="/ReviewApp" element={<ProtectedRoute element={<ReviewApp />} />} />
          <Route path="/UnReviewed" element={<ProtectedRoute element={<UnReviewed />} />} />
          <Route path="/EmployeeUsedApp/:employeeId" element={<ProtectedRoute element={<UsedApp />} />} />
          <Route path="/AppSummary" element={<ProtectedRoute element={<AppSummary />} />} />

          <Route path="/Setting" element={<ProtectedRoute element={<Setting />} />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;


