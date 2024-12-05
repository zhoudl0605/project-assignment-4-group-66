import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
    return (
        <footer
            textalign="center"
            padding={3}
            bgcolor="#007bff"
            color="white"
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
            }}
        >
            <Typography variant="body2">
                © 2024 Laptop Store. All rights reserved.
            </Typography>
        </footer>
    );
}

export default Footer;
