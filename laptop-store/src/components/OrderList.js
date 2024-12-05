import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Alert, Button } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            const payload = jwtDecode(token);

            if (!token) {
                setError('You must be logged in to view your orders.');
                setLoading(false);
                return;
            }

            const query = {
                userId: payload.id,
            };
            const queryString = new URLSearchParams(query).toString();

            try {
                const response = await fetch(`${baseUrl}/orders?${queryString}`, {
                    query: {

                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    console.log('Orders:', data);
                    setOrders(data.data.data || []);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to fetch orders.');
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [baseUrl]);

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
            <Box padding={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (orders.length === 0) {
        return (
            <Box padding={3}>
                <Alert severity="info">No orders found.</Alert>
            </Box>
        );
    }

    return (
        <Box padding={3}>
            <Typography variant="h4" align="center" gutterBottom>
                Order List
            </Typography>
            <Grid container spacing={3}>
                {orders.map((order) => (
                    <Grid item xs={12} sm={6} md={4} key={order.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Order ID: {order.id}
                                </Typography>
                                <Typography variant="body1">
                                    Total: ${order.total.toFixed(2)}
                                </Typography>
                                <Typography variant="body1">
                                    Status: {order.status}
                                </Typography>
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        to={`/orders/${order.id}`}
                                    >
                                        View Details
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default OrderList;