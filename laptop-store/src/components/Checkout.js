import React from 'react';
import { Box, Typography, Button } from '@mui/material';

function Checkout() {
    return (
        <Box textAlign="center" padding={5}>
            <Typography variant="h4" gutterBottom>
                Checkout Page
            </Typography>
            <Button variant="contained" color="primary">
                Proceed to Payment
            </Button>
        </Box>
    );
}

export default Checkout;
