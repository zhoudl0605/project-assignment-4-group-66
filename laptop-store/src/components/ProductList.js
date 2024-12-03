import React, { useContext, useState } from 'react';
import AppContext from './AppContext';
import { Box, Grid, Card, CardContent, Typography, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

// Hardcoded arrays of products
const desktopProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    sku: `SKU${i + 1}`,
    name: `Desktop Product ${i + 1}`,
    price: (i + 1) * 100,
    image: `/images/desktop${i + 1}-1.png`,
}));

const laptopProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 21,
    sku: `SKU${i + 21}`,
    name: `Laptop Product ${i + 1}`,
    price: (i + 1) * 150,
    image: `/images/laptop${i + 1}-1.png`,
}));

const accessoryProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 41,
    sku: `SKU${i + 41}`,
    name: `Accessory Product ${i + 1}`,
    price: (i + 1) * 20,
    image: `/images/accessory${i + 1}-1.png`,
}));

function ProductList() {
    const { addToCart } = useContext(AppContext); // Retrieve the addToCart function from the context
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = [...desktopProducts, ...laptopProducts, ...accessoryProducts].filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box padding={3}>
            {/* Search bar */}
            <Box mb={5} textAlign="center">
                <TextField
                    label="Search Products"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ width: '50%' }}
                />
            </Box>

            {/* Product display */}
            <Grid container spacing={3} justifyContent="center">
                {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={product.id}>
                        <Card sx={{ textAlign: 'center' }}>
                            <Link
                                to={`/products/${product.sku}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <Box
                                    sx={{
                                        width: 200,
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        margin: '0 auto',
                                    }}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        ${product.price}
                                    </Typography>
                                </CardContent>
                            </Link>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 2 }}
                                onClick={() => addToCart(product)} // Add the product to the cart
                            >
                                Add to Cart
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ProductList;
