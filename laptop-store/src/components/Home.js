import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import bannerImage1 from '../images/banner1.png';
import bannerImage2 from '../images/banner2.png';
import Recommendations from './Recommendations'; // Import the Recommendations component

function Home() {
    const items = [
        {
            name: "First Banner",
            image: bannerImage1,
        },
        {
            name: "Second Banner",
            image: bannerImage2,
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            {/* Banner Carousel */}
            <Carousel
                sx={{
                    width: '100%',
                }}
                height={400}
                navButtonsAlwaysVisible
            >
                {items.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            height: '400px',
                            width: '100%',
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                ))}
            </Carousel>

            {/* Main content section */}
            <Box textAlign="center" mt={5} sx={{ width: '100%', px: 2 }}>
                <Typography variant="h3" gutterBottom>
                    Welcome to the Laptop Store
                </Typography>
                <Grid container spacing={2} justifyContent="center" mt={3}>
                    <Grid item xs={12} sm={4} md={3}>
                        <Button variant="contained" color="primary" fullWidth href="/products?category=desktops">
                            Desktops
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <Button variant="contained" color="primary" fullWidth href="/products?category=laptops">
                            Laptops
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <Button variant="contained" color="primary" fullWidth href="/products?category=accessories">
                            Accessories
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Recommendations Section */}
            <Box mt={5} sx={{ px: 2 }}>
                <Recommendations /> {/* Add the Recommendations component */}
            </Box>
        </Box>
    );
}

export default Home;
