import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CreateTeamForm from './CreateTeamForm';
import EditTeamForm from '../components/EditTeamForm ';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import edit from "../assets/images/edit.svg";
import del from "../assets/images/del.svg";
import Bar from '../sidebar/Bar';
import TablePagination from '@mui/material/TablePagination';
import { BaseApiURL } from '../contexts/ApiURL';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/auth/authSlice';

const SingleDepartmentView = () => {
    const token = useSelector(selectCurrentToken)
    const { id } = useParams();

    const [SingleDepartment, setSingleDepartment] = useState({});
    const [getAllDepartmentTeam, setGetAllDepartmentTeam] = useState([]);
    const [isCreateTeamModelOpen, setIsCreateTeamModelOpen] = useState(false);
    const [isEditTeamModelOpen, setIsEditTeamModelOpen] = useState(false);
    const [editTeamData, setEditTeamData] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false); 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const [dataChanged, setDataChanged] = useState(false);
    const [editTeamDepartmentId, setEditTeamDepartmentId] = useState(null);

    const GET_SINGLE_API = `${BaseApiURL}/department/get-department`;
    const GET_ALL_TEAM_API = `${BaseApiURL}/team/get-all-team-of-department`;
    const DELETE_TEAM_API = `${BaseApiURL}/team/delete-team`;

    const handleGetSingleDepartment = async () => {
        const response = await axios.get(`${GET_SINGLE_API}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        if (response.status === 200) {
            setSingleDepartment(response.data.department);
        }
    };

    const handleGetAllTeam = async () => {
        try {
            const response = await axios.get(`${GET_ALL_TEAM_API}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.status === 200) {
                setGetAllDepartmentTeam(response.data.teams);
            }
        } catch (error) {
            console.log("Error while fetching all team data", error);
        }
    };

    const openAddTeam = () => {
        setIsCreateTeamModelOpen(!isCreateTeamModelOpen);
    };

    const openEditTeam = (teamId, departmentId) => {
        setEditTeamData(teamId);
        setEditTeamDepartmentId(departmentId);
        setIsEditTeamModelOpen(true);
        setDataChanged(true);
    };

    const handleDeleteTeam = async (teamId, departmentId) => {
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!'
        });

        if (confirmation.isConfirmed) {
            try {
                const response = await axios.delete(`${DELETE_TEAM_API}/${teamId}/${departmentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                if (response.status === 200) {
                    Swal.fire({
                        icon:'success',
                        title: 'Team Deleted',
                        text: response.data.message
                    });
                    setDataChanged(true);
                }
            } catch (error) {
                console.error("Error deleting team:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message
                });
            }
        }
        else {
            Swal.fire({
                icon: 'info',
                title: 'Cancelled',
                text: 'Your team is safe!'
            });
        }
    }

    const handleDropdownToggle = (teamId) => {
        setDropdownOpen(prevState => prevState === teamId ? null :teamId);
    };

    useEffect(() => {
        handleGetSingleDepartment();
        handleGetAllTeam();
    }, [id, dataChanged]);

    if (!SingleDepartment) {
        return <p>Loading...</p>;
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      }
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    return (
        <div>
            <Bar />
            <div className="right-content">
                <h1 style={{fontSize: "1.5rem", color: "rgba(0, 0, 0, 0.7)"}}>View of Single Department</h1>
                <section className="table-manage-leave-section">
                    <div className="list-of-employes">
                        <table id="styled-table">
                            <thead>
                                <tr>
                                    <th>Department ID</th>
                                    <th>Department Name</th>
                                    <th>No Of Teams</th>
                                    <th>Department Head</th>
                                    <th>Company ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={SingleDepartment.departmentId}>
                                    <td>{SingleDepartment.departmentId}</td>
                                    <td>{SingleDepartment.departmentName}</td>
                                    <td>{SingleDepartment.noOfTeams}</td>
                                    <td>{SingleDepartment.departmentHead}</td>
                                    <td>{SingleDepartment.companyId}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="center-right-side">
                    <p style={{margin: "0px", fontSize: "1.5rem", color: "rgba(0, 0, 0, 0.7)"}}>List of Team</p>
                    <button onClick={openAddTeam} style={{margin: "10px"}}>Add Team</button>
                </div>

                <section className="table-manage-leave-section">
                    <div className="list-of-employes">
                        <table id="styled-table">
                        <thead>
                            <tr>
                                <th>Team Name</th>
                                <th>No of Employees</th>
                                <th>Team Head</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getAllDepartmentTeam.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage ).map(team => (
                                <tr key={team.teamId}>
                                    <td>{team.teamName}</td>
                                    <td>{team.noOfEmployee}</td>
                                    <td>{team.teamHead}</td>
                                    <td style={{ position: 'relative' }}>
                                            <div style={{ display:"flex", width: "100%", columnGap: "20px", justifyContent:"center"}}>
                                                {/* <   */}
                                                <Link to="#" onClick={() => openEditTeam(team.teamId, team.departmentId)}>
                                                    <img src={edit} alt="Edit Icon" />
                                                </Link>
                                                <Link to="#" onClick={() => handleDeleteTeam(team.teamId, team.departmentId)}>
                                                    <img src={del} alt="Delete Icon" />
                                                </Link>
                                            </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </section>

                <TablePagination
                    rowsPerPageOptions={[7]}
                    component="div"
                    count={getAllDepartmentTeam.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={{ position: 'sticky', bottom: 10, backgroundColor: '#fff', zIndex: 0, display: "flex", justifyContent: "center", alignItems: "center"}}
                />

                {isCreateTeamModelOpen && (
                    <CreateTeamForm
                        departmentId={SingleDepartment.departmentId}
                        isOpen={isCreateTeamModelOpen}
                        onClose={openAddTeam}
                        getAllTeam={handleGetAllTeam}
                    />
                )}

                {isEditTeamModelOpen && (
                    <EditTeamForm
                        isOpen={isEditTeamModelOpen}
                        onClose={() => setIsEditTeamModelOpen(false)}
                        teamData={editTeamData}
                        getAllTeam={handleGetAllTeam}
                        departmentId={editTeamDepartmentId}
                    />
                )}
            </div>
        </div>
    );
};

export default SingleDepartmentView;
