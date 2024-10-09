
import React, { useEffect, useState } from 'react';
import Bar from '../../sidebar/Bar';
import axios from 'axios';
import './ReviewApp.css'; 
import Swal from 'sweetalert2';
import AddAppModal from './AddAppModal'; 
import { BaseApiURL, url } from '../../contexts/ApiURL';
import TablePagination from '@mui/material/TablePagination';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../redux/auth/authSlice';

const ReviewApp = () => {
  const token = useSelector(selectCurrentToken)
  const [allApp, setAllApp] = useState([]);
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const GET_ALL_APP_API = `${BaseApiURL}/app/get-company-app`;
  const UPDATE_APP_API = `${BaseApiURL}/app/update-appReview`;

  const openAddApp = () => {
    setIsAddAppModalOpen(true);
  };

  const closeAddAppModal = () => {
    setIsAddAppModalOpen(false);
  };

  const handle_get_all_app = async () => {
    try {
      const response = await axios.get(GET_ALL_APP_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setAllApp(response.data.allapp);
      
    } catch (error) {
      console.log("Error while fetching all apps", error);
    }
  };

  useEffect(() => {
    handle_get_all_app();
  }, []);

  const handleAppTypeChange = async (appId, newType, appName) => {
    try {
      const response = await axios.put(`${UPDATE_APP_API}`, { appReview: newType, appName: appName }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setAllApp(prevApps =>
        prevApps.map(app =>
          app.appId === appId ? { ...app, appType: newType } : app
        )
      );
      if (response.data.message) {
        Swal.fire({
          icon: 'success',
          title: 'App Status Updated Successfully',
          text: 'App Status has been updated successfully'
        });
      }
      handle_get_all_app();
    } catch (error) {
      console.log("Error while updating app type", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred'
      });
    }
  };

  const handleAddApp = () => {
    handle_get_all_app();
    closeAddAppModal();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Bar />
      <div className="right-content">
        <div className="right-main-upper-content">
          <div className="holidays">
            <h6>Reviewed Apps</h6>
            <p className="page">Manage all the apps used in your organization</p>
          </div>
          <button className="addApp" style={{marginLeft:"500px", border: "1px solid rgba(0, 0, 0, 0.3)",borderRadius: "5px"}} onClick={openAddApp}>Add APP</button>
        </div>
        <section className="table-manage-leave-section">
          <div className="Reviewed-apps">
            <table id="styled-table" className="custom-table">
            <thead >
              <tr>
                <th className="sn-column">SN</th>
                <th>Apps</th>
                <th>App Type</th>
              </tr>
            </thead>
            <tbody style={{backgroundColor:"white" , borderRight:"none"}}>
              {allApp?.length > 0 && allApp.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((app,i) => (
                <tr key={i}>
                  <td style={{backgroundColor:"white" }}>{i+1}</td>
                  <td style={{backgroundColor:"white"}}><img src={`${url}/${app.appLogo}`} alt="App Logo" /> {app.appName}</td>
                  <td style={{backgroundColor:"white"}}>
                    <div className="app-type-holidays">
                      <button
                      style={{marginLeft:"485px"}}
                        className={`${app.appReview === 'PRODUCTIVE' ?"progress-productive" : "app-bttton-review"}`}
                        onClick={() => handleAppTypeChange(app.appId, 'PRODUCTIVE',app.appName)}
                      >
                        Productive
                      </button>
                      <button
                      style={{marginLeft:"35px"}}
                        className={` ${app.appReview === 'NEUTRAL' ? 'progress-neutral':"app-bttton-review"}`}
                        onClick={() => handleAppTypeChange(app.appId, 'NEUTRAL',app.appName)}
                      >
                        Neutral
                      </button>
                      <button
                      style={{marginLeft:"35px"}}
                        className={`${app.appReview === 'UNPRODUCTIVE' ? "progress-unproductive" : "app-bttton-review "}`}
                        onClick={() => handleAppTypeChange(app.appId, 'UNPRODUCTIVE',app.appName)}
                      >
                        Unproductive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>
        <TablePagination
          rowsPerPageOptions={[8]}
          component="div"
          count={allApp.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ position: 'sticky', bottom: 10, backgroundColor: '#fff', zIndex: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
        />
        </div>
        <AddAppModal
          show={isAddAppModalOpen}
          handleClose={closeAddAppModal}
          handleAddApp={handleAddApp}
        />
      {/* </div> */}
    </>
  );
}

export default ReviewApp;


