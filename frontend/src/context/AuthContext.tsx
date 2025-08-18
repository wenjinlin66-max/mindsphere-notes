// frontend/src/context/AuthContext.tsx


import { createContext, useState,  useContext, useEffect } from 'react';
import type {  ReactNode } from 'react';
import * as notesApi from '../api/notesApi';
import { jwtDecode } from 'jwt-decode'; // 需要安装一个新库

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 添加加载状态

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded: { exp: number } = jwtDecode(token);
          // 检查 token 是否过期
          if (decoded.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
          } else {
            // token 过期，清除它
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
          }
        } catch (error) {
          // token 无效，清除它
          localStorage.removeItem('accessToken');
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (data: any) => {
    const response = await notesApi.login(data);
    const { access } = response.data;
    localStorage.setItem('accessToken', access);
    // 直接更新状态，拦截器会处理后续请求
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    // 可以考虑强制跳转到登录页
    window.location.href = '/login';
  };

  // 在验证完成前，不渲染子组件
  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};