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
import CategoryDialog from "./category/CategoryDialog";
import Layout from "../layout/dashboard";

interface CategoryData {
    id: string;
    name: string;
    description: string;
    image: string;
}

export default function CategoryPage() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<
        CategoryData | undefined
    >();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories from API
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/categories`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const data = await response.json();
            const formattedCategories = data.data.map((category: any) => ({
                id: category._id,
                name: category.name,
                description: category.description,
                image: category.image,
            }));

            setCategories(formattedCategories);
            setLoading(false);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleOpenDialog = (category?: CategoryData) => {
        setSelectedCategory(category);
        setDialogOpen(true);
    };

    const handleCloseDialog = async (
        action: string,
        updatedCategory?: CategoryData
    ) => {
        setDialogOpen(false);

        if (action === "add" && updatedCategory) {
            try {
                const url = `${process.env.REACT_APP_API_BASE_URL}/categories`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedCategory),
                });
                if (!response.ok) {
                    throw new Error("Failed to add category");
                }

                const data = await response.json();
                setCategories((prev) => [...prev, data.result]); // Assuming backend returns the new category
                window.location.reload();
            } catch (err: any) {
                console.error("Error adding category:", err.message);
                setError(err.message);
            }
        } else if (action === "edit" && updatedCategory) {
            try {
                const url = `${process.env.REACT_APP_API_BASE_URL}/categories/${updatedCategory.id}`;
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedCategory),
                });
                if (!response.ok) {
                    throw new Error("Failed to update category");
                }

                await fetchCategories();
            } catch (err: any) {
                console.error("Error updating category:", err.message);
                setError(err.message);
            }
        }
    };

    return (
        <Layout pagename="Category">
            <Box>
                <Button
                    variant="contained"
                    onClick={() => handleOpenDialog()}
                    sx={{ my: 2 }}
                >
                    Add Category
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
                                    <TableCell>Description</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.id}</TableCell>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>
                                            {category.description}
                                        </TableCell>
                                        <TableCell>
                                            {category.image ? (
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                    }}
                                                />
                                            ) : null}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() =>
                                                    handleOpenDialog(category)
                                                }
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <CategoryDialog
                    open={dialogOpen}
                    category={selectedCategory}
                    onClose={handleCloseDialog}
                />
            </Box>
        </Layout>
    );
}
