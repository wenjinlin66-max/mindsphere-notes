// frontend/src/components/Sidebar.tsx

import { useContext } from 'react'; // 1. 导入 useContext hook
import type { FilterType } from '../types';
import { FaBook, FaStar, FaTrash, FaLightbulb, FaSignOutAlt } from 'react-icons/fa'; // 2. 导入退出图标

// 3. 导入你的认证上下文
import { AuthContext } from '../context/AuthContext';

type SidebarProps = {
  onNewNote: () => void;
  onFilterChange: (filter: FilterType) => void;
  activeFilter: FilterType;
};

function Sidebar({ onNewNote, onFilterChange, activeFilter }: SidebarProps) {
  // 4. 使用 useContext 来获取认证状态和方法
  const auth = useContext(AuthContext);

  // 这是一个很好的防御性编程习惯，确保在 context 未加载完成时不渲染
  if (!auth) {
    return null; 
  }

  // 从 context 中解构出 logout 方法
  const { logout } = auth;

  return (
    <aside className="sidebar">
      {/* 顶部内容 */}
      <div style={{ flexGrow: 1 }}>
        <div className="sidebar-header">
          <FaLightbulb size="24" color="var(--primary-blue)" />
          <h2>MindSphere</h2>
        </div>
        
        <button className="new-note-btn" onClick={onNewNote}>
          + 新建笔记
        </button>

        <nav className="sidebar-nav">
          <button 
            className={`nav-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            <FaBook /> <span>知识库</span>
          </button>
          <button 
            className={`nav-btn ${activeFilter === 'favorites' ? 'active' : ''}`}
            onClick={() => onFilterChange('favorites')}
          >
            <FaStar /> <span>收藏夹</span>
          </button>
          <button 
            className={`nav-btn ${activeFilter === 'trashed' ? 'active' : ''}`}
            onClick={() => onFilterChange('trashed')}
          >
            <FaTrash /> <span>废纸篓</span>
          </button>
        </nav>
      </div>

      {/* 底部内容 */}
      <div className="sidebar-footer">
        {/* 5. 添加退出登录按钮，并将其 onClick 事件绑定到 logout 方法 */}
        <button className="nav-btn logout-btn" onClick={logout}>
          <FaSignOutAlt /> <span>退出登录</span>
        </button>
        MindSphere v1.0
      </div>
    </aside>
  );
}

export default Sidebar;