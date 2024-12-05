import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, Grid, Table, TableBody, TableCell, TableRow, MobileStepper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import AppContext from './AppContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useContext(AppContext);
    const [quantity, setQuantity] = useState(1);
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
    const [product, setProduct] = useState(null);
    const [activeStep, setActiveStep] = useState(0);

    const handleQuantityChange = (change) => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
    };

    const fetchProductDetails = useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}/products/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product details.');
            }
            let data = await response.json();
            console.log(data);
            data = data.data;

            setProduct({
                id: data._id,
                name: data.name,
                category: data.category,
                price: data.price,
                stock: data.stock,
                sku: data.sku,
                brand: data.brand,
                medias: data.medias,
                specs: data.specs,
            });
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }, [baseUrl, id]);

    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    if (!product) {
        return (
            <Box padding={3} textAlign="center">
                <Typography variant="h5" color="text.secondary">
                    Loading product details...
                </Typography>
            </Box>
        );
    }

    return (

        <Box padding={3}>
            <Typography variant="h4" align="center" gutterBottom>
                {product.name}
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    {/* Product Image Carousel */}
                    {product.medias && product.medias.length > 0 && (
                        <>
                            <Box textAlign="center" mb={2}>
                                <img
                                    src={product.medias[activeStep]}
                                    alt={`${product.name} ${activeStep + 1}`}
                                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                                />
                            </Box>
                            <MobileStepper
                                steps={product.medias.length}
                                position="static"
                                activeStep={activeStep}
                                nextButton={
                                    <Button
                                        size="small"
                                        onClick={handleNext}
                                        disabled={activeStep === product.medias.length - 1}
                                    >
                                        Next
                                        <KeyboardArrowRight />
                                    </Button>
                                }
                                backButton={
                                    <Button
                                        size="small"
                                        onClick={handleBack}
                                        disabled={activeStep === 0}
                                    >
                                        <KeyboardArrowLeft />
                                        Back
                                    </Button>
                                }
                            />
                        </>
                    )}
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
                        onClick={() => {
                            addToCart(product, quantity);
                            alert('Product added to cart!');
                            window.location.reload();
                        }}
                        disabled={product.stock === 0}
                    >
                        Add to Cart
                    </Button>
                    <Box mt={3}>
                        <Typography variant="h5" gutterBottom>
                            Specifications
                        </Typography>
                        <Table>
                            <TableBody>
                                {product.specs && product.specs.length > 0 ? (
                                    product.specs.map((spec, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{spec}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell>No specifications available.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductDetail;