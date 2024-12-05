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
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import ProductDialog from "./product/ProductDialog";
import Layout from "../layout/dashboard";
import useCsrfToken from "../hooks/useCsrfToken";

export interface ProductData {
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

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [priceRange, setPriceRange] = useState<[number, number]>([
        0,
        Infinity,
    ]);
    const csrfToken = useCsrfToken();

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
            const token = sessionStorage.getItem("token");
            const url = `${process.env.REACT_APP_API_BASE_URL}/products/${product.id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": csrfToken,
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(product),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to update product");
            }

            window.location.reload();
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const handleCloseDialog = async (
        action: string,
        updatedProduct?: ProductData
    ) => {
        setDialogOpen(false);

        if (action === "add" && updatedProduct) {
            // Add product logic
            try {
                const token = sessionStorage.getItem("token");
                const url = `${process.env.REACT_APP_API_BASE_URL}/products`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "CSRF-Token": csrfToken,
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedProduct),
                    credentials: "include",
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

    const deleteProduct = async (productId: string) => {
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/products/${productId}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "CSRF-Token": csrfToken,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            setProducts((prev) => prev.filter((p) => p.id !== productId));
        } catch (err: any) {
            console.error("Failed to Delete Product:", err.message);
            setError(err.message);
        }
    };

    const handleOpenDialog = (product?: ProductData) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    // const handleCloseDialog = async (
    //     action: string,
    //     updatedProduct?: ProductData
    // ) => {
    //     setDialogOpen(false);
    //     if (action === "add" || action === "edit") {
    //         fetchProducts();
    //     }
    // };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesBrand = !selectedBrand || product.brand === selectedBrand;
        const matchesPrice =
            product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesBrand && matchesPrice;
    });

    return (
        <Layout pagename="Product">
            <Box>
                <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                    <TextField
                        label="Product Name"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: "30%" }}
                    />
                    <FormControl sx={{ width: "20%" }}>
                        <InputLabel>Brand</InputLabel>
                        <Select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            label="Brand"
                        >
                            <MenuItem value="">All Brands</MenuItem>
                            {Array.from(
                                new Set(products.map((p) => p.brand))
                            ).map((brand) => (
                                <MenuItem key={brand} value={brand}>
                                    {brand}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: "20%" }}>
                        <InputLabel>Price Range</InputLabel>
                        <Select
                            value={`${priceRange[0]}-${priceRange[1]}`}
                            onChange={(e) => {
                                const range = e.target.value
                                    .split("-")
                                    .map(Number);
                                setPriceRange([range[0], range[1]]);
                            }}
                            label="Price Range"
                        >
                            <MenuItem value="0-Infinity">All</MenuItem>
                            <MenuItem value="0-50">Lower than $50</MenuItem>
                            <MenuItem value="50-100">$50 - $100</MenuItem>
                            <MenuItem value="100-500">$100 - $500</MenuItem>
                            <MenuItem value="500-1000">$500 - $1000</MenuItem>
                            <MenuItem value="1000-5000">$1000 - $2000</MenuItem>
                            <MenuItem value="2000-5000">$2000 - $5000</MenuItem>
                            <MenuItem value="5000-Infinity">
                                Higher $5000
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>
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
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProducts.map((product) => (
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
