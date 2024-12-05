import React, { useContext, useEffect, useState, useMemo } from 'react';
import AppContext from './AppContext';
import { jwtDecode } from 'jwt-decode';
import {
    Box,
    Table,
    Alert,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Button,
    Checkbox,
    TextField
} from '@mui/material';

function ShoppingCart() {
    const { clearCart } = useContext(AppContext);
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
    const [message, setMessage] = useState();
    const [order, setOrder] = useState({});

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const total = useMemo(
        () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        [cartItems]
    );

    const tax = useMemo(() => total * 0.13, [total]);
    const totalWithTax = useMemo(() => total + tax, [total, tax]);

    const fetchUserProfile = async () => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');

        if (!token) return;

        try {
            const payload = jwtDecode(token);
            const response = await fetch(`${baseUrl}/users/${payload.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = (await response.json()).data;
                setBillingInfo({
                    fullName: data.name,
                    address: data.address.address1,
                    city: data.address.city,
                    province: data.address.province,
                    postalCode: data.address.postalCode,
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const handleNextStep = async () => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        const payload = jwtDecode(token);
        console.log(payload);
        console.log('User ID:', payload.id);

        if (!token) {
            setMessage({ text: 'You must be logged in to place an order', type: 'error' });
            return;
        }

        const orderData = {
            products: cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            })),
            userId: payload.id,
        };

        try {
            const response = await fetch(`${baseUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Order placed:', data);

                setMessage({ text: 'Order placed successfully! Please make the payment.', type: 'success' });
                setOrder(data.data);
                setStep(2);
            } else {
                setMessage({ text: 'Failed to place order', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Failed to place order', type: 'error' });
            console.error(error);
        }
    };

    const handleBillingInputChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    };

    const handlePlaceOrder = () => {
        alert('Order placed successfully!');
    };

    const proceedPaymentHandler = async () => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
        const payment = {
            orderId: order.id,
            cardName: billingInfo.fullName,
            cardNumber: billingInfo.cardNumber,
            expirationDate: billingInfo.expiryDate,
            cvv: billingInfo.cvv,
        }

        const res = await fetch(`${baseUrl}/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(payment),
        });

        if (res.ok) {
            setMessage({ text: 'Payment successful!', type: 'success' });

            // Clear the cart
            clearCart();
            window.location.replace('/orders/' + order.id);
        }
    }


    return (
        <Box padding={3}>
            {/* Message Alerts */}
            {message ?
                <Alert
                    severity={message.type}
                    onClose={() => setMessage({})}
                >
                    {message.text}
                </Alert>
                : null}

            {/* Step 1: Shopping Cart */}
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
                                    {cartItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell><Checkbox /></TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>${item.price}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => removeFromCart(item.id)}
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

            {/* Step 2: Billing Information */}
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
                            required
                        />
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={billingInfo.address}
                            onChange={handleBillingInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={billingInfo.city}
                            onChange={handleBillingInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Province"
                            name="province"
                            value={billingInfo.province}
                            onChange={handleBillingInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Postal Code"
                            name="postalCode"
                            value={billingInfo.postalCode}
                            onChange={handleBillingInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Card Number"
                            name="cardNumber"
                            value={billingInfo.cardNumber}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,16}$/.test(value)) {
                                    setBillingInfo((prevInfo) => ({ ...prevInfo, cardNumber: value }));
                                }
                            }}
                            margin="normal"
                            required
                            inputProps={{
                                maxLength: 16, // 限制最多输入 16 位
                                inputMode: 'numeric', // 启用数字键盘
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Expiry Date (MM/YY)"
                            name="expiryDate"
                            value={billingInfo.expiryDate}
                            onChange={(e) => {
                                const input = e.target.value;

                                // 移除非数字和非斜杠字符
                                let sanitizedInput = input.replace(/[^0-9/]/g, '');

                                // 自动插入斜杠并验证月份范围
                                if (sanitizedInput.length === 2 && sanitizedInput[1] !== '/' && sanitizedInput.length > billingInfo.expiryDate.length) {
                                    const month = parseInt(sanitizedInput, 10);

                                    // 验证月份是否有效（1-12）
                                    if (month > 0 && month <= 12) {
                                        sanitizedInput += '/';
                                    } else {
                                        setMessage({ text: 'Invalid month. Please enter a valid month (01-12).', type: 'error' });
                                        return;
                                    }
                                }

                                // 更新输入值，确保长度限制
                                if (sanitizedInput.length <= 5) {
                                    setBillingInfo((prevInfo) => ({
                                        ...prevInfo,
                                        expiryDate: sanitizedInput,
                                    }));
                                }
                            }}
                            onBlur={() => {
                                const [month, year] = billingInfo.expiryDate.split('/');
                                if (month && year) {
                                    const currentDate = new Date();
                                    const currentYear = currentDate.getFullYear() % 100; // 当前年份后两位
                                    const currentMonth = currentDate.getMonth() + 1;

                                    // 验证月份是否有效
                                    if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
                                        setMessage({ text: 'Invalid month. Please enter a valid month (01-12).', type: 'error' });
                                        setBillingInfo((prevInfo) => ({
                                            ...prevInfo,
                                            expiryDate: '',
                                        }));
                                        return;
                                    }

                                    // 验证日期是否是未来日期
                                    if (
                                        parseInt(year, 10) < currentYear ||
                                        (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth)
                                    ) {
                                        setMessage({ text: 'Expiry date must be in the future.', type: 'error' });
                                        setBillingInfo((prevInfo) => ({
                                            ...prevInfo,
                                            expiryDate: '',
                                        }));
                                    }
                                }
                            }}
                            margin="normal"
                            required
                            inputProps={{
                                maxLength: 5, // 限制最大输入长度为 5
                                inputMode: 'numeric', // 启用数字键盘
                                placeholder: "MM/YY", // 提示格式
                            }}
                        />
                        <TextField
                            fullWidth
                            label="CVV"
                            name="cvv"
                            value={billingInfo.cvv}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,3}$/.test(value)) {
                                    setBillingInfo((prevInfo) => ({ ...prevInfo, cvv: value }));
                                }
                            }}
                            margin="normal"
                            required
                            inputProps={{
                                maxLength: 3, // 限制最多输入 3 位
                                inputMode: 'numeric', // 启用数字键盘
                            }}
                        />
                    </Box>
                    <Box mt={3} textAlign="right">
                        <Button variant="contained" color="secondary" onClick={() => setStep(1)} sx={{ mr: 2 }}>
                            Back to Cart
                        </Button>
                        <Button variant="contained" color="primary" onClick={proceedPaymentHandler}>
                            Proceed to Payment
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default ShoppingCart;