// frontend/src/components/Sidebar.tsx

import type { FilterType } from '../types';
// 1. 从 react-icons 导入我们需要的图标
import { FaBook, FaStar, FaTrash, FaLightbulb } from 'react-icons/fa';

type SidebarProps = {
  onNewNote: () => void;
  onFilterChange: (filter: FilterType) => void;
  activeFilter: FilterType;
};

function Sidebar({ onNewNote, onFilterChange, activeFilter }: SidebarProps) {
  return (
    <aside className="sidebar">
      {/* 这个外层 div 用于 flex 布局，将 footer 推向底部 */}
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

      <div className="sidebar-footer">
        MindSphere v1.0
      </div>
    </aside>
  );
}

export default Sidebar;