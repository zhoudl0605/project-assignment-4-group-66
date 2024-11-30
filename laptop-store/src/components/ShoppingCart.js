import React, { useContext, useEffect, useState } from 'react';
import AppContext from './AppContext';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Checkbox, TextField } from '@mui/material';

function ShoppingCart() {
    const { cartItems, removeFromCart } = useContext(AppContext);
    const [step, setStep] = useState(1);
    const [billingInfo, setBillingInfo] = useState({
        fullName: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    useEffect(() => {
        console.log('Cart Items updated:', cartItems); // Log cart items whenever they are updated
    }, [cartItems]);

    // Calculate total price and tax
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = total * 0.13;
    const totalWithTax = total + tax;

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleBillingInputChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo({ ...billingInfo, [name]: value });
    };

    const handlePlaceOrder = () => {
        alert('Order placed successfully!');
    };

    return (
        <Box padding={3}>
            {step === 1 && (
                <>
                    <Typography variant="h4" gutterBottom align="center">
                        Shopping Cart
                    </Typography>
                    {cartItems.length === 0 ? (
                        <Typography variant="h6" align="center">
                            Your cart is empty
                        </Typography>
                    ) : (
                        <>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Checkbox disabled /></TableCell>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Subtotal</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Checkbox /></TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>${item.price}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => {
                                                        console.log('Removing item with id:', item.id); // Log item ID being removed
                                                        removeFromCart(item.id);
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Box mt={3} textAlign="right">
                                <Typography variant="h6">Total: ${total.toFixed(2)} CAD</Typography>
                                <Typography variant="h6">Tax (13%): ${tax.toFixed(2)} CAD</Typography>
                                <Typography variant="h6">Total with Tax: ${totalWithTax.toFixed(2)} CAD</Typography>
                            </Box>
                            <Box mt={3} textAlign="right">
                                <Button variant="contained" color="primary" onClick={handleNextStep}>
                                    Proceed to Checkout
                                </Button>
                            </Box>
                        </>
                    )}
                </>
            )}

            {step === 2 && (
                <Box>
                    <Typography variant="h4" gutterBottom align="center">
                        Billing Information
                    </Typography>
                    <Box component="form">
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="fullName"
                            value={billingInfo.fullName}
                            onChange={handleBillingInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={billingInfo.address}
                            onChange={handleBillingInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={billingInfo.city}
                            onChange={handleBillingInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Province"
                            name="province"
                            value={billingInfo.province}
                            onChange={handleBillingInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Postal Code"
                            name="postalCode"
                            value={billingInfo.postalCode}
                            onChange={handleBillingInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Card Number"
                            name="cardNumber"
                            value={billingInfo.cardNumber}
                            onChange={handleBillingInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Expiry Date (MM/YY)"
                            name="expiryDate"
                            value={billingInfo.expiryDate}
                            onChange={handleBillingInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="CVV"
                            name="cvv"
                            value={billingInfo.cvv}
                            onChange={handleBillingInputChange}
                            margin="normal"
                        />
                    </Box>
                    <Box mt={3} textAlign="right">
                        <Button variant="contained" color="secondary" onClick={handlePreviousStep} sx={{ mr: 2 }}>
                            Back to Cart
                        </Button>
                        <Button variant="contained" color="primary" onClick={handlePlaceOrder}>
                            Place Order
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default ShoppingCart;
