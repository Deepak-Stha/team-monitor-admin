import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Bar from "../sidebar/Bar";
import eye from "../assets/images/eye.svg";
import edit from "../assets/images/edit.svg";
import del from "../assets/images/del.svg";
import axios from "axios";
import CreateDepartmentForm from "../components/CreateDepartmentForm";
import UpdateDepartmentForm from "../components/UpdateDepartmentForm";
import EditTeamForm from '../components/EditTeamForm ';
import "../Leave/pagination.css";
import Swal from "sweetalert2";
import { BaseApiURL } from "../contexts/ApiURL";
import TeamEmployeeModal from "../components/TeamEmployeeModal";
import { selectCurrentToken } from "../redux/auth/authSlice";
import { useSelector } from "react-redux";

function MyTeam() {
    const token = useSelector(selectCurrentToken)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateDepartmentModelOpen, setIsUpdateDepartmentModelOpen] = useState(false);
    const [departmentId, setDepartmentId] = useState("");
    const [AllDepartment, setAllDepartment] = useState([]);
    const [getAllCompanyTeam, setGetAllCompanyTeam] = useState([]);
    const [currentPageDepartment, setCurrentPageDepartment] = useState(1);
    const [itemsPerPageDepartment] = useState(10);
    const [currentPageTeam, setCurrentPageTeam] = useState(1);
    const [itemsPerPageTeam] = useState(10);
    const [dataChanged, setDataChanged] = useState(false);
    const [isEmployeeListModalOpen, setIsEmployeeListModalOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [isEditTeamModelOpen, setIsEditTeamModelOpen] = useState(false);
    const [editTeamData, setEditTeamData] = useState(null);
    const [editTeamDepartmentId, setEditTeamDepartmentId] = useState(null);

    const GET_ALL_DEPARTMENT_API = `${BaseApiURL}/department/get-all-department`;
    const GET_ALL_TEAM_OF_COMPANY_API = `${BaseApiURL}/team/get-all-team-of-company`;
    const DELETE_DEPARTMENT_API = `${BaseApiURL}/department/delete-department`;
    const DELETE_TEAM_API = `${BaseApiURL}/team/delete-team`;


    // Functions to handle pagination
    const handlePageChangeDepartment = (pageNumber) => {
        setCurrentPageDepartment(pageNumber);
    };

    const handleShowEmployeeList = (teamId) => {
        setSelectedTeamId(teamId);
        setIsEmployeeListModalOpen(true);
    };
    const handlePageChangeTeam = (pageNumber) => {
        setCurrentPageTeam(pageNumber);
    };

    const openEditTeam = (teamId, departmentId) => {
        setEditTeamData(teamId);
        setEditTeamDepartmentId(departmentId);
        setIsEditTeamModelOpen(true);
        setDataChanged(true);
    };

    const handleGetAllDepartment = async () => {
        try {
            const response = await axios.get(GET_ALL_DEPARTMENT_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.status === 200) {
                setAllDepartment(response.data.departments);
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const handleCreateDepartment = () => {
        setDataChanged(true);
    };

    const handleGetAllTeamOfCompany = async () => {
        try {
            const response = await axios.get(GET_ALL_TEAM_OF_COMPANY_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.status === 200) {
                setGetAllCompanyTeam(response.data.teams);
                setDataChanged(false);
            }
        } catch (error) {
            console.error("Error fetching teams:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message
            });
        }
    };

    const setIndividualDepartmentId = (departmentId) => {
        setIsUpdateDepartmentModelOpen(true);
        setDepartmentId(departmentId);
    };

    const handleDeleteDepartment = async (departmentId) => {
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
                const response = await axios.delete(`${DELETE_DEPARTMENT_API}/${departmentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Department Deleted',
                        text: response.data.message 
                    });
                    handleGetAllDepartment();
                    handleGetAllTeamOfCompany();
                    setDataChanged(true); 
                }
            } catch (error) {
                console.error("Error deleting department:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message
                });
            }
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Cancelled',
                text: 'Your department is safe!'
            });
        }
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

    useEffect(() => {
        handleGetAllDepartment();
        handleGetAllTeamOfCompany();
    }, [dataChanged]);

    const indexOfLastDepartment = currentPageDepartment * itemsPerPageDepartment;
    const indexOfFirstDepartment = indexOfLastDepartment - itemsPerPageDepartment;
    const currentDepartments = AllDepartment.slice(indexOfFirstDepartment, indexOfLastDepartment);

    const indexOfLastTeam = currentPageTeam * itemsPerPageTeam;
    const indexOfFirstTeam = indexOfLastTeam - itemsPerPageTeam;
    const currentTeams = getAllCompanyTeam.slice(indexOfFirstTeam, indexOfLastTeam);

    const pageNumbersDepartment = [];
    for (let i = 1; i <= Math.ceil(AllDepartment.length / itemsPerPageDepartment); i++) {
        pageNumbersDepartment.push(i);
    }

    const pageNumbersTeam = [];
    for (let i = 1; i <= Math.ceil(getAllCompanyTeam.length / itemsPerPageTeam); i++) {
        pageNumbersTeam.push(i);
    }

    const handlePreviousPageDepartment = () => {
        if (currentPageDepartment > 1) {
            setCurrentPageDepartment(currentPageDepartment - 1);
        }
    };

    const handleNextPageDepartment = () => {
        if (currentPageDepartment < pageNumbersDepartment.length) {
            setCurrentPageDepartment(currentPageDepartment + 1);
        }
    };

    const handlePreviousPageTeam = () => {
        if (currentPageTeam > 1) {
            setCurrentPageTeam(currentPageTeam - 1);
        }
    };

    const handleNextPageTeam = () => {
        if (currentPageTeam < pageNumbersTeam.length) {
            setCurrentPageTeam(currentPageTeam + 1);
        }
    };

    return (
        <div>
            <Bar />
            <div className="right-content">
                <div className="upper-right-side">
                    <p style={{
                            fontSize: "2rem ",
                            color: "rgba(0, 0, 0, 0.7)"}}>List of Company Teams</p>
                </div>
                <section className="table-manage-leave-section">
                    <div className="list-of-employes">
                        <table id="styled-table">
                            <thead>
                                <tr>
                                    <th>Team Name</th>
                                    <th>Number of Employees</th>
                                    <th>Team Head</th>
                                    <th>Action </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTeams.length > 0 && currentTeams.map(eachTeamofCompany => (
                                    <tr key={eachTeamofCompany.teamId}>
                                        <td>{eachTeamofCompany.teamName}</td>
                                        <td onClick={() => handleShowEmployeeList(eachTeamofCompany.teamId)} style={{ cursor: "pointer" }}>
                                            {eachTeamofCompany.noOfEmployee}
                                        </td>
                                        <td>{eachTeamofCompany.teamHead}</td>
                                        <td style={{ position: 'relative' }}>
                                            <div style={{ display: "flex", width: "100%", columnGap: "20px", justifyContent: "center" }}>
                                                <Link to={`/team/${(eachTeamofCompany.teamId)}`}>
                                                    <img src={eye} alt="View Icon" />
                                                </Link>
                                                <Link to="#"  onClick={() => openEditTeam(eachTeamofCompany.teamId, eachTeamofCompany.departmentId)}>
                                                    <img src={edit} alt="Edit Icon" />
                                                </Link>
                                                <Link to="#" onClick={() => handleDeleteTeam(eachTeamofCompany.teamId, eachTeamofCompany.departmentId)} >
                                                    <img src={del} alt="Delete Icon" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button style={{borderRadius: "25px"}} onClick={handlePreviousPageTeam} disabled={currentPageTeam === 1}>&laquo; Previous</button>
                            {pageNumbersTeam.map(number => (
                                <button key={number} onClick={() => handlePageChangeTeam(number)} className={number === currentPageTeam ? 'active' : ''}>
                                    {number}
                                </button>
                            ))}
                            <button style={{borderRadius: "25px"}} onClick={handleNextPageTeam} disabled={currentPageTeam === pageNumbersTeam.length}>Next &raquo;</button>
                        </div>
                    </div>
                </section>

                <div className="center-right-side">
                    <p style={{
                            fontSize: "2rem",
                            color: "rgba(0, 0, 0, 0.7)"}}>List of Department</p>
                    <button onClick={() => setIsCreateModalOpen(!isCreateModalOpen)} style={{marginBottom: "10px"}}>Add Department</button>
                </div>

                <section className="table-manage-leave-section">
                    <div className="list-of-employes">
                        <table id="styled-table">
                            <thead>
                                <tr>
                                    <th>Department Name</th>
                                    <th>No of Teams</th>
                                    <th>Department Head</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDepartments.length > 0 && currentDepartments.map((singleDepartment, i) => (
                                    <tr key={i}>
                                        <td>{singleDepartment.departmentName}</td>
                                        <td>{singleDepartment.noOfTeams}</td>
                                        <td>{singleDepartment.departmentHead}</td>
                                        <td style={{ position: 'relative' }}>
                                            <div style={{ display: "flex", width: "100%", columnGap: "20px", justifyContent: "center" }}>
                                                <Link to={`/department/${singleDepartment.departmentId}`}>
                                                    <img src={eye} alt="View Icon" />
                                                </Link>
                                                <Link to="#" onClick={() => setIndividualDepartmentId(singleDepartment.departmentId)}>
                                                    <img src={edit} alt="Edit Icon" />
                                                </Link>
                                                <Link to="#" onClick={() => handleDeleteDepartment(singleDepartment.departmentId)}>
                                                    <img src={del} alt="Delete Icon" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button style={{borderRadius: "25px"}}  onClick={handlePreviousPageDepartment} disabled={currentPageDepartment === 1}>&laquo; Previous</button>
                            {pageNumbersDepartment.map(number => (
                                <button key={number} onClick={() => handlePageChangeDepartment(number)} className={number === currentPageDepartment ? 'active' : ''}>
                                    {number}
                                </button>
                            ))}
                            <button style={{borderRadius: "25px"}}  onClick={handleNextPageDepartment} disabled={currentPageDepartment === pageNumbersDepartment.length}>Next &raquo;</button>
                        </div>
                    </div>
                </section>
            </div>

            {isCreateModalOpen && (
                <CreateDepartmentForm 
                    isOpen={isCreateModalOpen} 
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreateChange={handleCreateDepartment}
                />
            )}

            {isUpdateDepartmentModelOpen && (
                <UpdateDepartmentForm 
                    isOpen={isUpdateDepartmentModelOpen} 
                    onClose={() => setIsUpdateDepartmentModelOpen(false)} 
                    departmentId={departmentId} 
                    getAllDepartment={handleGetAllDepartment}
                />
            )}

            <TeamEmployeeModal 
                teamId={selectedTeamId} 
                isOpen={isEmployeeListModalOpen} 
                onClose={() => setIsEmployeeListModalOpen(false)} 
            />

            {isEditTeamModelOpen && (
                <EditTeamForm
                    isOpen={isEditTeamModelOpen}
                    onClose={() => setIsEditTeamModelOpen(false)}
                    teamData={editTeamData}
                    departmentId={editTeamDepartmentId}
                />
            )}
        </div>
    );
}

export default MyTeam;
