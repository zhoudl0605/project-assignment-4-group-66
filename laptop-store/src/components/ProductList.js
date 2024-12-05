import React, { useContext, useState, useEffect } from 'react';
import AppContext from './AppContext';
import { useSearchParams } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Link } from 'react-router-dom';

function ProductList() {
    const { addToCart } = useContext(AppContext); // Retrieve the addToCart function from the context
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const [priceRange, setPriceRange] = useState([0, Infinity]);
    const [brand, setBrand] = useState('');
    const [availableBrands, setAvailableBrands] = useState([]);
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

    const currentCategory = searchParams.get('category') || '';

    const fetchProducts = async () => {
        const query = {
            category: currentCategory,
        };
        const queryString = new URLSearchParams(query).toString();

        const url = `${baseUrl}/products?${queryString}`;
        const response = await fetch(url, {});
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        const formattedProducts = data.data.map((product) => ({
            id: product._id,
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            sku: product.sku,
            brand: product.brand,
            medias: product.medias,
            specs: product.specs,
        }));

        const uniqueBrands = [...new Set(data.data.map((product) => product.brand))];
        setAvailableBrands(uniqueBrands);
        setProducts(formattedProducts);
    };

    useEffect(() => {
        fetchProducts();
    }, [currentCategory]); // Refetch products when the category changes

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePriceChange = (event) => {
        const range = event.target.value.split('-').map(Number);
        setPriceRange(range);
    };

    const handleBrandChange = (event) => {
        setBrand(event.target.value);
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        const matchesBrand = !brand || product.brand === brand;
        return matchesSearch && matchesPrice && matchesBrand;
    });

    return (
        <Box padding={3}>
            {/* Search and Filters */}
            <Box my={2} textAlign="center">
                <TextField
                    label="Search Products"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ width: '30%', marginRight: 2 }}
                />
                <FormControl sx={{ width: '20%', marginRight: 2 }}>
                    <InputLabel>Price Range</InputLabel>
                    <Select
                        value={priceRange.join('-')}
                        onChange={handlePriceChange}
                        label="Price Range"
                    >
                        <MenuItem value="0-Infinity">All</MenuItem>
                        <MenuItem value="0-50">Under $50</MenuItem>
                        <MenuItem value="50-100">$50 - $100</MenuItem>
                        <MenuItem value="100-500">$100 - $500</MenuItem>
                        <MenuItem value="500-1000">$500 - $1000</MenuItem>
                        <MenuItem value="1000-2000">$1000 - $2000</MenuItem>
                        <MenuItem value="2000-5000">$2000 - $5000</MenuItem>
                        <MenuItem value="5000-Infinity">Above $5000</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ width: '20%' }}>
                    <InputLabel>Brand</InputLabel>
                    <Select value={brand} onChange={handleBrandChange} label="Brand">
                        <MenuItem value="">All</MenuItem>
                        {availableBrands.map((brand) => (
                            <MenuItem key={brand} value={brand}>
                                {brand}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Category Filters */}
            <Grid container spacing={2} justifyContent="center" my={2}>
                <Grid item xs={12} sm={4} md={3}>
                    <Button
                        variant="contained"
                        color={currentCategory === '' ? 'secondary' : 'primary'}
                        fullWidth
                        href="/products"
                    >
                        All Products
                    </Button>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <Button
                        variant="contained"
                        color={currentCategory === 'desktop' ? 'secondary' : 'primary'}
                        fullWidth
                        href="/products?category=desktop"
                    >
                        Desktops
                    </Button>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <Button
                        variant="contained"
                        color={currentCategory === 'laptop' ? 'secondary' : 'primary'}
                        fullWidth
                        href="/products?category=laptop"
                    >
                        Laptops
                    </Button>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <Button
                        variant="contained"
                        color={currentCategory === 'accessory' ? 'secondary' : 'primary'}
                        fullWidth
                        href="/products?category=accessory"
                    >
                        Accessories
                    </Button>
                </Grid>
            </Grid>

            {/* Product display */}
            <Grid container spacing={3} justifyContent="center" my={2}>
                {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={product.id}>
                        <Card sx={{ textAlign: 'center' }}>
                            <Link
                                to={`/products/${product.id}`}
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
                                        src={product.medias[0]}
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
                                    <Typography color="text.secondary">
                                        {product.stock > 0
                                            ? `${product.stock} In Stock`
                                            : 'Out of Stock'}
                                    </Typography>
                                </CardContent>
                            </Link>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ my: 2 }}
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