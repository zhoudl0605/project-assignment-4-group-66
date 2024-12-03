import React, { useContext } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import AppContext from './AppContext';

function Recommendations() {
    const { addToCart } = useContext(AppContext); // Retrieve the addToCart function from the context

    const recommendations = [
        { id: 1, name: 'Product 1', price: 100, img: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Product 2', price: 150, img: 'https://via.placeholder.com/150' },
        { id: 3, name: 'Product 3', price: 200, img: 'https://via.placeholder.com/150' },
        { id: 4, name: 'Product 4', price: 250, img: 'https://via.placeholder.com/150' },
        { id: 5, name: 'Product 5', price: 300, img: 'https://via.placeholder.com/150' },
        { id: 6, name: 'Product 6', price: 350, img: 'https://via.placeholder.com/150' },
        { id: 7, name: 'Product 7', price: 400, img: 'https://via.placeholder.com/150' },
        { id: 8, name: 'Product 8', price: 450, img: 'https://via.placeholder.com/150' },
        { id: 9, name: 'Product 9', price: 500, img: 'https://via.placeholder.com/150' },
    ];

    return (
        <Box
            display="flex"
            justifyContent="center"
            flexWrap="wrap"
            gap={4}
            mt={5}
        >
            {recommendations.map((item) => (
                <Card key={item.id} sx={{ maxWidth: 200, boxShadow: 3 }}>
                    <CardMedia
                        component="img"
                        height="150"
                        image={item.img}
                        alt={item.name}
                    />
                    <CardContent>
                        <Typography variant="h6" component="div" textAlign="center">
                            {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            ${item.price}
                        </Typography>
                        <Box textAlign="center" mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => addToCart(item)}
                            >
                                Add to Cart
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

export default Recommendations;
