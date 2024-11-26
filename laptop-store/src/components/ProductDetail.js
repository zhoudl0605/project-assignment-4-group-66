import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, Grid, Table, TableBody, TableCell, TableRow } from '@mui/material';
import AppContext from './AppContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useContext(AppContext);
    const [quantity, setQuantity] = useState(1);

    // Hardcoded product data
    const product = {
        id: id,
        name: 'Sample Product',
        price: 99.99,
        stock: 10,
        medias: [
            '/images/sample-product-1.jpg',
            '/images/sample-product-2.jpg',
            '/images/sample-product-3.jpg',
        ],
        specs: [
            'Specification 1: Product feature description',
            'Specification 2: Product function description',
            'Specification 3: Other product information',
        ],
    };

    const handleQuantityChange = (change) => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
    };

    return (
        <Box padding={3}>
            <Typography variant="h4" align="center" gutterBottom>
                {product.name}
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    {/* Product images */}
                    {product.medias && product.medias.map((media, index) => (
                        <Box key={index} mb={2}>
                            <img
                                src={media}
                                alt={`${product.name} ${index + 1}`}
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
                            Specifications
                        </Typography>
                        <Table>
                            <TableBody>
                                {product.specs && product.specs.map((spec, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{spec}</TableCell>
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