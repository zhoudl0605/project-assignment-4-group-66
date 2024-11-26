// Product Details Component
import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, Grid, Table, TableBody, TableCell, TableRow } from '@mui/material';
import AppContext from './AppContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useContext(AppContext);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // 使用 Fetch API 从后端获取产品详情
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                if (response.ok) {
                    const productData = await response.json();
                    setProduct(productData);
                } else {
                    console.error('Product not found');
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleQuantityChange = (change) => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
    };

    if (!product) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box padding={3}>
            <Typography variant="h4" align="center" gutterBottom>
                {product.name}
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    {/* 产品图片 */}
                    {product.medias.map((media, index) => (
                        <Box key={index} mb={2}>
                            <img
                                src={media}
                                alt={product.name}
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                            />
                        </Box>
                    ))}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="h5" color="primary" gutterBottom>
                        CAD ${product.price.toFixed(2)}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={2} mb={2}>
                        <Typography variant="body1" mr={2}>Qty</Typography>
                        <Button variant="outlined" onClick={() => handleQuantityChange(-1)}>-</Button>
                        <Typography variant="body1" mx={2}>{quantity}</Typography>
                        <Button variant="outlined" onClick={() => handleQuantityChange(1)}>+</Button>
                    </Box>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => addToCart({ ...product, quantity })}
                        disabled={product.stock === 0}
                    >
                        Add to Cart
                    </Button>
                    <Box mt={3}>
                        <Typography variant="h5" gutterBottom>
                            Specification
                        </Typography>
                        <Table>
                            <TableBody>
                                {product.specs.map((spec, index) => (
                                    <TableRow key={index}>
                                        <TableCell><strong>{spec.name}</strong></TableCell>
                                        <TableCell>{spec.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Grid>
            </Grid>
            <Box mt={5} textAlign="center">
                <Button variant="outlined" component={Link} to="/products/accessories">
                    View Accessories
                </Button>
            </Box>
        </Box>
    );
};

export default ProductDetail;
