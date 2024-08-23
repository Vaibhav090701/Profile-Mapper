import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Button, 
    Container, 
    Grid, 
    TextField, 
    Typography, 
    Card, 
    CardContent, 
    CardMedia, 
    MenuItem, 
    Select, 
    InputLabel, 
    FormControl, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle 
} from '@mui/material';
import { debouncedGetCoordinatesFromAddress } from './GeoCode';

const ProfileList = () => {
    const [profiles, setProfiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/profiles')
            .then(response => {
                const profileData = response.data;
                setProfiles(profileData);
                const uniqueLocations = [...new Set(profileData.map(profile => profile.address))];
                const uniqueCategories = [...new Set(profileData.map(profile => profile.category))];
                setLocations(uniqueLocations);
                setCategories(uniqueCategories);
            })
            .catch(error => console.error('Error fetching profiles:', error));
    }, []);

    const filteredProfiles = profiles.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterLocation === '' || profile.address === filterLocation) &&
        (filterCategory === '' || profile.category === filterCategory)
    );

    const handleCardClick = (profileId) => {
        navigate(`/profile/${profileId}`);
    };

    const handleShowOnMap = (address) => {
        debouncedGetCoordinatesFromAddress(address, (coords, error) => {
            if (error) {
                console.error('Error fetching coordinates:', error);
                return;
            }

            if (coords) {
                const { latitude, longitude } = coords;
                window.open(`https://www.google.com/maps?q=${latitude},${longitude}&hl=en`, '_blank');
            }
        });
    };

    const handleAdmin = () => {
        navigate('/admin');
    };

    const handleFilterOpen = () => {
        setOpenFilterModal(true);
    };

    const handleFilterClose = () => {
        setOpenFilterModal(false);
    };

    const handleFilterApply = () => {
        handleFilterClose();
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Profile List
            </Typography>
            <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                <Grid item xs={12} sm={8} md={9}>
                    <TextField
                        fullWidth
                        label="Search profiles..."
                        variant="outlined"
                        margin="normal"
                        onChange={e => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        sx={{
                            backgroundColor: 'background.paper',
                            borderRadius: 1,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'divider',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'text.primary',
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleFilterOpen}
                        sx={{ marginRight: 1 }}
                    >
                        Filter
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleAdmin}
                    >
                        Admin
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {filteredProfiles.length > 0 ? (
                    filteredProfiles.map(profile => (
                        <Grid item xs={12} sm={6} md={4} key={profile.id}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleCardClick(profile.id)}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={profile.photoUrl}
                                    alt={profile.name}
                                    sx={{
                                        objectFit: 'cover',
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="h6">
                                        {profile.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {profile.description}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShowOnMap(profile.address);
                                        }}
                                        sx={{ margin: 1 }}
                                    >
                                        Show on Map
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ marginTop: 2 }}>
                        No profiles found.
                    </Typography>
                )}
            </Grid>

            {/* Filter Modal */}
            <Dialog
                open={openFilterModal}
                onClose={handleFilterClose}
                PaperProps={{
                    sx: {
                        width: '80%', // Adjust the width as needed
                        maxWidth: '800px', // Set a maximum width if desired
                    }
                }}
            >
                <DialogTitle>Filter Profiles</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Location</InputLabel>
                                <Select
                                    value={filterLocation}
                                    onChange={e => setFilterLocation(e.target.value)}
                                    label="Location"
                                >
                                    <MenuItem value="">All Locations</MenuItem>
                                    {locations.map(location => (
                                        <MenuItem key={location} value={location}>{location}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFilterClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleFilterApply} color="secondary">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProfileList;
