// frontend/src/pages/LoginPage.tsx

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaLightbulb } from 'react-icons/fa'; // 导入Logo图标

// 导入我们刚刚创建的样式
import './Form.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 检查 URL 中是否有 'registered=true' 参数
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registered') === 'true') {
      setSuccessMessage('注册成功！现在请登录。');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (!auth) throw new Error('AuthContext is not available');
      await auth.login({ username, password });
      navigate('/'); // 登录成功后跳转到主应用
    } catch (err: any) {
      setError('用户名或密码错误，请重试。');
      console.error("登录失败:", err);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <header className="form-header">
          <div className="form-logo">
            <FaLightbulb size="28" color="var(--primary-blue)" />
            <h2>MindSphere</h2>
          </div>
          <h1 className="form-title">欢迎回来</h1>
          <p className="form-subtitle">登录以继续使用您的知识库</p>
        </header>

        <form onSubmit={handleSubmit}>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {error && <p className="error-message">{error}</p>}
          
          <div className="input-group">
            <label htmlFor="username">用户名</label>
            <input
              id="username"
              className="input-field"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">密码</label>
            <input
              id="password"
              className="input-field"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="submit-btn">登录</button>
        </form>

        <p className="switch-form-text">
          还没有账户？ <Link to="/register">立即注册</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;