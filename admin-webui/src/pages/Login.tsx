import { Box, Container, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 阻止表单默认提交行为

        // 基本表单验证
        if (!email || !password) {
            setError("Email and Password are required.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setError(""); // 清空错误
        await loginAction(email, password);
    };

    // check if user is already logged in
    const token = sessionStorage.getItem("token");
    if (token) {
        window.location.href = "/"; // redirect to home page
        return null;
    }

    return (
        <Container
            maxWidth="sm"
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    "& > *": { m: 1 },
                }}
                component="form"
                onSubmit={handleLogin} // 绑定表单提交事件
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Login Admin Panel
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column", // 垂直排列
                        gap: 2, // 子元素之间的间距
                    }}
                >
                    <TextField
                        fullWidth
                        required
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // 数据绑定
                    />
                    <TextField
                        fullWidth
                        required
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // 数据绑定
                    />
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!email || !password} // 禁用逻辑
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

async function loginAction(email: string, password: string) {
    let url = process.env.REACT_APP_API_BASE_URL + "/auth/login";

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role: "admin" }),
        });

        if (res.ok) {
            const data = await res.json();
            console.log("Login response:", data);
            const token = data.data.token;
            sessionStorage.setItem("token", token);
            window.location.href = "/"; // 重定向到首页
        } else {
            const errorData = await res.json();
            console.error("Login failed:", errorData.message || res.statusText);
            alert("Login failed: " + (errorData.message || res.statusText));
        }
    } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred during login. Please try again later.");
    }
}

// 工具函数：验证邮箱格式
function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export default LoginPage;
