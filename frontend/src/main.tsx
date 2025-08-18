// frontend/src/main.tsx (全新的、作为路由中心的代码)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import App from './App'; // 你的主应用组件
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 受保护的路由 */}
          <Route element={<ProtectedRoute />}>
            {/* 当用户登录后，所有其他路径 ("/*") 都会匹配并渲染你的 <App /> 组件 */}
            <Route path="/*" element={<App />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);