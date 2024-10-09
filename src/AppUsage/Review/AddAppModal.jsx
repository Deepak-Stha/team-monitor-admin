import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseApiURL } from '../../contexts/ApiURL';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../redux/auth/authSlice';
import { Box } from '@mui/material';

const AddAppModal = ({ show, handleClose, handleAddApp }) => {
  const token = useSelector(selectCurrentToken)

  const [appName, setAppName] = useState('');
  const [appWebsite, setAppWebsite] = useState('');
  const [appReview, setAppReview] = useState('PRODUCTIVE');

  const app_review_api = `${BaseApiURL}/app/add-app-review`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appName || !appWebsite) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all fields and upload an app logo.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('appName', appName);
    formData.append('appWebsite', appWebsite);
    formData.append('appReview', appReview);

    try {
      await axios.post(app_review_api, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      });
      handleAddApp();
      handleClose();
      Swal.fire({
        icon: 'success',
        title: 'App Added',
        text: 'The app has been added successfully.'
      });
    } catch (error) {
      console.log('Error adding app', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred'
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} style = {{zIndex:1050}}>
      <Modal.Header >
        <Modal.Title>Add New App</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="appName">
            <Form.Label>App Name</Form.Label>
            <Form.Control
              type="text"
              name='appName'
              placeholder="Enter app name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="appWebsite">
            <Form.Label>App Wbsite</Form.Label>
            <Form.Control
              type="url"
              name='appWebsite'
              placeholder ="Enter App Website"
              onChange={(e) => setAppWebsite(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="appReview">
            <Form.Label>App Review</Form.Label>
            <Form.Control
              as="select"
              name='appReview'
              value={appReview}
              onChange={(e) => setAppReview(e.target.value)}
            >
              <option value="PRODUCTIVE">Productive</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="UNPRODUCTIVE">Unproductive</option>
            </Form.Control>
          </Form.Group>
         <Box sx={{display:"flex"}}> <Button variant="primary" type="submit">
            Add App
          </Button>
          <Button variant="primary"  type="button" onClick={handleClose} >
            Cancel
          </Button>
          </Box>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAppModal;
