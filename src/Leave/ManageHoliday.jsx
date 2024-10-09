import React, { useEffect, useState } from 'react';
import Bar from '../sidebar/Bar';
import edit from '../assets/images/edit.svg';
import del from '../assets/images/del.svg';
import { Link } from "react-router-dom";
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EditModal from '../components/EditModal';
import Modal from '../components/Modal'; 
import '../assets/css/model.css'; 
import Swal from 'sweetalert2';
import { BaseApiURL } from '../contexts/ApiURL';
import TablePagination from '@mui/material/TablePagination';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/auth/authSlice';

const ManageHoliday = () => {
  const API = `${BaseApiURL}/holiday/get-all-holiday`
  const DELETE_API = `${BaseApiURL}/holiday/delete-holiday`
  const token = useSelector(selectCurrentToken)

  const [holidays, setHolidays] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editHolidayId, setEditHolidayId] = useState(null);
  const [selectedHolidayType, setSelectedHolidayType] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State to trigger data re-fetch
  const [dataChanged, setDataChanged] = useState(false);

  // Toggle for Add Holiday Modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Toggle for Edit Holiday Modal
  const toggleEditModal = (holidayId) => {
    setEditHolidayId(holidayId);
    setIsEditOpen(!isEditOpen);
  };

  // Fetch holidays from the API
  const getHolidays = async () => {
    try {
      const response = await axios.get(API, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.status === 200) {
        setHolidays(response.data.allHolidays);
        setFilteredHolidays(response.data.allHolidays); 
        setDataChanged(false); 
      }
    } catch (error) {
      console.error("Error while fetching data", error);
    }
  };

  // Delete a holiday
  const handleDeleteHolidays = async (holidayId) => {
    try {
      const response = await axios.delete(`${DELETE_API}/${holidayId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 200) {
        // Update local state to remove the deleted holiday
        setHolidays(prevHolidays => prevHolidays.filter((holiday) => holiday.holidayId !==holidayId));
        setFilteredHolidays(prevHolidays => prevHolidays.filter((holiday) => holiday.holidayId !== holidayId));

        Swal.fire({
          icon: 'success',
          title: 'Holiday Deleted',
          text: response.data.message
        });

        setDataChanged(true);

      } else {
        console.error("Failed to delete holiday. Status:", response.status);
      }

    } catch (error) {
      console.error("Error deleting holiday:", error);
    }
  };

  // Handle filter change
  const handleHolidayTypeChange = (e) => {
    const type = e.target.value;
    setSelectedHolidayType(type);
    
    if (type === "all-holiday" || type === "") {
      setFilteredHolidays(holidays);
    } else {
      setFilteredHolidays(holidays.filter(holiday => holiday.holidayType === type));
    }
  };

  useEffect(() => {
    getHolidays();
  }, [dataChanged]); 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const handleHolidayAdded = () => {
    setDataChanged(true); 
  };

  const handleHolidayEdited = () => {
    setDataChanged(true); 
  };

  return (
    <div>
      <Bar />
      <div className="right-content">
        <div className="flex-main-heading">
          <div className="manage-desc">
            <h2>Manage Holiday</h2>
            <p>Manage all the holidays in your organization</p>
          </div>
          <div style={{display:'flex'}}>
            <FormControl sx={{ minWidth: 120 }}>
                <Select
                  labelId="holiday-type-select-label"
                  onChange={handleHolidayTypeChange}
                  value={selectedHolidayType || ""}
                  displayEmpty
                >
                  <MenuItem value="">All Holiday</MenuItem>
                  <MenuItem value="PUBLIC">Public</MenuItem>
                  <MenuItem value="PRIVATE">Private</MenuItem>
                  <MenuItem value="OFFICIAL">Official</MenuItem>
                </Select>
              </FormControl>
              <div className="center-right-side">
                <button onClick={toggleModal}>Add Holiday</button>
              </div>
          </div>
        </div>
        
        <section className="table-manage-leave-section">
          <div className="list-of-employes">
            <table id="styled-table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Holiday Title</th>
                  <th>Holiday Type</th>
                  <th>Holiday Session</th>
                  <th>Holiday From Date</th>
                  <th>Holiday To Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHolidays.length > 0 ? (
                  filteredHolidays.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((holiday, i) => (
                    <tr key={holiday.holidayId}>
                      <td>{i + 1}</td>
                      <td>{holiday.holidayTitle}</td>
                      <td>{holiday.holidayType}</td>
                      <td>{holiday.holidaySession}</td>
                      <td>{holiday.fromDate.split('T')[0]}</td>
                      <td>{holiday.toDate.split('T')[0]}</td>
                      <td>
                          <Link onClick={() => toggleEditModal(holiday.holidayId)}>
                            <img src={edit} alt="Edit" /> 
                          </Link>
                          <Link onClick={() => handleDeleteHolidays(holiday.holidayId)}>
                            <img src={del} alt="Delete" /> 
                          </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No holidays available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={filteredHolidays.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ position: 'sticky', bottom: 10, backgroundColor: '#fff', zIndex: 0 , display: 'flex', justifyContent: 'center' , alignItems: 'center'}}
        />
      </div>
      {isEditOpen && (
        <EditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          holidayId={editHolidayId}
          onEditHoliday={handleHolidayEdited}
        />
      )}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={toggleModal}
          onAddHoliday={handleHolidayAdded} 
        />
      )}
    </div>
  );
};

export default ManageHoliday;