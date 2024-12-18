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
import UserDialog from "./user/UserDialog";
import Layout from "../layout/dashboard";
import useCsrfToken from "../hooks/useCsrfToken";

export interface UserData {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    address: {
        address1: string;
        address2: string;
        city: string;
        province: string;
        postalCode: string;
    };
}

export default function UserPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserData | undefined>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const csrfToken = useCsrfToken();

    // Fetch users from API
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
                password: "",
                address: {
                    address1: user.address?.address1 || "",
                    address2: user.address?.address2 || "",
                    city: user.address?.city || "",
                    province: user.address?.province || "",
                    postalCode: user.address?.postalCode || "",
                },
            }));

            setUsers(formattedUsers);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const updateUser = async (user: UserData) => {
        try {
            const token = sessionStorage.getItem("token");
            const url = `${process.env.REACT_APP_API_BASE_URL}/users/${user.id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": csrfToken,
                    Authorization: `${token}`,
                },
                body: JSON.stringify(user),
                credentials: "include",
            });

            const body = await response.json();
            if (!response.ok) {
                throw new Error(body.message ?? "Failed to update user");
            }

            return body.result;
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const handleOpenDialog = (user?: UserData) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleCloseDialog = async (
        action: string,
        updatedUser?: UserData
    ) => {
        setDialogOpen(false);

        if (action === "add" && updatedUser) {
            // 新增用户逻辑
            try {
                const token = sessionStorage.getItem("token");
                const url = `${process.env.REACT_APP_API_BASE_URL}/users`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "CSRF-Token": csrfToken,
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify(updatedUser),
                });

                const body = await response.json();
                if (!response.ok) {
                    throw new Error(body.message ?? "Failed to add user");
                }

                window.location.reload();
            } catch (err: any) {
                console.error("Error adding user:", err.message);
                setError(err.message);
            }
        } else if (action === "edit" && updatedUser) {
            // 编辑用户逻辑
            try {
                await updateUser(updatedUser);
                window.location.reload();
            } catch (err: any) {
                console.error("Error updating user:", err.message);
                setError(err.message);
            }
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/users/${userId}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "CSRF-Token": csrfToken,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                credentials: "include",
            });

            const body = await response.json();
            if (!response.ok) {
                throw new Error(body.message ?? "Failed to add user");
            }

            window.location.reload();
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    return (
        <Layout pagename="User">
            <Box>
                <Button
                    variant="contained"
                    onClick={() => handleOpenDialog()}
                    sx={{ my: 2 }}
                >
                    Add User
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
                {!loading && !error && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() =>
                                                    handleOpenDialog(user)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    deleteUser(user.id)
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
                <UserDialog
                    open={dialogOpen}
                    user={selectedUser}
                    onClose={handleCloseDialog}
                />
            </Box>
        </Layout>
    );
}
