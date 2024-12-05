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
import useCsrfToken from "../hooks/useCsrfToken";

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
    quantity: number;
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
    const csrfToken = useCsrfToken();

    // Fetch orders and product list
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = sessionStorage.getItem("token");

                // Fetch products
                const productResponse = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/products`,
                    {
                        headers: {
                            Authorization: `${token}`,
                        },
                    }
                );
                if (!productResponse.ok) {
                    throw new Error("Failed to fetch products");
                }
                const productData = await productResponse.json();
                const formattedProducts = productData.data.map(
                    (product: any) => ({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        quantity: product.stock ?? 0,
                    })
                );
                setProductsList(formattedProducts);

                // Fetch orders
                const orderResponse = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/orders`,
                    {
                        headers: {
                            Authorization: `${token}`,
                        },
                    }
                );
                if (!orderResponse.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const orderData = await orderResponse.json();
                const formattedOrders = orderData.data.data.map(
                    (order: any) => ({
                        id: order._id,
                        userId: order.userId,
                        products: order.products.map((product: any) => {
                            const productDetail = formattedProducts.find(
                                (p: any) => p.id === product.productId
                            );

                            return {
                                productId: product.productId,
                                name: productDetail?.name || product.productId,
                                quantity: product.quantity,
                                price: productDetail?.price || 0,
                            };
                        }),
                        subTotal: order.subTotal,
                        tax: order.tax,
                        total: order.total,
                        status: order.status,
                        createdAt: order.createdAt,
                    })
                );

                setOrders(formattedOrders);
            } catch (err: any) {
                console.error(err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const updateOrder = async (order: OrderData) => {
        try {
            let invalidOrder = false;
            order.products = order.products.filter((product) => {
                const availableProduct = productsList.find(
                    (p) => p.id === product.productId
                );

                if (!availableProduct) {
                    invalidOrder = true;
                    return false;
                }

                if (
                    product.quantity > 0 &&
                    availableProduct && // Ensure the product exists in the productsList
                    product.quantity <= availableProduct.quantity
                ) {
                    return true;
                }

                invalidOrder = true;
                return false;
            });

            if (order.products.length === 0) {
                invalidOrder = true;
            }

            if (invalidOrder) {
                setError("Invalid order, please check the products");
                throw new Error("Invalid order, please check the products");
            }

            const token = sessionStorage.getItem("token");
            const url = `${process.env.REACT_APP_API_BASE_URL}/orders/${order.id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                    "CSRF-Token": csrfToken,
                },
                body: JSON.stringify(order),
                credentials: "include",
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
                    "CSRF-Token": csrfToken,
                },
                credentials: "include",
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
                        "CSRF-Token": csrfToken,
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify(updatedOrder),
                    credentials: "include",
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
                // window.location.reload();
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
