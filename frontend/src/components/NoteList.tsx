// frontend/src/components/NoteList.tsx

import React from 'react'; // 导入 React 以使用类型
import type { Note } from '../types';
import { FaSearch, FaStar, FaRegStar, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 1. 导入 dnd-kit 的相关组件和 hooks
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 2. 更新 Props 类型定义，加入 setNotes
type NoteListProps = {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  isLoading: boolean;
  activeNoteId: number | null;
  onSelectNote: (id: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onToggleFavorite: (id: number, isFavorite: boolean) => void;
  onToggleTrash: (id: number, isTrashed: boolean) => void;
};

// 3. 创建一个可排序的、独立的 NoteCard 组件
//    我们将所有卡片的渲染逻辑都移到这里
function SortableNoteCard({ 
  note, 
  activeNoteId, 
  onSelectNote,
  onToggleFavorite,
  onToggleTrash
}: { 
  note: Note, 
  activeNoteId: number | null, 
  onSelectNote: (id: number) => void,
  onToggleFavorite: (id: number, isFavorite: boolean) => void,
  onToggleTrash: (id: number, isTrashed: boolean) => void,
}) {

  // dnd-kit 的核心 hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: note.id });

  // 计算拖拽时的样式
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // 辅助函数和派生状态
  const createExcerpt = (content: string, length: number = 60) => {
    if (!content) return '这篇笔记没有内容...';
    const plainText = content.replace(/(\*|_|#|`|~|>)/g, '');
    if (plainText.length <= length) return plainText;
    return plainText.substring(0, length) + '...';
  };
  const remainingTags = note.tags.length > 2 ? note.tags.length - 2 : 0;
  const timeAgo = formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: zhCN });

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners} // 拖拽句柄，应用到整个卡片
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
      <div className="note-card-actions">
        <button className="icon-btn" onClick={(e) => { e.stopPropagation(); onToggleFavorite(note.id, note.is_favorite); }}>
          {note.is_favorite ? <FaStar color="#FFD700" /> : <FaRegStar />}
        </button>
        <button className="icon-btn" onClick={(e) => { e.stopPropagation(); onToggleTrash(note.id, note.is_trashed); }}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
}


// 4. NoteList 组件现在变得非常简洁，主要负责布局和提供排序上下文
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
          <SortableContext items={notes} strategy={verticalListSortingStrategy}>
            {notes.map(note => (
              <SortableNoteCard
                key={note.id}
                note={note}
                activeNoteId={activeNoteId}
                onSelectNote={onSelectNote}
                onToggleFavorite={onToggleFavorite}
                onToggleTrash={onToggleTrash}
              />
            ))}
          </SortableContext>
        ) : (
          <p className="empty-text">没有找到笔记</p>
        )}
      </div>
    </div>
  );
}

export default NoteList;