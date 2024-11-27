import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Laptop Store
                </Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/products">Products</Button>
                <Button color="inherit" component={Link} to="/cart">Cart</Button>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/admin">Admin</Button>

                {/* 搜索栏部分 */}
                <Box display="flex" alignItems="center" ml={2}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={query}
                        onChange={handleInputChange}
                        size="small"
                        sx={{ backgroundColor: 'white', borderRadius: 1, mr: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
