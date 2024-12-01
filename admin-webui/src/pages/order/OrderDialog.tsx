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

interface OrderDialogProps {
    open: boolean;
    order?: OrderData;
    productsList: { id: string; name: string; price: number }[]; // Product list with price
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

    const handleProductChange = (
        index: number,
        field: keyof ProductData,
        value: string | number
    ) => {
        const updatedProducts = [...products];
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
                price: selectedProduct.price, // Automatically set the price
            };
            setProducts(updatedProducts);
        }
    };

    const handleSubmit = () => {
        const updatedOrder: OrderData = {
            id: order?.id,
            userId,
            products,
            status,
        };
        onClose(order ? "edit" : "add", updatedOrder);
    };

    const getAvailableProducts = (index: number) => {
        // Exclude already-selected products except the one being edited
        const selectedIds = products
            .map((p, i) => (i !== index ? p.productId : null))
            .filter((id) => id !== null);
        return productsList.filter((p) => !selectedIds.includes(p.id));
    };

    return (
        <Dialog open={open} onClose={() => onClose("cancel")} fullWidth>
            <DialogTitle>{order ? "Edit Order" : "Add Order"}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="User ID"
                        value={userId || ""}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        fullWidth
                    />
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
                        SelectProps={{
                            native: true,
                        }}
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
