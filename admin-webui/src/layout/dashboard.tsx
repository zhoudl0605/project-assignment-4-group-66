import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const DashboardLayout = (props: any) => {
    const { children, window, pagename } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const navigate = useNavigate();

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const routers = [
        { name: "Users", path: "/users" },
        // { name: "Categories", path: "/categories" },
        // { name: "Payment Methods", path: "/payment-methods" },
        { name: "Products", path: "/products" },
        { name: "Orders", path: "/orders" },
        // { name: "Transactions", path: "/transactions" },
    ];

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {routers.map((route, index) => (
                    <ListItem key={route.name} disablePadding>
                        <ListItemButton
                            selected={pagename === route.name}
                            onClick={() => navigate(route.path)}
                        >
                            <ListItemText primary={route.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const container =
        window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: "flex" }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        {pagename}
                    </Typography>
                    <Button
                        color="error"
                        onClick={logoutAction}
                        variant="contained"
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Temporary Drawer */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                {/* Permanent Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3, // Padding around the content
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    mt: { xs: `64px`, sm: `64px` }, // Ensure the main content doesn't overlap AppBar
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

async function logoutAction() {
    sessionStorage.removeItem("token");
    window.location.href = "/login";
}

export default DashboardLayout;
