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
import PaymentMethodDialog from "./paymentMethod/PaymentMethodDialog";
import useCsrfToken from "../hooks/useCsrfToken";

interface PaymentMethodData {
    id: string;
    userId: string;
    cardType: string;
    cardNumber: string;
    cardName: string;
    expirationDate: string;
    cvv: string;
}

export default function PaymentMethodPage() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>(
        []
    );
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
        PaymentMethodData | undefined
    >();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const csrfToken = useCsrfToken();

    // Fetch payment methods from API
    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const url = `${process.env.REACT_APP_API_BASE_URL}/payment-methods`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch payment methods");
            }

            const data = await response.json();

            const formattedPaymentMethods = data.data.map((pm: any) => ({
                id: pm._id,
                userId: pm.userId,
                cardType: pm.cardType,
                cardNumber: pm.cardNumber,
                cardName: pm.cardName,
                expirationDate: pm.expirationDate,
                cvv: pm.cvv,
            }));

            setPaymentMethods(formattedPaymentMethods);
            setLoading(false);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    };

    const updatePaymentMethod = async (paymentMethod: PaymentMethodData) => {
        try {
            const token = sessionStorage.getItem("token");
            const url = `${process.env.REACT_APP_API_BASE_URL}/payment-methods/${paymentMethod.id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                    "CSRF-Token": csrfToken,
                },
                body: JSON.stringify(paymentMethod),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to update payment method");
            }

            window.location.reload();
        } catch (err: any) {
            console.error("Error updating payment method:", err.message);
            setError(err.message);
        }
    };

    const deletePaymentMethod = async (paymentMethodId: string) => {
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/payment-methods/${paymentMethodId}`;
            const token = sessionStorage.getItem("token");
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                    "CSRF-Token": csrfToken,
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to delete payment method");
            }

            window.location.reload();
        } catch (err: any) {
            console.error("Error deleting payment method:", err.message);
            setError(err.message);
        }
    };

    const handleOpenDialog = (paymentMethod?: PaymentMethodData) => {
        setSelectedPaymentMethod(paymentMethod);
        setDialogOpen(true);
    };

    const handleCloseDialog = async (
        action: string,
        updatedPaymentMethod?: PaymentMethodData
    ) => {
        setDialogOpen(false);

        if (action === "add" && updatedPaymentMethod) {
            try {
                const token = sessionStorage.getItem("token");
                const url = `${process.env.REACT_APP_API_BASE_URL}/payment-methods`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                        "CSRF-Token": csrfToken,
                    },
                    body: JSON.stringify(updatedPaymentMethod),
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to add payment method");
                }

                window.location.reload();
            } catch (err: any) {
                console.error("Error adding payment method:", err.message);
                setError(err.message);
            }
        } else if (action === "edit" && updatedPaymentMethod) {
            try {
                await updatePaymentMethod(updatedPaymentMethod);
            } catch (err: any) {
                console.error("Error updating payment method:", err.message);
                setError(err.message);
            }
        }
    };

    return (
        <Layout pagename="Payment Methods">
            <Box>
                <Button
                    variant="contained"
                    onClick={() => handleOpenDialog()}
                    sx={{ my: 2 }}
                >
                    Add Payment Method
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
                                    <TableCell>Card Type</TableCell>
                                    <TableCell>Card Number</TableCell>
                                    <TableCell>Card Name</TableCell>
                                    <TableCell>Expiration Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paymentMethods.map((pm) => (
                                    <TableRow key={pm.id}>
                                        <TableCell>{pm.id}</TableCell>
                                        <TableCell>{pm.userId}</TableCell>
                                        <TableCell>{pm.cardType}</TableCell>
                                        <TableCell>{pm.cardNumber}</TableCell>
                                        <TableCell>{pm.cardName}</TableCell>
                                        <TableCell>
                                            {pm.expirationDate}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() =>
                                                    handleOpenDialog(pm)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    deletePaymentMethod(pm.id)
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
                <PaymentMethodDialog
                    open={dialogOpen}
                    paymentMethod={selectedPaymentMethod}
                    onClose={handleCloseDialog}
                />
            </Box>
        </Layout>
    );
}
