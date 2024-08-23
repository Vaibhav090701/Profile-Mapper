import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, TextField, Typography, Card, CardContent, Grid, Alert, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { debouncedGetCoordinatesFromAddress } from './GeoCode';

function AdminPanel() {
  const [profiles, setProfiles] = useState([]);
  const [newProfile, setNewProfile] = useState({
    name: '',
    photoUrl: '',
    address: '',
    latitude: '',
    longitude: '',
    interest:'',
    contact:'',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/profiles')
      .then(response => setProfiles(response.data))
      .catch(error => console.error('Error fetching profiles:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const address = e.target.value;
    
    setNewProfile(prevProfile => ({
      ...prevProfile,
      address
    }));

    debouncedGetCoordinatesFromAddress(address, (result, errorMsg) => {
      if (result) {
        const { latitude, longitude } = result;
        setNewProfile(prevProfile => ({
          ...prevProfile,
          latitude,
          longitude
        }));
        setError(null);
      } else {
        setError(errorMsg || 'Failed to retrieve coordinates for the address.');
      }
    });
  };

  const handleAddProfile = () => {
    axios.post('https://profile-mapper-server-2.onrender.com/profiles', newProfile)
      .then(response => {
        setProfiles(prevProfiles => [...prevProfiles, response.data]);
        setNewProfile({
          name: '',
          photoUrl: '',
          address: '',
          latitude: '',
          longitude: '',
          contact:'',
          interest:'',
        });
        setError(null);
      })
      .catch(error => {
        console.error('Error adding profile:', error);
        setError('Failed to add the profile.');
      });
  };

  const handleDeleteProfile = (id) => {
    axios.delete(`https://profile-mapper-server-2.onrender.com/profiles/${id}`)
      .then(() => {
        setProfiles(prevProfiles => prevProfiles.filter(profile => profile.id !== id));
      })
      .catch(error => {
        console.error('Error deleting profile:', error);
        setError('Failed to delete the profile.');
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Card sx={{ padding: 3, marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Profile
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                name="name"
                value={newProfile.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Photo URL"
                variant="outlined"
                name="photoUrl"
                value={newProfile.photoUrl}
                onChange={handleInputChange}
              />
              </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact No"
                variant="outlined"
                name="contact"
                value={newProfile.contact}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Interests"
                variant="outlined"
                name="interest"
                value={newProfile.interest}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                name="address"
                value={newProfile.address}
                onChange={handleAddressChange}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                fullWidth
                label="Latitude"
                variant="outlined"
                name="latitude"
                value={newProfile.latitude}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                fullWidth
                label="Longitude"
                variant="outlined"
                name="longitude"
                value={newProfile.longitude}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddProfile}
              >
                Add Profile
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Existing Profiles
      </Typography>
      {profiles.length === 0 ? (
        <Typography>No profiles available.</Typography>
      ) : (
        profiles.map(profile => (
          <Card key={profile.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{profile.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {profile.description}
              </Typography>
              <IconButton
                color="error"
                onClick={() => handleDeleteProfile(profile.id)}
                sx={{ marginTop: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}

export default AdminPanel;
