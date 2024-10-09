import axios from 'axios'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import { BaseApiURL } from '../contexts/ApiURL';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/auth/authSlice';

const CreateTeamForm = ({isOpen, onClose, departmentId,getAllTeam}) => {

  const token = useSelector(selectCurrentToken)
    // const{id} = useParams
    console.log(departmentId,"hello")

    // states for form data
    const [teamData, setTeamData] = useState({
      teamName : '',
      departmentId: departmentId
    })


    const CREATE_TEAM_API = `${BaseApiURL}/team/create-team`;



    // handle input change


    const handleInputChange = (e) =>{

      const{name, value} = e.target 
      setTeamData({...teamData, [name]: value})
    }


    const handleSubmit = async(e) =>{
      e.preventDefault()

      try {

        const createTeamResponse = await axios.post(CREATE_TEAM_API,teamData,{
          headers:{
            'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
          }
        })

        
        if (createTeamResponse.data.message) {
        Swal.fire({
                icon: 'success',
                title: 'Team Added',
                text: createTeamResponse.status.message
            });
            getAllTeam()
        onClose();
      }
        
       


        onClose()
        
      } catch (error) {

        console.log("Error While Fetching data", error)
        Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.response.data.message
                    });
      }
    }

if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{color:"black"}}>Add Department</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="teamName"
            placeholder=" Team Name"
            onChange={handleInputChange}
            required
          />
          <div className="modal-buttons">
            <button type="submit" onClick={handleSubmit}>Save Changes</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTeamForm