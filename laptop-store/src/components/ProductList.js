import React, { useContext } from 'react';
import AppContext from './AppContext';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

// 假设每个区域有20个产品，每个产品有对应的图片
const desktopProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    sku: `SKU${i + 1}`,
    name: `Desktop Product ${i + 1}`,
    price: (i + 1) * 100,
    image: `/images/desktop${i + 1}-1.png`
}));

const laptopProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 21,
    sku: `SKU${i + 1}`,
    name: `Laptop Product ${i + 1}`,
    price: (i + 1) * 150,
    image: `/images/laptop${i + 1}-1.png`
}));

const accessoryProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 41,
    sku: `SKU${i + 1}`,
    name: `Accessory Product ${i + 1}`,
    price: (i + 1) * 20,
    image: `/images/accessory${i + 1}-1.png`
}));

function ProductList() {
    const { addToCart } = useContext(AppContext); // 获取 addToCart 函数

    return (
        <Box padding={3}>
            {/* Desktop 产品展示 */}
            <Box mb={5}>
                <Typography variant="h4" gutterBottom align="center">
                    Desktop Products
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {desktopProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={product.id}>
                            <Card sx={{ textAlign: 'center' }}>
                                <Link to={`/products/${product.sku}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Box
                                        sx={{
                                            width: 200,
                                            height: 200,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            margin: '0 auto',
                                        }}
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {product.name}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            ${product.price}
                                        </Typography>
                                    </CardContent>
                                </Link>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginTop: 2 }}
                                    onClick={() => addToCart(product)} // 添加到购物车
                                >
                                    Add to Cart
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {/* Laptop 产品展示 */}
            <Box mb={5}>
                <Typography variant="h4" gutterBottom align="center">
                    Laptop Products
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {laptopProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={product.id}>
                            <Card sx={{ textAlign: 'center' }}>
                                <Link to={`/products/${product.sku}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Box
                                        sx={{
                                            width: 200,
                                            height: 200,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            margin: '0 auto',
                                        }}
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {product.name}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            ${product.price}
                                        </Typography>
                                    </CardContent>
                                </Link>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginTop: 2 }}
                                    onClick={() => addToCart(product)} // 添加到购物车
                                >
                                    Add to Cart
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {/* Accessory 产品展示 */}
            <Box mb={5}>
                <Typography variant="h4" gutterBottom align="center">
                    Accessory Products
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {accessoryProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={product.id}>
                            <Card sx={{ textAlign: 'center' }}>
                                <Link to={`/products/${product.sku}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Box
                                        sx={{
                                            width: 200,
                                            height: 200,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            margin: '0 auto',
                                        }}
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {product.name}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            ${product.price}
                                        </Typography>
                                    </CardContent>
                                </Link>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginTop: 2 }}
                                    onClick={() => addToCart(product)} // 添加到购物车
                                >
                                    Add to Cart
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default ProductList;
