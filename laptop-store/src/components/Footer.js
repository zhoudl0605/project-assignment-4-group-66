import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
    return (
        <Box textAlign="center" padding={3} bgcolor="#007bff" color="white">
            <Typography variant="body2">
                © 2024 Laptop Store. All rights reserved.
            </Typography>
        </Box>
    );
}

export default Footer;
