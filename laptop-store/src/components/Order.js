import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';

function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

    // Fetch order details
    useEffect(() => {
        const fetchOrderDetails = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('You must be logged in to view order details.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${baseUrl}/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Order details:', data);

                    setOrder(data.data || null);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to fetch order details.');
                }
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [baseUrl, id]);

    // Fetch product details for each product in the order
    useEffect(() => {
        const fetchProductById = async (productId) => {
            try {
                const response = await fetch(`${baseUrl}/products/${productId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch product with ID: ${productId}`);
                }

                let data = await response.json();
                data = data.data;
                return {
                    id: data._id,
                    name: data.name,
                    price: data.price,
                    stock: data.stock,
                    sku: data.sku,
                    brand: data.brand,
                    medias: data.medias,
                    specs: data.specs,
                };
            } catch (error) {
                console.error('Error fetching product:', error);
                return null;
            }
        };

        const fetchOrderProducts = async () => {
            if (!order) return;

            const productPromises = order.products.map((item) =>
                fetchProductById(item.productId)
            );

            const productDetails = await Promise.all(productPromises);
            console.log('Product details:', productDetails);

            setProducts(productDetails.filter((product) => product !== null));
        };

        fetchOrderProducts();
    }, [baseUrl, order]);

    if (loading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="80vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!order) {
        return (
            <Container>
                <Alert severity="warning">Order not found.</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Box py={4}>
                <Typography variant="h4" align="center" gutterBottom>
                    Order Details
                </Typography>
                <Card sx={{ marginBottom: 3 }}>
                    <CardContent>
                        <Typography variant="h6">
                            <strong>Order ID:</strong> {order.id}
                        </Typography>
                        <Typography variant="h6">
                            <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="h6">
                            <strong>Subtotal:</strong> ${order.subTotal.toFixed(2)}
                        </Typography>
                        <Typography variant="h6">
                            <strong>Tax:</strong> ${order.tax.toFixed(2)}
                        </Typography>
                        <Typography variant="h6">
                            <strong>Total:</strong> ${order.total.toFixed(2)}
                        </Typography>
                        <Typography variant="h6">
                            <strong>Status:</strong> {order.status}
                        </Typography>
                    </CardContent>
                </Card>

                <Typography variant="h5" gutterBottom>
                    Items
                </Typography>
                <Grid container spacing={3}>
                    {order.products.map((item) => {
                        const product = products.find((p) => p.id === item.productId) || {};
                        return (
                            <Grid item xs={12} sm={6} md={4} key={item.productId}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            <strong>{product.name || 'Product Name'}</strong>
                                        </Typography>
                                        <Typography variant="body1">
                                            Price: ${item.price.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body1">
                                            Quantity: {item.quantity}
                                        </Typography>
                                        <Typography variant="body1">
                                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Container>
    );
}

export default OrderDetails;