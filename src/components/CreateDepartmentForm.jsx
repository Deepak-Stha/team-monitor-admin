import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseApiURL } from '../contexts/ApiURL';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/auth/authSlice';

const CreateDepartment = ({ isOpen, onClose, onCreateChange }) => {
  const token = useSelector(selectCurrentToken)
  const [departmentData, setDepartmentData] = useState({
    departmentName: '',
    noOfTeams: ''
  });
  const [teams, setTeams] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const CREATE_DEPARTMENT_API = `${BaseApiURL}/department/create-department`;
  const CREATE_TEAMS_API = `${BaseApiURL}/team/create-team`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'noOfTeams') {
      const numberOfTeams = parseInt(value, 10);
      if (!isNaN(numberOfTeams) && numberOfTeams <= 7) {
        setDepartmentData({ ...departmentData, [name]: value });
        setTeams(Array(numberOfTeams).fill({ teamName: '' }));
      } else if (numberOfTeams > 7) {
        alert("The maximum number of teams is 7.");
      } else {
        setDepartmentData({ ...departmentData, [name]: value });
        setTeams([]);
      }
    } else {
      setDepartmentData({ ...departmentData, [name]: value });
    }
  };

  const handleTeamChange = (index, e) => {
    const { value } = e.target;
    const newTeams = [...teams];
    newTeams[index] = { teamName: value };
    setTeams(newTeams);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { departmentName, noOfTeams } = departmentData;
      const preparedDepartmentData = {
        departmentName,
        noOfTeams: isNaN(parseInt(noOfTeams)) ? null : parseInt(noOfTeams),
      };

      const departmentResponse = await axios.post(CREATE_DEPARTMENT_API, preparedDepartmentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (departmentResponse.data.department && departmentResponse.data.department.departmentId) {
        const newDepartmentId = departmentResponse.data.department.departmentId;

        const teamPromises = teams.map(team => axios.post(CREATE_TEAMS_API, { ...team, departmentId: newDepartmentId }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }));

        await Promise.all(teamPromises);

        Swal.fire({
          icon: 'success',
          title: 'Department and Teams Added',
          text: 'Department and all teams have been added successfully'
        });
        onCreateChange();
        onClose();
        
      } else {
        throw new Error('Failed to retrieve department ID');
      }
    } catch (error) {
      console.error("Error adding department or teams", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred'
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <input
              type="text"
              name="departmentName"
              placeholder='Department Name'
              value={departmentData.departmentName}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="noOfTeams"
              placeholder='No of Teams (max 7)'
              value={departmentData.noOfTeams}
              onChange={handleInputChange}
              required
            />
          </div>
        );
      case 1:
        return (
          <div>
            {teams.map((team, index) => (
              <div key={index} className="team-input">
                <input
                  type="text"
                  value={team.teamName}
                  placeholder="Team Name"
                  onChange={(e) => handleTeamChange(index, e)}
                  required
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Close modal if clicked outside the modal-content
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2 style={{ color: "black" }}>Add Department</h2>
        <form onSubmit={currentStep === 1 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          {renderStep()}
          <div className="modal-buttons">
            {currentStep > 0 && <button type="button" onClick={prevStep}>Back</button>}
            {currentStep < 1 ? <button type="submit">Next</button> : <button type="submit">Save Changes</button>}
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartment;
