import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { OrderData, ProductData } from "../Order";
import { UserData } from "../User";

interface OrderDialogProps {
    open: boolean;
    order?: OrderData;
    productsList: {
        id: string;
        name: string;
        price: number;
        quantity: number;
    }[]; // Product list with stock quantity
    onClose: (
        action: "add" | "edit" | "cancel",
        updatedOrder?: OrderData
    ) => void;
}

const OrderDialog: React.FC<OrderDialogProps> = ({
    open,
    order,
    productsList,
    onClose,
}) => {
    const [userId, setUserId] = useState<string>("");
    const [products, setProducts] = useState<ProductData[]>([]);
    const [status, setStatus] = useState<string>("pending");
    const [users, setUsers] = useState<UserData[]>([]);
    const [errors, setErrors] = useState<string | null>(null);

    useEffect(() => {
        if (order) {
            setUserId(order.userId || "");
            setProducts(order.products || []);
            setStatus(order.status || "pending");
        } else {
            setUserId("");
            setProducts([]);
            setStatus("pending");
        }
    }, [order]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/users`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            const formattedUsers = data.result.data.map((user: any) => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: {
                    address1: user.address?.address1 || "",
                    address2: user.address?.address2 || "",
                    city: user.address?.city || "",
                    province: user.address?.province || "",
                    postalCode: user.address?.postalCode || "",
                },
            }));

            setUsers(formattedUsers);
        } catch (err) {
            console.error(err);
        }
    };

    const handleProductChange = (
        index: number,
        field: keyof ProductData,
        value: string | number
    ) => {
        const updatedProducts = [...products];
        const productInList = productsList.find(
            (p) => p.id === updatedProducts[index].productId
        );

        if (field === "quantity" && productInList) {
            const maxQuantity = productInList.quantity;
            value = parseInt(value as string, 10);

            if (value > maxQuantity) {
                setErrors(`Quantity cannot exceed ${maxQuantity}`);
                return;
            } else {
                setErrors(null);
            }
        }

        updatedProducts[index] = {
            ...updatedProducts[index],
            [field]: value,
        };
        setProducts(updatedProducts);
    };

    const handleAddProduct = () => {
        setProducts([
            ...products,
            { productId: "", name: "", quantity: 1, price: 0 },
        ]);
    };

    const handleRemoveProduct = (index: number) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);
    };

    const handleProductSelect = (index: number, productId: string) => {
        const selectedProduct = productsList.find((p) => p.id === productId);
        if (selectedProduct) {
            const updatedProducts = [...products];
            updatedProducts[index] = {
                ...updatedProducts[index],
                productId: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
            };
            setProducts(updatedProducts);
        }
    };

    const validateOrder = (): boolean => {
        if (!userId) {
            setErrors("Please select a user.");
            return false;
        }
        if (products.length === 0) {
            setErrors("Please add at least one product.");
            return false;
        }
        for (const product of products) {
            if (!product.productId || product.quantity <= 0) {
                setErrors("All products must have valid quantities.");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateOrder()) {
            return;
        }
        const updatedOrder: OrderData = {
            id: order?.id,
            userId,
            products,
            status,
        };
        onClose(order ? "edit" : "add", updatedOrder);
    };

    const getAvailableProducts = (index: number) => {
        const selectedIds = products
            .map((p, i) => (i !== index ? p.productId : null))
            .filter((id) => id !== null);
        return productsList.filter((p) => !selectedIds.includes(p.id));
    };

    return (
        <Dialog open={open} onClose={() => onClose("cancel")} fullWidth>
            <DialogTitle>{order ? "Edit Order" : "Add Order"}</DialogTitle>
            <DialogContent>
                {errors && (
                    <Box mb={2} color="error.main">
                        {errors}
                    </Box>
                )}
                <Box display="flex" flexDirection="column" gap={2}>
                    <FormControl fullWidth>
                        <InputLabel>User</InputLabel>
                        <Select
                            value={userId || ""}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box>
                        <Box display="flex" justifyContent="space-between">
                            <strong>Products</strong>
                            <IconButton
                                color="primary"
                                onClick={handleAddProduct}
                            >
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </Box>
                        {products.map((product, index) => (
                            <Box
                                key={index}
                                display="flex"
                                gap={2}
                                alignItems="center"
                                mb={2}
                            >
                                <FormControl fullWidth>
                                    <InputLabel>Product</InputLabel>
                                    <Select
                                        value={product.productId || ""}
                                        onChange={(e) =>
                                            handleProductSelect(
                                                index,
                                                e.target.value as string
                                            )
                                        }
                                    >
                                        {getAvailableProducts(index).map(
                                            (p) => (
                                                <MenuItem
                                                    key={p.id}
                                                    value={p.id}
                                                >
                                                    {p.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Quantity"
                                    type="number"
                                    value={product.quantity || 1}
                                    onChange={(e) =>
                                        handleProductChange(
                                            index,
                                            "quantity",
                                            parseInt(e.target.value, 10) || 1
                                        )
                                    }
                                    fullWidth
                                    inputProps={{
                                        max:
                                            productsList.find(
                                                (p) =>
                                                    p.id === product.productId
                                            )?.quantity || 1,
                                    }}
                                />
                                <TextField
                                    label="Price"
                                    type="number"
                                    value={product.price || 0}
                                    disabled
                                    fullWidth
                                />
                                <IconButton
                                    color="error"
                                    onClick={() => handleRemoveProduct(index)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                    <TextField
                        select
                        label="Status"
                        value={status || "pending"}
                        onChange={(e) => setStatus(e.target.value)}
                        fullWidth
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose("cancel")} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                >
                    {order ? "Save Changes" : "Create Order"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDialog;
