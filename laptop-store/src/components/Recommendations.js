import React, { useContext, useState, useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Grid } from '@mui/material';
import AppContext from './AppContext';
import { Link } from 'react-router-dom';


function Recommendations() {
    const [products, setProducts] = useState([]);

    const { addToCart } = useContext(AppContext); // Retrieve the addToCart function from the context
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const query = {
                limit: 8,
            };
            const queryString = new URLSearchParams(query).toString();

            const url = `${process.env.REACT_APP_API_BASE_URL}/products?${queryString}`;
            const response = await fetch(url, {
            });
            if (!response.ok) {
                throw new Error("Failed to fetch products");
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

            setProducts(formattedProducts);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            flexWrap="wrap"
            gap={4}
            mt={5}
        >
            <Grid container spacing={3} justifyContent="center" my={2}>

                {products.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={item.id}>
                        <Card sx={{ textAlign: 'center' }}>
                            <Link
                                to={`/products/${item.id}`}
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
                                        src={item.medias[0]}
                                        alt={item.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {item.name}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        ${item.price}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {item.stock > 0
                                            ? `${item.stock} In Stock`
                                            : 'Out of Stock'}
                                    </Typography>
                                </CardContent>
                            </Link>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ my: 2 }}
                                onClick={() => addToCart(item)} // Add the product to the cart
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

export default Recommendations;
