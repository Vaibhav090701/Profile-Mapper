import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, CardContent, CardMedia, Typography, CircularProgress, Box } from '@mui/material';

const ProfileDetail = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/profiles/${id}`)
      .then(response => setProfile(response.data))
      .catch(error => console.error('Error fetching profile:', error));
  }, [id]);

  if (!profile) return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
        <CardMedia
          component="img"
          height="120" // Fixed height for the profile picture
          image={profile.photoUrl}
          alt={profile.name}
          sx={{
            width: '120px', // Fixed width for the profile picture
            borderRadius: '50%', // Circular profile picture
            objectFit: 'cover', // Maintain aspect ratio
            mb: 2 // Margin bottom for spacing
          }}
        />
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5" component="div" gutterBottom>
          <span>Name- </span>
            {profile.name}
          </Typography>
          <Typography variant="h5" color="text.secondary">
          <span>Address- </span>
            {profile.address}
          </Typography>
          <Typography variant="h5" color="text.secondary">
          <span>Contact No- </span>
            {profile.contact}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            <span>Interest- </span>
            {profile.interest}
          </Typography>

        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfileDetail;
