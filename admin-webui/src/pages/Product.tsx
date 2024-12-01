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
import ProductDialog from "./product/ProductDialog";
import Layout from "../layout/dashboard";

interface ProductData {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    brand: string;
    sku: string;
    medias: string[];
    specs: string[];
}

export default function ProductPage() {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<
        ProductData | undefined
    >();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch products from API
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/products`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();

            const formattedProducts = data.data.map((product: any) => ({
                id: product._id,
                name: product.name,
                category: product.category,
                price: product.price,
                stock: product.stock,
                sku: product.sku,
                brand: product.brand,
                medias: product.medias,
                specs: product.specs,
            }));

            setProducts(formattedProducts);
            setLoading(false);
        } catch (err: any) {
            console.error(err);

            setError(err.message);
            setLoading(false);
        }
    };

    const updateProduct = async (product: ProductData) => {
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/products/${product.id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            if (!response.ok) {
                throw new Error("Failed to update product");
            }

            window.location.reload();
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const deleteProduct = async (productId: string) => {
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/products/${productId}`;
            const response = await fetch(url, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            // Remove product from state
            setProducts((prev) => prev.filter((p) => p.id !== productId));

            window.location.reload();
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const handleOpenDialog = (product?: ProductData) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const handleCloseDialog = async (
        action: string,
        updatedProduct?: ProductData
    ) => {
        setDialogOpen(false);

        if (action === "add" && updatedProduct) {
            // Add product logic
            try {
                const url = `${process.env.REACT_APP_API_BASE_URL}/products`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedProduct),
                });
                if (!response.ok) {
                    throw new Error("Failed to add product");
                }

                window.location.reload();
            } catch (err: any) {
                console.error("Error adding product:", err.message);
                setError(err.message);
            }
        } else if (action === "edit" && updatedProduct) {
            // Edit product logic
            try {
                await updateProduct(updatedProduct);
                // Reload products
                await fetchProducts();
            } catch (err: any) {
                console.error("Error updating product:", err.message);
                setError(err.message);
            }
        }
    };

    return (
        <Layout pagename="Product">
            <Box>
                <Button
                    variant="contained"
                    onClick={() => handleOpenDialog()}
                    sx={{ my: 2 }}
                >
                    Add Product
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
                                    <TableCell>Name</TableCell>
                                    <TableCell>Brand</TableCell>
                                    <TableCell>SKU</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.brand}</TableCell>
                                        <TableCell>{product.sku}</TableCell>
                                        <TableCell>
                                            {product.category}
                                        </TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() =>
                                                    handleOpenDialog(product)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    deleteProduct(product.id)
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
                <ProductDialog
                    open={dialogOpen}
                    product={selectedProduct}
                    onClose={handleCloseDialog}
                />
            </Box>
        </Layout>
    );
}
