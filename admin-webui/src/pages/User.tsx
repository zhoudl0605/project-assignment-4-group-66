import React, { useEffect, useState } from "react";
import logo from "../logo.svg";
import Layout from "../layout/dashboard";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { blue } from "@mui/material/colors";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";

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
export interface UserDialogProps {
    open: boolean;
    user: UserData | undefined;
    onClose: (value: string) => void;
}

function UserDialog(props: UserDialogProps) {
    const { onClose, user, open } = props;
    const [userData, setUserData] = useState<UserData>({
        id: user ? user.id : "",
        name: user ? user.name : "",
        email: user ? user.email : "",
        role: user ? user.role : "user",
        address: {
            address1: user ? user.address.address1 : "",
            address2: user ? user.address.address2 : "",
            city: user ? user.address.city : "",
            province: user ? user.address.province : "",
            postalCode: user ? user.address.postalCode : "",
        },
    }); // 存储用户数据

    useEffect(() => {
        setUserData({
            id: user ? user.id : "",
            name: user ? user.name : "",
            email: user ? user.email : "",
            role: user ? user.role : "user",
            address: {
                address1: user ? user.address.address1 : "",
                address2: user ? user.address.address2 : "",
                city: user ? user.address.city : "",
                province: user ? user.address.province : "",
                postalCode: user ? user.address.postalCode : "",
            },
        });
    }, [user]);

    const handleClose = () => {
        onClose(user ? "edit" : "add");
    };

    const handleChange =
        (field: string) =>
        (
            event: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | { value: unknown }
            >
        ) => {
            const value = event.target.value;

            if (field.includes(".")) {
                const keys = field.split(".");
                setUserData((prev) => {
                    const updatedUserData = { ...prev };
                    let current: any = updatedUserData;

                    keys.slice(0, -1).forEach((key) => {
                        current[key] = { ...current[key] };
                        current = current[key];
                    });

                    current[keys[keys.length - 1]] = value;
                    return updatedUserData;
                });
            } else {
                setUserData((prev) => ({
                    ...prev,
                    [field]: value,
                }));
            }
        };

    return (
        <Dialog onClose={handleClose} open={open} fullWidth={true}>
            <DialogTitle>Set backup account</DialogTitle>
            <DialogContent>
                {userData && (
                    <Box>
                        <div>ID: {userData.id}</div>
                        <div>Name: {userData.name}</div>
                        <div>Email: {userData.email}</div>
                        <div>Role: {userData.role}</div>
                    </Box>
                )}
                <List sx={{ pt: 0 }}>
                    <ListItem disableGutters>
                        <TextField
                            fullWidth={true}
                            id="name"
                            label="Name"
                            value={userData.name}
                            onChange={handleChange("name")}
                            required
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <TextField
                            fullWidth={true}
                            id="id"
                            label="ID"
                            value={userData.id}
                            disabled
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <TextField
                            fullWidth={true}
                            id="email"
                            label="Email"
                            value={userData.email}
                            onChange={handleChange("email")}
                        />
                    </ListItem>
                    <Select
                        id="role"
                        value={userData.role}
                        label="Role"
                        fullWidth={true}
                        onChange={(event) =>
                            handleChange("role")(
                                event as React.ChangeEvent<{ value: unknown }>
                            )
                        }
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                    </Select>
                    <ListItem disableGutters>
                        <TextField
                            fullWidth={true}
                            id="address1"
                            label="Address1"
                            value={userData.address.address1}
                            onChange={handleChange("address1")}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <TextField
                            fullWidth={true}
                            id="address2"
                            label="Address2"
                            value={userData.address.address2}
                            onChange={handleChange("address.address2")}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <TextField
                            fullWidth={true}
                            id="city"
                            label="City"
                            value={userData.address.city}
                            onChange={handleChange("city")}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <TextField
                            fullWidth={true}
                            id="province"
                            label="Province"
                            value={userData.address.province}
                            onChange={handleChange("province")}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <TextField
                            fullWidth={true}
                            id="postalCode"
                            label="Postal Code"
                            value={userData.address.postalCode}
                            onChange={handleChange("postalCode")}
                        />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export interface UserDeleteDialogProps {
    open: boolean;
    user: UserData | undefined;
    onClose: (value: string) => void;
}

function UserDeleteDialog(props: UserDeleteDialogProps) {
    const { onClose, user, open } = props;

    const handleClose = () => {
        onClose(user ? "edit" : "add");
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Set backup account</DialogTitle>
            <DialogContent>
                <List sx={{ pt: 0 }}>
                    <ListItem disableGutters>
                        {user && (
                            <Box>
                                <div>ID: {user.id}</div>
                                <div>Name: {user.name}</div>
                                <div>Email: {user.email}</div>
                            </Box>
                        )}
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function UserPage() {
    const [users, setUsers] = useState<UserData[]>([]); // 存储用户数据
    const [selectedUser, setSelectedUser] = useState<UserData>(); // 存储用户数据
    const [loading, setLoading] = useState(true); // 加载状态
    const [error, setError] = useState(""); // 错误状态
    const [page, setPage] = useState(1); // 当前页码
    const [total, setTotal] = useState(0); // 总用户数
    const [skip, setSkip] = useState(0); // 跳过的用户数
    const [profileDialogSwitch, setProfileDialogSwitch] = useState(false); // 对话框开关
    const [deletedialogSwitch, setDeleteDialogSwitch] = useState(false); // 对话框开关

    // 获取用户数据
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let url = process.env.REACT_APP_API_BASE_URL + "/users";
                console.log(url);
                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await res.json();
                console.log(data);

                setUsers(
                    data.result.data.map((user: any) => ({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        address: {
                            address1: user?.address?.address1 || "",
                            address2: user?.address?.address2 || "",
                            city: user?.address?.city || "",
                            province: user?.address?.province || "",
                            postalCode: user?.address?.postalCode || "",
                        },
                    }))
                );
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // open dialog
    const handleClickOpen = (
        user: UserData | undefined,
        setter: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        setSelectedUser(user);
        setter(true);
    };

    const handleClose = (value: string) => {
        setProfileDialogSwitch(false);
        setDeleteDialogSwitch(false);
    };

    return (
        <Layout pagename="User">
            <Box>
                <Box>
                    <Button
                        sx={{
                            m: 2,
                        }}
                        variant="contained"
                        onClick={() =>
                            handleClickOpen(undefined, setProfileDialogSwitch)
                        }
                    >
                        Add User
                    </Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>email</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow
                                    key={user.id}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {user.id}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {user.email}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {user.name}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Button
                                            onClick={() =>
                                                handleClickOpen(
                                                    user,
                                                    setProfileDialogSwitch
                                                )
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleClickOpen(
                                                    user,
                                                    setDeleteDialogSwitch
                                                )
                                            }
                                        >
                                            {" "}
                                            Remove{" "}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <UserDialog
                    open={profileDialogSwitch}
                    user={selectedUser}
                    onClose={handleClose}
                />
                <UserDeleteDialog
                    open={deletedialogSwitch}
                    user={selectedUser}
                    onClose={handleClose}
                />
            </Box>
        </Layout>
    );
}
