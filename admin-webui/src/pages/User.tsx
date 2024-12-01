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

interface UserData {
    id: string;
    name: string;
    email: string;
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
            console.log(data);

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

            console.log(formattedUsers);

            setUsers(formattedUsers);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const updateUser = async (user: UserData) => {
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/users/${user.id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            const data = await response.json();

            return data.result;
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
                const url = `${process.env.REACT_APP_API_BASE_URL}/users`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedUser),
                });
                if (!response.ok) {
                    throw new Error("Failed to add user");
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
            });
            if (!response.ok) {
                throw new Error("Failed to delete user");
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
