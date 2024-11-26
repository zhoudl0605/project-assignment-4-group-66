import React from 'react';
import { Box, Typography } from '@mui/material';

function AdminDashboard() {
    return (
        <Box padding={5}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Here, you can manage products and view orders.
            </Typography>
        </Box>
    );
}

export default AdminDashboard;
