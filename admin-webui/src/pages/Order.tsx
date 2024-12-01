import React, { useState, useEffect } from "react";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    CircularProgress,
    Alert,
} from "@mui/material";
import Layout from "../layout/dashboard";
import OrderDialog from "./order/OrderDialog";

export interface ProductData {
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface ProductListItem {
    id: string;
    name: string;
    price: number;
}

export interface OrderData {
    id?: string;
    userId: string;
    products: ProductData[];
    subTotal?: number;
    tax?: number;
    total?: number;
    status: string;
    createdAt?: string;
}

export default function OrderPage() {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [productsList, setProductsList] = useState<ProductListItem[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderData | undefined>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch orders and product list
    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const url = `${process.env.REACT_APP_API_BASE_URL}/orders`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();

            const formattedOrders = data.data.data.map((order: any) => ({
                id: order._id,
                userId: order.userId,
                products: order.products.map((product: any) => ({
                    productId: product.productId,
                    name: product.name,
                    quantity: product.quantity,
                    price: product.price,
                })),
                subTotal: order.subTotal,
                tax: order.tax,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt,
            }));

            setOrders(formattedOrders);
            setLoading(false);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const url = `${process.env.REACT_APP_API_BASE_URL}/products`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();

            const formattedProducts = data.data.map((product: any) => ({
                id: product._id,
                name: product.name,
                price: product.price,
            }));

            setProductsList(formattedProducts);
        } catch (err: any) {
            console.error("Error fetching products:", err.message);
            setError(err.message);
        }
    };

    const updateOrder = async (order: OrderData) => {
        try {
            const token = sessionStorage.getItem("token");
            const url = `${process.env.REACT_APP_API_BASE_URL}/orders/${order.id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(order),
            });

            if (!response.ok) {
                throw new Error("Failed to update order");
            }

            window.location.reload();
        } catch (err: any) {
            console.error("Error updating order:", err.message);
            setError(err.message);
        }
    };

    const deleteOrder = async (orderId: string) => {
        try {
            const token = sessionStorage.getItem("token");
            const url = `${process.env.REACT_APP_API_BASE_URL}/orders/${orderId}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete order");
            }

            window.location.reload();
        } catch (err: any) {
            console.error("Error deleting order:", err.message);
            setError(err.message);
        }
    };

    const handleOpenDialog = (order?: OrderData) => {
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    const handleCloseDialog = async (
        action: "add" | "edit" | "cancel",
        updatedOrder?: OrderData
    ) => {
        setDialogOpen(false);

        if (action === "add" && updatedOrder) {
            try {
                const token = sessionStorage.getItem("token");
                const url = `${process.env.REACT_APP_API_BASE_URL}/orders`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify(updatedOrder),
                });
                if (!response.ok) {
                    throw new Error("Failed to add order");
                }

                window.location.reload();
            } catch (err: any) {
                console.error("Error adding order:", err.message);
                setError(err.message);
            }
        } else if (action === "edit" && updatedOrder) {
            try {
                await updateOrder(updatedOrder);
                window.location.reload();
            } catch (err: any) {
                console.error("Error updating order:", err.message);
                setError(err.message);
            }
        }
    };

    return (
        <Layout pagename="Orders">
            <Box>
                <Button
                    variant="contained"
                    onClick={() => handleOpenDialog()}
                    sx={{ my: 2 }}
                >
                    Add Order
                </Button>
                {loading && (
                    <Box display="flex" justifyContent="center" my={2}>
                        <CircularProgress />
                    </Box>
                )}
                {error && (
                    <Box my={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}
                {!loading && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>User ID</TableCell>
                                    <TableCell>SubTotal</TableCell>
                                    <TableCell>Tax</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.userId}</TableCell>
                                        <TableCell>{order.subTotal}</TableCell>
                                        <TableCell>{order.tax}</TableCell>
                                        <TableCell>{order.total}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>
                                            {new Date(
                                                order.createdAt!
                                            ).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() =>
                                                    handleOpenDialog(order)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    deleteOrder(order.id!)
                                                }
                                                color="error"
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <OrderDialog
                    open={dialogOpen}
                    order={selectedOrder}
                    onClose={handleCloseDialog}
                    productsList={productsList}
                />
            </Box>
        </Layout>
    );
}
