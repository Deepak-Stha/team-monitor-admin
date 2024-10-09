import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Bar from '../sidebar/Bar';
import { BaseApiURL } from '../contexts/ApiURL';
import TablePagination from '@mui/material/TablePagination';
import { selectCurrentToken } from '../redux/auth/authSlice';
import { useSelector } from 'react-redux';

const DeletedUsers = () => {
  const token = useSelector(selectCurrentToken)
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const GET_ALL_DELETED_EMPLOYEE_API = `${BaseApiURL}/riskuser/get-all-deleatedEmployee`

  const handle_get_all_deleted_employees = async () => {
    try {
      const response = await axios.get(GET_ALL_DELETED_EMPLOYEE_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setDeletedUsers(response.data.allInactiveUser);
    } catch (error) {
      console.error("Error fetching deleted users", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  useEffect(() => {
    handle_get_all_deleted_employees();
  }, []);

  return (
    <>
    <Bar/>
    <div className='right-content'>
      <h1>Deleted Users</h1>
      <div className="table-container">
        <section className="table-manage-leave-section">
            <div className="list-of-employes">
              <table id="styled-table">
                <thead>
                  <tr>
                    <th>SN</th>
                    <th>Employee Name</th>
                    <th>Deleted At</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedUsers.length > 0 ? (
                    deletedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, i) => (
                      <tr key={user.id} className="tr-table-leave">
                        <td>{i + 1}</td>
                        <td>{user.employeeName}</td>
                        <td>{new Date(user.addedAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No deleted users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
      </div>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={deletedUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ position: 'sticky', bottom: 10, backgroundColor: '#fff', zIndex: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
      />
    </div>
    </>
  );
}

export default DeletedUsers;
