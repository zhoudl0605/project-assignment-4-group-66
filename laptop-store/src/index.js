import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18+ 使用 createRoot
import App from './components/App'; // 确保 App.js 路径正确
import { ThemeProvider } from '@mui/material/styles'; // 从 Material-UI 中导入 ThemeProvider
import theme from './theme'; // 自定义的 Material-UI 主题
import './index.css'; // 引入全局样式

// 选择 HTML 文件中的 root 节点进行渲染
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
