// frontend/src/components/NoteList.tsx

import type { Note } from '../types';
import { FaSearch, FaStar, FaRegStar, FaTrash } from 'react-icons/fa';
// 导入 date-fns 用于显示相对时间
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

type NoteListProps = {
  notes: Note[];
  isLoading: boolean;
  activeNoteId: number | null;
  onSelectNote: (id: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onToggleFavorite: (id: number, isFavorite: boolean) => void;
  onToggleTrash: (id: number, isTrashed: boolean) => void;
};

function NoteList({
  notes,
  isLoading,
  activeNoteId,
  onSelectNote,
  searchTerm,
  onSearchChange,
  onToggleFavorite,
  onToggleTrash
}: NoteListProps) {

  const createExcerpt = (content: string, length: number = 60) => {
    if (!content) return '这篇笔记没有内容...';
    const plainText = content.replace(/(\*|_|#|`|~|>)/g, '');
    if (plainText.length <= length) return plainText;
    return plainText.substring(0, length) + '...';
  };

  const renderNoteCard = (note: Note) => {
    const remainingTags = note.tags.length > 2 ? note.tags.length - 2 : 0;
    const timeAgo = formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: zhCN });

    return (
      <div
        key={note.id}
        className={`note-card ${activeNoteId === note.id ? 'active' : ''}`}
        onClick={() => onSelectNote(note.id)}
      >
        <div className="note-card-header">
          <h3 className="note-card-title">{note.title || "无标题笔记"}</h3>
          <span className="note-card-time">{timeAgo}</span>
        </div>

        <p className="note-card-excerpt">{createExcerpt(note.content || '')}</p>

        <div className="note-card-tags">
          {note.tags.slice(0, 2).map(tag => (
            <span key={tag.id} className="tag-pill" data-tag-name={tag.name}>
              {tag.name}
            </span>
          ))}
          {remainingTags > 0 && (
            <span className="tag-pill tag-plus">+{remainingTags}</span>
          )}
        </div>

        {/* 收藏和删除按钮 (在 CSS 中通过 hover 和 active 控制显示) */}
        <div className="note-card-actions">
          <button 
            className="icon-btn"
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(note.id, note.is_favorite); }}
          >
            {note.is_favorite ? <FaStar color="#FFD700" /> : <FaRegStar />}
          </button>
          <button 
            className="icon-btn"
            onClick={(e) => { e.stopPropagation(); onToggleTrash(note.id, note.is_trashed); }}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="note-list">
      <div className="note-list-header">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="搜索笔记..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="note-list-body">
        {isLoading ? (
          <p className="loading-text">加载中...</p>
        ) : notes.length > 0 ? (
          notes.map(renderNoteCard)
        ) : (
          <p className="empty-text">没有找到笔记</p>
        )}
      </div>
    </div>
  );
}

export default NoteList;