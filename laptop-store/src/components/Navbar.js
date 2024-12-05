import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, TextField, Button } from '@mui/material';
import AppContext from './AppContext';
import { Link } from 'react-router-dom';

function Navbar({ onSearch }) {
    const [query, setQuery] = useState("");
    const token = localStorage.getItem('token');
    const { clearCart } = useContext(AppContext); // Retrieve the addToCart function from the context

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        clearCart();
        window.location.reload();
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
                {token ? (
                    <Button color="error" onClick={handleSignOut}>Sign Out</Button>
                ) : (
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                )}
                <Button color="inherit" component={Link} to="/admin">Admin</Button>

                {/* Search bar section */}
                <Box display="flex" alignItems="center" ml={2}>
                    
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
