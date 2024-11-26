import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#007bff', // 主色
        },
        secondary: {
            main: '#f50057', // 次色
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
    },
});

export default theme;



