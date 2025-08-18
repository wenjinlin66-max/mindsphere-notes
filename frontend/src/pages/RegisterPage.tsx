// frontend/src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as notesApi from '../api/notesApi';
import { FaLightbulb } from 'react-icons/fa';

// 导入共享样式
import './Form.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('用户名和密码不能为空');
      return;
    }

    try {
      await notesApi.register({ username, password });
      navigate('/login?registered=true'); 
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.username) {
        setError(`注册失败: ${err.response.data.username[0]}`);
      } else {
        setError('注册失败，请稍后重试。');
      }
      console.error("注册失败:", err);
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
          <h1 className="form-title">创建新账户</h1>
          <p className="form-subtitle">开启您的个人知识管理之旅</p>
        </header>

        <form onSubmit={handleSubmit}>
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
          
          <button type="submit" className="submit-btn">注册</button>
        </form>

        <p className="switch-form-text">
          已经有账户了？ <Link to="/login">点此登录</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;